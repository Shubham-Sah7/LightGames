'use client'

import { useEffect, useRef, useState } from 'react'

const W = 393
const H = 852

const COLORS = {
  honeydew: '#F0FFF0',
}

type Droplet = {
  id: number
  x: number
  y: number
  r: number
  vy: number
  vx: number
  alpha: number
  cleared: boolean
  isStreaking: boolean
  streakLength: number
}

interface RainExperienceProps {
  onComplete: () => void
}

export function RainExperience({ onComplete }: RainExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [clearedPercent, setClearedPercent] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let droplets: Droplet[] = []
    let nextId = 0
    let isWiping = false
    let lastX = 0
    let lastY = 0

    // Grid for tracking cleared areas
    const gridW = 25
    const gridH = 50
    const clearedGrid = new Uint8Array(gridW * gridH)
    let clearedCount = 0

    // Initialize realistic rain droplets - varied sizes like reference
    const TINY_DROPLETS = 150 // 1-2px
    const SMALL_DROPLETS = 80  // 2-4px
    const MEDIUM_DROPLETS = 40 // 4-8px
    const LARGE_DROPLETS = 15  // 8-14px
    const STREAKING_DROPLETS = 8 // Elongated droplets

    // Create tiny droplets
    for (let i = 0; i < TINY_DROPLETS; i++) {
      droplets.push(createDroplet(1 + Math.random() * 1.5, false))
    }
    
    // Create small droplets
    for (let i = 0; i < SMALL_DROPLETS; i++) {
      droplets.push(createDroplet(2 + Math.random() * 2, false))
    }
    
    // Create medium droplets
    for (let i = 0; i < MEDIUM_DROPLETS; i++) {
      droplets.push(createDroplet(4 + Math.random() * 4, false))
    }
    
    // Create large droplets
    for (let i = 0; i < LARGE_DROPLETS; i++) {
      droplets.push(createDroplet(8 + Math.random() * 6, false))
    }
    
    // Create streaking droplets
    for (let i = 0; i < STREAKING_DROPLETS; i++) {
      droplets.push(createDroplet(5 + Math.random() * 4, true))
    }

    function createDroplet(radius: number, isStreaking: boolean): Droplet {
      return {
        id: nextId++,
        x: Math.random() * W,
        y: Math.random() * H,
        r: radius,
        vy: isStreaking ? 0.15 + Math.random() * 0.25 : 0.01 + Math.random() * 0.05,
        vx: (Math.random() - 0.5) * 0.02,
        alpha: 0.3 + Math.random() * 0.4,
        cleared: false,
        isStreaking,
        streakLength: isStreaking ? 20 + Math.random() * 40 : 0,
      }
    }

    function drawRealisticDroplet(d: Droplet) {
      if (d.cleared || !ctx) return

      ctx.save()
      ctx.globalAlpha = d.alpha

      if (d.isStreaking) {
        // Streaking droplet - elongated teardrop
        const streakGrad = ctx.createLinearGradient(
          d.x,
          d.y - d.streakLength,
          d.x,
          d.y + d.r
        )
        streakGrad.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
        streakGrad.addColorStop(0.3, 'rgba(200, 220, 235, 0.5)')
        streakGrad.addColorStop(0.7, 'rgba(180, 210, 230, 0.7)')
        streakGrad.addColorStop(1, 'rgba(160, 200, 225, 0.4)')

        // Draw streak trail
        ctx.fillStyle = streakGrad
        ctx.beginPath()
        ctx.moveTo(d.x, d.y - d.streakLength)
        ctx.lineTo(d.x - d.r * 0.3, d.y)
        ctx.quadraticCurveTo(d.x, d.y + d.r, d.x + d.r * 0.3, d.y)
        ctx.closePath()
        ctx.fill()

        // Draw droplet head (larger at bottom)
        const headGrad = ctx.createRadialGradient(
          d.x - d.r * 0.3,
          d.y - d.r * 0.2,
          0,
          d.x,
          d.y,
          d.r * 1.2
        )
        headGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
        headGrad.addColorStop(0.3, 'rgba(220, 235, 245, 0.8)')
        headGrad.addColorStop(0.7, 'rgba(180, 210, 230, 0.6)')
        headGrad.addColorStop(1, 'rgba(140, 180, 210, 0.3)')

        ctx.fillStyle = headGrad
        ctx.beginPath()
        ctx.ellipse(d.x, d.y, d.r * 1.2, d.r * 1.5, 0, 0, Math.PI * 2)
        ctx.fill()

        // Bright highlight on streaking droplet
        ctx.globalAlpha = d.alpha * 0.9
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
        ctx.beginPath()
        ctx.arc(d.x - d.r * 0.4, d.y - d.r * 0.3, d.r * 0.4, 0, Math.PI * 2)
        ctx.fill()

      } else {
        // Regular droplet - pearl-shaped
        
        // Main droplet body with realistic gradient
        const mainGrad = ctx.createRadialGradient(
          d.x - d.r * 0.35,
          d.y - d.r * 0.35,
          0,
          d.x,
          d.y,
          d.r * 1.1
        )
        
        if (d.r < 3) {
          // Tiny droplets - more transparent
          mainGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
          mainGrad.addColorStop(0.4, 'rgba(210, 230, 240, 0.6)')
          mainGrad.addColorStop(0.8, 'rgba(170, 200, 220, 0.4)')
          mainGrad.addColorStop(1, 'rgba(130, 170, 200, 0.2)')
        } else if (d.r < 6) {
          // Small-medium droplets
          mainGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
          mainGrad.addColorStop(0.3, 'rgba(220, 235, 245, 0.75)')
          mainGrad.addColorStop(0.6, 'rgba(180, 210, 230, 0.6)')
          mainGrad.addColorStop(1, 'rgba(140, 180, 210, 0.35)')
        } else {
          // Large droplets - more defined
          mainGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          mainGrad.addColorStop(0.25, 'rgba(230, 240, 248, 0.85)')
          mainGrad.addColorStop(0.5, 'rgba(190, 220, 235, 0.7)')
          mainGrad.addColorStop(0.8, 'rgba(150, 190, 220, 0.5)')
          mainGrad.addColorStop(1, 'rgba(120, 160, 200, 0.3)')
        }

        ctx.fillStyle = mainGrad
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()

        // Bright highlight (top-left) - key for realism
        ctx.globalAlpha = d.alpha * 0.95
        const highlightSize = d.r * 0.35
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
        ctx.beginPath()
        ctx.arc(d.x - d.r * 0.4, d.y - d.r * 0.4, highlightSize, 0, Math.PI * 2)
        ctx.fill()

        // Secondary highlight (smaller)
        if (d.r > 4) {
          ctx.globalAlpha = d.alpha * 0.6
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.beginPath()
          ctx.arc(d.x - d.r * 0.2, d.y - d.r * 0.5, highlightSize * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }

        // Shadow/depth (bottom-right) - creates 3D effect
        ctx.globalAlpha = d.alpha * 0.3
        ctx.fillStyle = 'rgba(100, 140, 170, 0.4)'
        ctx.beginPath()
        ctx.arc(d.x + d.r * 0.25, d.y + d.r * 0.3, d.r * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // Outer glow/refraction - glass effect
        if (d.r > 3) {
          ctx.globalAlpha = d.alpha * 0.15
          const glowGrad = ctx.createRadialGradient(
            d.x,
            d.y,
            d.r * 0.9,
            d.x,
            d.y,
            d.r * 1.4
          )
          glowGrad.addColorStop(0, 'rgba(200, 220, 235, 0.3)')
          glowGrad.addColorStop(1, 'rgba(200, 220, 235, 0)')
          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.r * 1.4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.restore()
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
    }

    function handlePointerMove(e: PointerEvent | TouchEvent) {
      if (!isWiping || !canvas) return
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

      const dx = x - lastX
      const dy = y - lastY
      const speed = Math.hypot(dx, dy)

      // Clear droplets along swipe path
      const swipeRadius = 40
      const steps = Math.max(1, Math.ceil(speed / 3))

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

        // Clear droplets in swipe path
        droplets.forEach(d => {
          if (d.cleared) return
          const dist = Math.hypot(d.x - px, d.y - py)
          if (dist < swipeRadius + d.r) {
            d.cleared = true
          }
        })
      }

      // Update progress
      const percent = Math.floor((clearedCount / (gridW * gridH)) * 100)
      setClearedPercent(percent)

      // Check completion (87% threshold)
      if (percent >= 87) {
        onComplete()
      }

      lastX = x
      lastY = y
    }

    function handlePointerUp(e: PointerEvent | TouchEvent) {
      if (!canvas) return
      e.preventDefault()
      isWiping = false
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

      // Clean Honeydew background - NO decorations
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      // Update droplets (slow gravity)
      droplets.forEach(d => {
        if (d.cleared) return

        d.y += d.vy
        d.x += d.vx

        // Merge with nearby droplets (realistic water behavior)
        droplets.forEach(other => {
          if (other.id !== d.id && !other.cleared && !d.cleared) {
            const dist = Math.hypot(d.x - other.x, d.y - other.y)
            const minDist = d.r + other.r

            if (dist < minDist * 0.6) {
              if (d.r >= other.r) {
                // Merge: larger droplet absorbs smaller
                d.r = Math.min(16, Math.sqrt(d.r * d.r + other.r * other.r * 0.7))
                d.vy = Math.max(d.vy, other.vy * 1.1) // Heavier droplets fall faster
                other.cleared = true
                
                // Large droplets become streaking
                if (d.r > 10 && !d.isStreaking) {
                  d.isStreaking = true
                  d.streakLength = 30 + Math.random() * 30
                  d.vy = 0.2 + Math.random() * 0.2
                }
              }
            }
          }
        })

        // Reset if off screen
        if (d.y > H + d.r + d.streakLength) {
          d.y = -d.r - d.streakLength
          d.x = Math.random() * W
        }
        if (d.x < -d.r) d.x = W + d.r
        if (d.x > W + d.r) d.x = -d.r
      })

      // Draw all droplets (sorted by size - small first, large last for depth)
      const sortedDroplets = [...droplets].sort((a, b) => a.r - b.r)
      sortedDroplets.forEach(d => drawRealisticDroplet(d))

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
  }, [onComplete])

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

      {/* Minimal progress indicator */}
      {clearedPercent > 0 && clearedPercent < 87 && (
        <div
          className="absolute bottom-8 left-0 right-0 text-center text-[11px] pointer-events-none"
          style={{
            color: 'rgba(118, 100, 139, 0.5)',
            letterSpacing: '0.02em',
          }}
        >
          {clearedPercent}%
        </div>
      )}
    </div>
  )
}
