'use client'

import { useEffect, useRef } from 'react'

const W = 393
const H = 852
const N = 50       // droplet count
const BRUSH = 46   // wipe radius

const MESSAGES = ['Let go.', 'You are enough.', 'Keep going.', 'One breath at a time.']

type Drop = { x: number; y: number; r: number; vy: number; a: number }

function mkDrop(fromTop = false): Drop {
  return {
    x: Math.random() * W,
    y: fromTop ? -(4 + Math.random() * 10) : Math.random() * H,
    r: 2 + Math.random() * 4,
    vy: 0.3 + Math.random() * 0.7,
    a: 0.22 + Math.random() * 0.28,
  }
}

export function RainWipeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    // Progress grid — 20×43 boolean cells, no getImageData needed
    const GW = 20, GH = 43

    let fog: HTMLCanvasElement
    let fctx: CanvasRenderingContext2D
    let drops: Drop[]
    let grid: Uint8Array
    let clearedCount: number
    let msg: string
    let phase: 'rain' | 'reveal'
    let textAlpha: number
    let revealTimer: number
    let wiping = false
    let lx = 0, ly = 0
    let needsRestart = false

    function init() {
      fog = document.createElement('canvas')
      fog.width = W
      fog.height = H
      fctx = fog.getContext('2d')!

      drops = Array.from({ length: N }, () => mkDrop())
      grid = new Uint8Array(GW * GH)
      clearedCount = 0
      msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      phase = 'rain'
      textAlpha = 0
      revealTimer = 0

      // Fog fill
      fctx.fillStyle = '#BEC9C7'
      fctx.fillRect(0, 0, W, H)

      // A few subtle trickle streaks
      fctx.strokeStyle = 'rgba(175, 190, 188, 0.45)'
      fctx.lineWidth = 1.2
      for (let i = 0; i < 5; i++) {
        const sx = 15 + Math.random() * (W - 30)
        fctx.beginPath()
        fctx.moveTo(sx, 0)
        fctx.lineTo(sx + (Math.random() - 0.5) * 20, H)
        fctx.stroke()
      }
    }
    init()

    // Wipe a path segment on the fog canvas and update grid
    function doWipe(x: number, y: number, fx: number, fy: number) {
      const dist = Math.hypot(x - fx, y - fy)
      const steps = Math.max(1, Math.ceil(dist / (BRUSH * 0.38)))

      fctx.globalCompositeOperation = 'destination-out'
      for (let i = 0; i <= steps; i++) {
        const t = steps === 0 ? 0 : i / steps
        const px = fx + (x - fx) * t
        const py = fy + (y - fy) * t
        const g = fctx.createRadialGradient(px, py, 0, px, py, BRUSH)
        g.addColorStop(0,    'rgba(0,0,0,0.95)')
        g.addColorStop(0.55, 'rgba(0,0,0,0.60)')
        g.addColorStop(1,    'rgba(0,0,0,0)')
        fctx.fillStyle = g
        fctx.beginPath()
        fctx.arc(px, py, BRUSH, 0, Math.PI * 2)
        fctx.fill()
      }
      fctx.globalCompositeOperation = 'source-over'

      // Mark grid cells covered by this brush stroke
      const gx1 = Math.max(0,    Math.floor((x - BRUSH) / W * GW))
      const gx2 = Math.min(GW-1, Math.ceil( (x + BRUSH) / W * GW))
      const gy1 = Math.max(0,    Math.floor((y - BRUSH) / H * GH))
      const gy2 = Math.min(GH-1, Math.ceil( (y + BRUSH) / H * GH))
      for (let gy = gy1; gy <= gy2; gy++) {
        for (let gx = gx1; gx <= gx2; gx++) {
          const idx = gy * GW + gx
          if (!grid[idx]) { grid[idx] = 1; clearedCount++ }
        }
      }

      // 80% threshold → trigger reveal
      if (clearedCount / (GW * GH) >= 0.80) {
        phase = 'reveal'
        drops = []
        fctx.globalCompositeOperation = 'destination-out'
        fctx.fillStyle = '#000'
        fctx.fillRect(0, 0, W, H)
        fctx.globalCompositeOperation = 'source-over'
      }
    }

    let raf: number

    function loop() {
      // Auto-restart (triggered at end of reveal cycle)
      if (needsRestart) { needsRestart = false; init() }

      // Background
      ctx.fillStyle = '#F0FFF0'
      ctx.fillRect(0, 0, W, H)

      // Fog layer
      ctx.drawImage(fog, 0, 0)

      if (phase === 'rain') {
        // Simple gravity — drops fall straight down, reset at top
        drops.forEach(d => {
          d.y += d.vy
          if (d.y > H + 8) { d.y = -8; d.x = Math.random() * W }
          ctx.save()
          ctx.globalAlpha = d.a
          ctx.fillStyle = '#88B8B4'
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })
      } else {
        // Reveal: fade in → hold 3 s → fade out → restart
        revealTimer++
        if (textAlpha < 1) {
          // Fade in (~55 frames)
          textAlpha = Math.min(1, textAlpha + 0.018)
        } else if (revealTimer > 236) {
          // Fade out after ~3 s hold (56 fade-in + 180 hold ≈ frame 236)
          textAlpha = Math.max(0, textAlpha - 0.018)
          if (textAlpha <= 0) needsRestart = true
        }

        ctx.save()
        ctx.globalAlpha = textAlpha
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '400 26px -apple-system, system-ui, sans-serif'
        ctx.fillStyle = '#2A4A3E'
        ctx.fillText(msg, W / 2, H / 2)
        ctx.restore()
      }

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Pointer events — covers both mouse and touch
    function toCanvas(e: PointerEvent | TouchEvent) {
      const r = canvas.getBoundingClientRect()
      let clientX: number, clientY: number
      
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        return { x: 0, y: 0 }
      }
      
      return {
        x: (clientX - r.left) * (W / r.width),
        y: (clientY - r.top)  * (H / r.height),
      }
    }
    
    function onDown(e: PointerEvent) {
      if (phase !== 'rain') return
      e.preventDefault()
      e.stopPropagation()
      canvas.setPointerCapture(e.pointerId)
      wiping = true
      const p = toCanvas(e)
      lx = p.x
      ly = p.y
      doWipe(p.x, p.y, p.x, p.y)
    }
    
    function onMove(e: PointerEvent) {
      if (!wiping || phase !== 'rain') return
      e.preventDefault()
      e.stopPropagation()
      const p = toCanvas(e)
      doWipe(p.x, p.y, lx, ly)
      lx = p.x
      ly = p.y
    }
    
    function onUp(e: PointerEvent) {
      if (wiping) {
        e.preventDefault()
        e.stopPropagation()
      }
      wiping = false
    }
    
    // Touch events for better mobile support
    function onTouchStart(e: TouchEvent) {
      if (phase !== 'rain') return
      e.preventDefault()
      e.stopPropagation()
      wiping = true
      const p = toCanvas(e)
      lx = p.x
      ly = p.y
      doWipe(p.x, p.y, p.x, p.y)
    }
    
    function onTouchMove(e: TouchEvent) {
      if (!wiping || phase !== 'rain') return
      e.preventDefault()
      e.stopPropagation()
      const p = toCanvas(e)
      doWipe(p.x, p.y, lx, ly)
      lx = p.x
      ly = p.y
    }
    
    function onTouchEnd(e: TouchEvent) {
      if (wiping) {
        e.preventDefault()
        e.stopPropagation()
      }
      wiping = false
    }

    canvas.addEventListener('pointerdown',  onDown, { passive: false })
    canvas.addEventListener('pointermove',  onMove, { passive: false })
    canvas.addEventListener('pointerup',    onUp, { passive: false })
    canvas.addEventListener('pointercancel', onUp, { passive: false })
    canvas.addEventListener('touchstart',   onTouchStart, { passive: false })
    canvas.addEventListener('touchmove',    onTouchMove, { passive: false })
    canvas.addEventListener('touchend',     onTouchEnd, { passive: false })
    canvas.addEventListener('touchcancel',  onTouchEnd, { passive: false })

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown',  onDown)
      canvas.removeEventListener('pointermove',  onMove)
      canvas.removeEventListener('pointerup',    onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('touchstart',   onTouchStart)
      canvas.removeEventListener('touchmove',    onTouchMove)
      canvas.removeEventListener('touchend',     onTouchEnd)
      canvas.removeEventListener('touchcancel',  onTouchEnd)
    }
  }, [])

  return (
    <div className="relative w-full h-full select-none" style={{ touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full"
        style={{ 
          cursor: 'crosshair',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      />
    </div>
  )
}
