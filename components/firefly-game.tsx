'use client'

import { useEffect, useRef } from 'react'

const W = 393
const H = 852
const N = 7           // 6-8 fireflies only
const GOAL = 5        // fireflies to catch
const TAP_R = 45      // tap detection radius (larger for better UX)
const CON_CX = W / 2
const CON_CY = H / 2 - 50

const WORDS = ['Hope', 'Calm', 'Peace', 'Breathe', 'Joy', 'Strength', 'Kindness']
const AFFIRMATION = ['You are doing better', 'than you think.']

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
}

// ── Types ────────────────────────────────────────────────────────────────────
interface FF {
  x: number; y: number; vx: number; vy: number
  r: number; bo: number; bs: number   // radius, blink offset, blink speed
  state: 'float' | 'fly' | 'hold' | 'place' | 'dissolve'
  word: string; timer: number; flash: number
  cx: number; cy: number             // constellation target
  depth: number                      // parallax depth (0.6 to 1.0)
  wingPhase: number                  // wing flicker animation
  trail: Array<{ x: number; y: number; alpha: number }>
  dissolveProgress: number
  dissolveParticles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number; size: number }>
}

interface Pop {
  text: string; x: number; y: number; alpha: number; life: number
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function mkFF(word: string): FF {
  const depth = 0.6 + Math.random() * 0.4 // Parallax depth
  return {
    x: 35 + Math.random() * (W - 70),
    y: 90 + Math.random() * (H - 230),
    vx: (Math.random() - 0.5) * 0.5 * depth,
    vy: (Math.random() - 0.5) * 0.5 * depth,
    r: (6 + Math.random() * 3) * depth, // Larger fireflies
    bo: Math.random() * Math.PI * 2,
    bs: 0.4 + Math.random() * 0.6,
    state: 'float',
    word, timer: 0, flash: 0,
    cx: 0, cy: 0,
    depth,
    wingPhase: Math.random() * Math.PI * 2,
    trail: [],
    dissolveProgress: 0,
    dissolveParticles: [],
  }
}

function conPos(idx: number): [number, number] {
  const angle = (idx / GOAL) * Math.PI * 2 - Math.PI / 2
  return [
    CON_CX + Math.cos(angle) * 56,
    CON_CY + Math.sin(angle) * 56,
  ]
}

// ── Component ────────────────────────────────────────────────────────────────
export function FireflyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    let ffs: FF[]
    let pops: Pop[]
    let caughtCount: number
    let phase: 'play' | 'form' | 'reveal'
    let revealTimer: number
    let affAlpha: number
    let fade: number          // master fade for exit animation
    let needRestart = false
    let frame = 0

    function init() {
      const shuffled = [...WORDS].sort(() => Math.random() - 0.5)
      ffs = Array.from({ length: N }, (_, i) => mkFF(shuffled[i % shuffled.length]))
      pops = []
      caughtCount = 0
      phase = 'play'
      revealTimer = 0
      affAlpha = 0
      fade = 1
    }
    init()

    // ── Scene ────────────────────────────────────────────────────────────────
    function drawScene() {
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      // Subtle organic shapes from Zumlo design system
      ctx.save()
      ctx.globalAlpha = 0.06 * fade
      ctx.fillStyle = COLORS.sageMist
      
      // Soft organic blobs
      const shapes: Array<{ x: number; y: number; r: number }> = [
        { x: 80, y: 150, r: 90 },
        { x: W - 70, y: 280, r: 110 },
        { x: 120, y: H - 200, r: 85 },
        { x: W - 100, y: H - 150, r: 95 },
      ]
      
      shapes.forEach(shape => {
        ctx.beginPath()
        ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2)
        ctx.fill()
      })
      
      ctx.restore()
    }

    // ── Firefly ──────────────────────────────────────────────────────────────
    function drawFF(ff: FF, t: number) {
      // Handle dissolve state
      if (ff.state === 'dissolve') {
        ff.dissolveProgress += 0.02
        
        // Update dissolve particles
        ff.dissolveParticles.forEach(p => {
          p.x += p.vx
          p.y += p.vy
          p.alpha = Math.max(0, p.alpha - 0.015)
        })
        
        // Draw dissolve particles
        ff.dissolveParticles.forEach(p => {
          if (p.alpha > 0) {
            ctx.save()
            ctx.globalAlpha = p.alpha * fade
            
            // Mix of Warm Sunset and Calm Teal
            const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
            grad.addColorStop(0, COLORS.warmSunset)
            grad.addColorStop(0.6, COLORS.calmTeal)
            grad.addColorStop(1, 'rgba(87,169,154,0)')
            
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
        })
        
        return
      }
      
      const blink = 0.5 + 0.5 * Math.sin(t * ff.bs + ff.bo)
      const isFlying  = ff.state === 'fly'
      const isCaught  = ff.state === 'hold' || ff.state === 'place'

      const coreAlpha = isCaught ? 0.95 : isFlying ? 1.0 : (0.4 + blink * 0.6)
      const glowScale = isCaught ? 2.2 : isFlying ? 1.8 : (1 + blink * 0.8)

      // Update wing flicker
      ff.wingPhase += 0.15
      const wingFlicker = Math.abs(Math.sin(ff.wingPhase))

      // Update trail
      if (ff.state === 'float' || ff.state === 'fly') {
        ff.trail.push({ x: ff.x, y: ff.y, alpha: 0.6 })
        if (ff.trail.length > 8) ff.trail.shift()
        
        ff.trail.forEach(t => {
          t.alpha = Math.max(0, t.alpha - 0.08)
        })
      }

      // Draw trail
      ff.trail.forEach((t, i) => {
        if (t.alpha > 0) {
          ctx.save()
          ctx.globalAlpha = t.alpha * fade * ff.depth
          
          const trailGrad = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, ff.r * 1.5)
          trailGrad.addColorStop(0, COLORS.warmSunset)
          trailGrad.addColorStop(0.7, COLORS.calmTeal)
          trailGrad.addColorStop(1, 'rgba(87,169,154,0)')
          
          ctx.fillStyle = trailGrad
          ctx.beginPath()
          ctx.arc(t.x, t.y, ff.r * 1.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      // Soft glow halo (mix of Warm Sunset and Calm Teal)
      const hr = ff.r * (3.5 + ff.flash * 1.5) * glowScale
      const halo = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, hr)
      
      if (isCaught) {
        halo.addColorStop(0, `rgba(87,169,154,${0.6 + ff.flash * 0.3})`)
        halo.addColorStop(0.4, `rgba(87,169,154,${0.25 + ff.flash * 0.15})`)
        halo.addColorStop(0.7, 'rgba(87,169,154,0.08)')
      } else {
        halo.addColorStop(0, `rgba(245,154,74,${0.7 + ff.flash * 0.3})`)
        halo.addColorStop(0.3, `rgba(87,169,154,${0.4 + ff.flash * 0.2})`)
        halo.addColorStop(0.6, 'rgba(87,169,154,0.12)')
      }
      halo.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.save()
      ctx.globalAlpha = coreAlpha * fade * ff.depth
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(ff.x, ff.y, hr, 0, Math.PI * 2)
      ctx.fill()

      // Core body with realistic glow
      ctx.shadowColor = isCaught ? COLORS.calmTeal : COLORS.warmSunset
      ctx.shadowBlur = (12 + blink * 10 + ff.flash * 18) * ff.depth
      
      // Mix colors for realistic firefly
      const coreGrad = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.r + ff.flash * 2)
      coreGrad.addColorStop(0, '#FFF8E7')
      coreGrad.addColorStop(0.4, COLORS.warmSunset)
      coreGrad.addColorStop(0.8, COLORS.calmTeal)
      coreGrad.addColorStop(1, 'rgba(87,169,154,0.6)')
      
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(ff.x, ff.y, ff.r + ff.flash * 2, 0, Math.PI * 2)
      ctx.fill()
      
      // Wing flicker (subtle)
      if (wingFlicker > 0.7) {
        ctx.globalAlpha = (wingFlicker - 0.7) * 0.3 * fade * ff.depth
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        
        // Left wing
        ctx.beginPath()
        ctx.ellipse(ff.x - ff.r * 0.8, ff.y, ff.r * 1.2, ff.r * 0.6, -0.3, 0, Math.PI * 2)
        ctx.fill()
        
        // Right wing
        ctx.beginPath()
        ctx.ellipse(ff.x + ff.r * 0.8, ff.y, ff.r * 1.2, ff.r * 0.6, 0.3, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()

      ff.flash = Math.max(0, ff.flash - 0.045)
    }

    // ── Word pops ────────────────────────────────────────────────────────────
    function stepPops() {
      pops = pops.filter(p => p.alpha > 0)
      pops.forEach(p => {
        p.life -= 0.007
        p.alpha = p.life > 0.62
          ? Math.min(1, p.alpha + 0.05)
          : Math.max(0, p.alpha - 0.022)
        p.y -= 0.44
        ctx.save()
        ctx.globalAlpha = p.alpha * fade
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '300 22px -apple-system, system-ui, sans-serif'
        ctx.fillStyle = COLORS.calmTeal
        ctx.fillText(p.text, p.x, p.y)
        ctx.restore()
      })
    }

    // ── Connection lines between constellation fireflies ──────────────────────
    function drawConnections() {
      const placed = ffs.filter(ff => ff.state === 'place' || ff.state === 'hold')
      if (placed.length < 2) return
        ctx.save()
        ctx.globalAlpha = 0.15 * fade
        ctx.strokeStyle = COLORS.calmTeal
        ctx.lineWidth = 1.2
      for (let i = 0; i < placed.length; i++) {
        for (let j = i + 1; j < placed.length; j++) {
          ctx.beginPath()
          ctx.moveTo(placed[i].x, placed[i].y)
          ctx.lineTo(placed[j].x, placed[j].y)
          ctx.stroke()
        }
      }
      ctx.restore()
    }

    // ── Main loop ────────────────────────────────────────────────────────────
    let raf: number

    function loop() {
      frame++
      if (needRestart) { needRestart = false; init() }

      const t = frame * 0.016   // ≈ seconds elapsed

      drawScene()
      drawConnections()

      ffs.forEach(ff => {
        if (ff.state === 'float') {
          // Organic floating movement like real fireflies
          const randomTurn = (Math.random() - 0.5) * 0.08 * ff.depth
          ff.vx += randomTurn
          ff.vy += randomTurn
          
          // Occasional direction changes
          if (Math.random() < 0.02) {
            ff.vx += (Math.random() - 0.5) * 0.3 * ff.depth
            ff.vy += (Math.random() - 0.5) * 0.3 * ff.depth
          }
          
          // Speed limit based on depth (closer = faster)
          const maxSpeed = 0.9 * ff.depth
          const spd = Math.hypot(ff.vx, ff.vy)
          if (spd > maxSpeed) { 
            ff.vx *= maxSpeed / spd
            ff.vy *= maxSpeed / spd
          }
          
          // Edge repulsion
          if (ff.x < 40)      ff.vx += 0.15 * ff.depth
          if (ff.x > W - 40)  ff.vx -= 0.15 * ff.depth
          if (ff.y < 90)      ff.vy += 0.15 * ff.depth
          if (ff.y > H - 110) ff.vy -= 0.15 * ff.depth
          
          ff.x += ff.vx
          ff.y += ff.vy
        }

        else if (ff.state === 'fly') {
          // Smooth flight to center
          ff.x += (CON_CX - ff.x) * 0.06
          ff.y += (CON_CY - ff.y) * 0.06
          if (Math.hypot(CON_CX - ff.x, CON_CY - ff.y) < 5) {
            ff.x = CON_CX; ff.y = CON_CY
            ff.state = 'dissolve'
            ff.timer = 0
            
            // Create dissolve particles
            ff.dissolveParticles = Array.from({ length: 20 }, () => ({
              x: ff.x + (Math.random() - 0.5) * 10,
              y: ff.y + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2 - 0.5,
              alpha: 0.8 + Math.random() * 0.2,
              size: 2 + Math.random() * 3,
            }))
            
            // Spawn floating word
            pops.push({ text: ff.word, x: W / 2, y: CON_CY - 58, alpha: 0, life: 1 })
            
            // Assign constellation slot
            const [cx, cy] = conPos(caughtCount)
            ff.cx = cx; ff.cy = cy
            caughtCount++
            if (caughtCount >= GOAL) phase = 'form'
          }
        }

        else if (ff.state === 'dissolve') {
          ff.timer++
          // After dissolve animation completes
          if (ff.timer >= 60 && ff.dissolveParticles.every(p => p.alpha <= 0)) {
            ff.state = 'hold'
            ff.x = CON_CX
            ff.y = CON_CY
            ff.timer = 0
          }
        }

        else if (ff.state === 'hold') {
          // Brief pause at center
          ff.timer++
          if (ff.timer >= 42) ff.state = 'place'
        }

        else if (ff.state === 'place') {
          // Drift to constellation position
          ff.x += (ff.cx - ff.x) * 0.038
          ff.y += (ff.cy - ff.y) * 0.038
        }

        drawFF(ff, t)
      })

      stepPops()

      // form → reveal once all constellation fireflies settle
      if (phase === 'form') {
        const placed = ffs.filter(ff => ff.state === 'place')
        if (placed.length >= GOAL &&
            placed.every(ff => Math.hypot(ff.x - ff.cx, ff.y - ff.cy) < 5)) {
          phase = 'reveal'
        }
      }

      // reveal: fade in affirmation, hold, then fade everything out
      if (phase === 'reveal') {
        revealTimer++
        affAlpha = Math.min(1, affAlpha + 0.012)

        ctx.save()
        ctx.globalAlpha = affAlpha * fade
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        AFFIRMATION.forEach((line, i) => {
          ctx.font = i === 0
            ? '300 19px -apple-system, system-ui, sans-serif'
            : '400 19px -apple-system, system-ui, sans-serif'
          ctx.fillStyle = COLORS.deepOcean
          ctx.fillText(line, W / 2, CON_CY + 98 + i * 30)
        })
        ctx.restore()

        // Hold ~4 s then exit
        if (revealTimer > 240) {
          fade = Math.max(0, fade - 0.011)
          if (fade <= 0) needRestart = true
        }
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // ── Tap ──────────────────────────────────────────────────────────────────
    function onTap(e: PointerEvent) {
      if (phase !== 'play') return
      if (ffs.filter(ff => ff.state !== 'float').length >= GOAL) return
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const tx = (e.clientX - rect.left) * (W / rect.width)
      const ty = (e.clientY - rect.top)  * (H / rect.height)
      let best: FF | null = null, bestDist = TAP_R
      ffs.forEach(ff => {
        if (ff.state !== 'float') return
        const d = Math.hypot(ff.x - tx, ff.y - ty)
        if (d < bestDist) { best = ff; bestDist = d }
      })
      if (best) { (best as FF).state = 'fly'; (best as FF).flash = 1 }
    }

    canvas.addEventListener('pointerdown', onTap, { passive: false })
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onTap)
    }
  }, [])

  return (
    <div className="relative w-full h-full select-none" style={{ touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full"
        style={{ cursor: 'default' }}
      />
    </div>
  )
}
