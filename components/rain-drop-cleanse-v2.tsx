'use client'

import { useEffect, useRef, useState } from 'react'

const W = 393
const H = 852

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  lavenderFog: '#76648B',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
}

type Droplet = {
  id: number
  x: number
  y: number
  r: number
  vy: number
  vx: number
  alpha: number
  beingPushed: boolean
  pushVx: number
  pushVy: number
}

export function RainDropCleanseV2() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'wiping' | 'completion'>('wiping')
  const [clearedPercent, setClearedPercent] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let droplets: Droplet[] = []
    let nextId = 0
    let isWiping = false
    let lastX = 0
    let lastY = 0
    let fingerTrail: Array<{ x: number; y: number; alpha: number }> = []
    let completionTimer = 0
    let sunlightAlpha = 0
    let messageAlpha = 0

    // Grid for tracking cleared areas (for progress)
    const gridW = 20
    const gridH = 40
    const clearedGrid = new Uint8Array(gridW * gridH)
    let clearedCount = 0

    // Initialize droplets - more realistic distribution
    const DROPLET_COUNT = 80
    for (let i = 0; i < DROPLET_COUNT; i++) {
      droplets.push(createDroplet())
    }

    function createDroplet(): Droplet {
      return {
        id: nextId++,
        x: Math.random() * W,
        y: Math.random() * H,
        r: 3 + Math.random() * 9, // 3-12px radius
        vy: 0.05 + Math.random() * 0.15, // Slow gravity
        vx: (Math.random() - 0.5) * 0.1,
        alpha: 0.5 + Math.random() * 0.4,
        beingPushed: false,
        pushVx: 0,
        pushVy: 0,
      }
    }

    function handlePointerDown(e: PointerEvent | TouchEvent) {
      if (!canvas) return
      e.preventDefault()
      const rect = canvas.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else return

      const x = (clientX - rect.left) * (W / rect.width)
      const y = (clientY - rect.top) * (H / rect.height)

      isWiping = true
      lastX = x
      lastY = y
      fingerTrail = []
    }

    function handlePointerMove(e: PointerEvent | TouchEvent) {
      if (!isWiping || phase !== 'wiping' || !canvas) return
      e.preventDefault()

      const rect = canvas.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else return

      const x = (clientX - rect.left) * (W / rect.width)
      const y = (clientY - rect.top) * (H / rect.height)

      // Add to finger trail
      fingerTrail.push({ x, y, alpha: 0.3 })
      if (fingerTrail.length > 15) fingerTrail.shift()

      // Calculate swipe direction and speed
      const dx = x - lastX
      const dy = y - lastY
      const speed = Math.hypot(dx, dy)

      // Mark cleared areas in grid
      const swipeRadius = 35
      const steps = Math.max(1, Math.ceil(speed / 5))
      
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps
        const px = lastX + (x - lastX) * t
        const py = lastY + (y - lastY) * t

        // Mark grid cells as cleared
        const gx1 = Math.max(0, Math.floor((px - swipeRadius) / W * gridW))
        const gx2 = Math.min(gridW - 1, Math.ceil((px + swipeRadius) / W * gridW))
        const gy1 = Math.max(0, Math.floor((py - swipeRadius) / H * gridH))
        const gy2 = Math.min(gridH - 1, Math.ceil((py + swipeRadius) / H * gridH))

        for (let gy = gy1; gy <= gy2; gy++) {
          for (let gx = gx1; gx <= gx2; gx++) {
            const idx = gy * gridW + gx
            if (!clearedGrid[idx]) {
              clearedGrid[idx] = 1
              clearedCount++
            }
          }
        }
      }

      // Push droplets away
      droplets.forEach(d => {
        const dist = Math.hypot(d.x - x, d.y - y)
        const pushRadius = 40

        if (dist < pushRadius) {
          // Calculate push direction (away from finger)
          const angle = Math.atan2(d.y - y, d.x - x)
          const pushForce = (1 - dist / pushRadius) * 3 // Stronger push when closer
          
          d.beingPushed = true
          d.pushVx = Math.cos(angle) * pushForce * (1 + speed * 0.1)
          d.pushVy = Math.sin(angle) * pushForce * (1 + speed * 0.1)
        }
      })

      // Update progress
      const percent = Math.floor((clearedCount / (gridW * gridH)) * 100)
      setClearedPercent(percent)

      // Check completion
      if (percent >= 88 && phase === 'wiping') {
        setPhase('completion')
        isWiping = false
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 30, 50])
        }
      }

      lastX = x
      lastY = y
    }

    function handlePointerUp(e: PointerEvent | TouchEvent) {
      if (!canvas) return
      e.preventDefault()
      isWiping = false
      fingerTrail = []
    }

    // Event listeners
    canvas.addEventListener('pointerdown', handlePointerDown, { passive: false })
    canvas.addEventListener('pointermove', handlePointerMove, { passive: false })
    canvas.addEventListener('pointerup', handlePointerUp, { passive: false })
    canvas.addEventListener('pointercancel', handlePointerUp, { passive: false })
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false })
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false })
    canvas.addEventListener('touchend', handlePointerUp, { passive: false })
    canvas.addEventListener('touchcancel', handlePointerUp, { passive: false })

    let raf: number

    function animate() {
      if (!ctx) return

      // Background - peaceful scene
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      // Draw subtle background shapes (becomes more visible as cleared)
      const bgAlpha = 0.1 + (clearedCount / (gridW * gridH)) * 0.15
      ctx.save()
      ctx.globalAlpha = bgAlpha
      ctx.fillStyle = COLORS.sageMist
      ctx.beginPath()
      ctx.ellipse(W * 0.25, H * 0.35, 90, 130, 0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(W * 0.75, H * 0.65, 110, 100, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(W * 0.5, H * 0.8, 80, 70, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      if (phase === 'wiping') {
        // Update droplets
        droplets.forEach(d => {
          // Apply push velocity
          if (d.beingPushed) {
            d.x += d.pushVx
            d.y += d.pushVy
            
            // Friction
            d.pushVx *= 0.92
            d.pushVy *= 0.92
            
            if (Math.abs(d.pushVx) < 0.1 && Math.abs(d.pushVy) < 0.1) {
              d.beingPushed = false
            }
          }

          // Gravity (slow slide down)
          d.y += d.vy
          d.x += d.vx

          // Bounce off edges
          if (d.x < d.r) {
            d.x = d.r
            d.vx *= -0.5
            d.pushVx *= -0.5
          }
          if (d.x > W - d.r) {
            d.x = W - d.r
            d.vx *= -0.5
            d.pushVx *= -0.5
          }
          if (d.y > H + d.r) {
            // Remove droplets that fall off
            d.alpha = 0
          }

          // Merge with nearby droplets
          droplets.forEach(other => {
            if (other.id !== d.id && other.alpha > 0 && d.alpha > 0) {
              const dist = Math.hypot(d.x - other.x, d.y - other.y)
              const minDist = d.r + other.r

              if (dist < minDist * 0.8) {
                // Merge into larger droplet
                if (d.r >= other.r) {
                  d.r = Math.min(15, Math.sqrt(d.r * d.r + other.r * other.r * 0.5))
                  d.vy = Math.max(d.vy, other.vy)
                  other.alpha = 0 // Remove smaller droplet
                }
              }
            }
          })
        })

        // Remove dead droplets
        droplets = droplets.filter(d => d.alpha > 0)

        // Draw droplets - realistic water appearance
        droplets.forEach(d => {
          ctx.save()
          ctx.globalAlpha = d.alpha

          // Main droplet body
          const grad = ctx.createRadialGradient(
            d.x - d.r * 0.3,
            d.y - d.r * 0.3,
            0,
            d.x,
            d.y,
            d.r
          )
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
          grad.addColorStop(0.3, 'rgba(87, 169, 154, 0.6)')
          grad.addColorStop(0.7, 'rgba(87, 169, 154, 0.4)')
          grad.addColorStop(1, 'rgba(87, 169, 154, 0.2)')

          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
          ctx.fill()

          // Highlight (makes it look like water)
          ctx.globalAlpha = d.alpha * 0.8
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.beginPath()
          ctx.arc(d.x - d.r * 0.35, d.y - d.r * 0.35, d.r * 0.35, 0, Math.PI * 2)
          ctx.fill()

          // Shadow/depth
          ctx.globalAlpha = d.alpha * 0.3
          ctx.fillStyle = 'rgba(8, 63, 86, 0.2)'
          ctx.beginPath()
          ctx.arc(d.x + d.r * 0.2, d.y + d.r * 0.3, d.r * 0.6, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        })

        // Draw finger trail (water smear effect)
        if (fingerTrail.length > 1) {
          ctx.save()
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
          ctx.lineWidth = 30
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          fingerTrail.forEach((point, i) => {
            if (i === 0) return
            const prev = fingerTrail[i - 1]
            const alpha = point.alpha * (i / fingerTrail.length)
            
            ctx.globalAlpha = alpha
            ctx.beginPath()
            ctx.moveTo(prev.x, prev.y)
            ctx.lineTo(point.x, point.y)
            ctx.stroke()
          })
          ctx.restore()
        }

        // Fade out finger trail
        fingerTrail = fingerTrail.map(p => ({ ...p, alpha: p.alpha * 0.95 }))
          .filter(p => p.alpha > 0.05)

      } else if (phase === 'completion') {
        completionTimer++

        // Remaining droplets slide away
        droplets.forEach(d => {
          d.vy += 0.05 // Increase gravity
          d.y += d.vy
          d.alpha = Math.max(0, d.alpha - 0.02)
        })
        droplets = droplets.filter(d => d.alpha > 0 && d.y < H + 20)

        // Sunlight appears
        sunlightAlpha = Math.min(1, sunlightAlpha + 0.008)

        if (sunlightAlpha > 0) {
          ctx.save()
          ctx.globalAlpha = sunlightAlpha * 0.25
          const sunGrad = ctx.createRadialGradient(W / 2, H / 3, 0, W / 2, H / 3, W * 0.8)
          sunGrad.addColorStop(0, COLORS.warmSunset)
          sunGrad.addColorStop(1, 'rgba(245, 154, 74, 0)')
          ctx.fillStyle = sunGrad
          ctx.fillRect(0, 0, W, H)
          ctx.restore()
        }

        // Light rays
        if (sunlightAlpha > 0.6) {
          ctx.save()
          ctx.globalAlpha = (sunlightAlpha - 0.6) * 0.15
          ctx.strokeStyle = COLORS.warmSunset
          ctx.lineWidth = 3
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 5) * i - Math.PI / 2.5
            ctx.beginPath()
            ctx.moveTo(W / 2, H / 3)
            ctx.lineTo(
              W / 2 + Math.cos(angle) * W * 1.2,
              H / 3 + Math.sin(angle) * W * 1.2
            )
            ctx.stroke()
          }
          ctx.restore()
        }

        // Message appears
        if (completionTimer > 60) {
          messageAlpha = Math.min(1, messageAlpha + 0.015)

          ctx.save()
          ctx.globalAlpha = messageAlpha
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '400 22px -apple-system, system-ui, sans-serif'
          ctx.fillStyle = COLORS.deepOcean
          
          ctx.fillText('Your mind feels a little', W / 2, H / 2 - 20)
          ctx.fillText('clearer now.', W / 2, H / 2 + 10)
          
          ctx.font = '400 16px -apple-system, system-ui, sans-serif'
          ctx.fillStyle = COLORS.lavenderFog
          ctx.fillText('Thank you for taking a moment', W / 2, H / 2 + 60)
          ctx.fillText('for yourself.', W / 2, H / 2 + 85)
          ctx.restore()
        }

        // Restart after message shown
        if (completionTimer > 300) {
          // Reset
          setPhase('wiping')
          setClearedPercent(0)
          clearedGrid.fill(0)
          clearedCount = 0
          completionTimer = 0
          sunlightAlpha = 0
          messageAlpha = 0
          droplets = []
          for (let i = 0; i < DROPLET_COUNT; i++) {
            droplets.push(createDroplet())
          }
        }
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      canvas.removeEventListener('touchstart', handlePointerDown)
      canvas.removeEventListener('touchmove', handlePointerMove)
      canvas.removeEventListener('touchend', handlePointerUp)
      canvas.removeEventListener('touchcancel', handlePointerUp)
    }
  }, [phase])

  return (
    <div className="relative w-full h-full select-none" style={{ touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full"
        style={{
          cursor: 'none',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      />

      {/* Progress indicator */}
      {phase === 'wiping' && clearedPercent > 0 && (
        <div
          className="absolute top-4 left-0 right-0 text-center text-[11px] pointer-events-none"
          style={{
            color: COLORS.lavenderFog,
            opacity: 0.6,
          }}
        >
          {clearedPercent}% cleared
        </div>
      )}
    </div>
  )
}
