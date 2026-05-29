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

const MESSAGES = [
  'Let it pass.',
  "You don't need to carry everything.",
  'One thought at a time.',
  "You're doing well.",
  'Not everything needs an answer today.',
  'This moment is yours.',
  'Breathe.',
  "It's okay to let go.",
]

type Droplet = {
  id: number
  x: number
  y: number
  r: number
  vy: number
  color: string
  alpha: number
  trail: Array<{ x: number; y: number; alpha: number }>
}

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  size: number
}

interface RainExperienceProps {
  onComplete: (stats: { dropletsCleared: number; duration: number }) => void
}

export function RainExperience({ onComplete }: RainExperienceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const startTimeRef = useRef<number>(Date.now())
  const [clearedCount, setClearedCount] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let droplets: Droplet[] = []
    let particles: Particle[] = []
    let nextId = 0
    let messageText = ''
    let messageAlpha = 0
    let messageTimer = 0
    let sunlightAlpha = 0
    let completionTimer = 0
    let isCompleting = false
    let totalCleared = 0

    // Initialize droplets
    const INITIAL_COUNT = 50
    for (let i = 0; i < INITIAL_COUNT; i++) {
      droplets.push(createDroplet(Math.random() * H))
    }

    function createDroplet(startY?: number): Droplet {
      return {
        id: nextId++,
        x: Math.random() * W,
        y: startY ?? -10,
        r: 4 + Math.random() * 8,
        vy: 0.3 + Math.random() * 0.5,
        color: COLORS.calmTeal,
        alpha: 0.6 + Math.random() * 0.3,
        trail: [],
      }
    }

    function clearDroplet(droplet: Droplet) {
      // Remove droplet
      droplets = droplets.filter(d => d.id !== droplet.id)
      totalCleared++
      setClearedCount(totalCleared)

      // Create particles
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.5
        particles.push({
          x: droplet.x,
          y: droplet.y,
          vx: Math.cos(angle) * (0.5 + Math.random() * 1),
          vy: Math.sin(angle) * (0.5 + Math.random() * 1) - 1,
          alpha: 0.8,
          size: 2 + Math.random(),
        })
      }

      // Show message every 8-12 droplets
      if (totalCleared % 10 === 0 && messageAlpha === 0) {
        messageText = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
        messageTimer = 0
      }

      // Check completion
      if (droplets.length === 0 && !isCompleting) {
        isCompleting = true
        completionTimer = 0
      }
    }

    function handleCanvasClick(e: MouseEvent | TouchEvent) {
      if (isCompleting || !canvas) return

      const rect = canvas.getBoundingClientRect()
      let clientX: number, clientY: number

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else if ('clientX' in e) {
        clientX = e.clientX
        clientY = e.clientY
      } else {
        return
      }

      const x = (clientX - rect.left) * (W / rect.width)
      const y = (clientY - rect.top) * (H / rect.height)

      // Find clicked droplet
      for (let i = droplets.length - 1; i >= 0; i--) {
        const d = droplets[i]
        const dist = Math.hypot(x - d.x, y - d.y)
        if (dist < d.r + 10) {
          clearDroplet(d)
          
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10)
          }
          break
        }
      }
    }

    canvas.addEventListener('click', handleCanvasClick)
    canvas.addEventListener('touchstart', handleCanvasClick, { passive: true })

    let raf: number

    function animate() {
      if (!ctx) return
      
      // Background
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      // Draw subtle background shapes
      ctx.save()
      ctx.globalAlpha = 0.15
      ctx.fillStyle = COLORS.sageMist
      ctx.beginPath()
      ctx.ellipse(W * 0.2, H * 0.3, 80, 120, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(W * 0.8, H * 0.7, 100, 90, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      if (!isCompleting) {
        // Update and draw droplets
        droplets.forEach(d => {
          // Update position
          d.y += d.vy
          d.vy += 0.01 // Gravity

          // Update trail
          d.trail.unshift({ x: d.x, y: d.y, alpha: 0.3 })
          if (d.trail.length > 8) d.trail.pop()

          // Reset if off screen
          if (d.y > H + 20) {
            d.y = -10
            d.x = Math.random() * W
            d.vy = 0.3 + Math.random() * 0.5
          }

          // Check merging with other droplets
          droplets.forEach(other => {
            if (other.id !== d.id) {
              const dist = Math.hypot(d.x - other.x, d.y - other.y)
              if (dist < d.r + other.r && d.r < other.r) {
                other.r = Math.min(12, Math.sqrt(d.r * d.r + other.r * other.r))
                d.y = -100 // Remove this droplet
              }
            }
          })

          // Draw trail
          ctx.save()
          d.trail.forEach((t, i) => {
            const trailAlpha = t.alpha * (1 - i / d.trail.length)
            ctx.globalAlpha = trailAlpha
            ctx.fillStyle = d.color
            ctx.beginPath()
            ctx.arc(t.x, t.y, d.r * 0.5, 0, Math.PI * 2)
            ctx.fill()
          })
          ctx.restore()

          // Draw droplet
          ctx.save()
          ctx.globalAlpha = d.alpha
          
          // Gradient for realistic look
          const grad = ctx.createRadialGradient(
            d.x - d.r * 0.3,
            d.y - d.r * 0.3,
            0,
            d.x,
            d.y,
            d.r
          )
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
          grad.addColorStop(0.5, d.color)
          grad.addColorStop(1, 'rgba(87, 169, 154, 0.4)')
          
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
          ctx.fill()
          
          // Highlight
          ctx.globalAlpha = 0.6
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
          ctx.beginPath()
          ctx.arc(d.x - d.r * 0.3, d.y - d.r * 0.3, d.r * 0.3, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        // Spawn new droplets (less frequently as more are cleared)
        const spawnChance = Math.max(0.01, 0.05 - totalCleared * 0.001)
        if (Math.random() < spawnChance && droplets.length < 60) {
          droplets.push(createDroplet())
        }
      } else {
        // Completion animation
        completionTimer++
        sunlightAlpha = Math.min(1, sunlightAlpha + 0.01)

        // Sunlight effect
        ctx.save()
        ctx.globalAlpha = sunlightAlpha * 0.3
        const sunGrad = ctx.createRadialGradient(W / 2, H / 3, 0, W / 2, H / 3, W)
        sunGrad.addColorStop(0, COLORS.warmSunset)
        sunGrad.addColorStop(1, 'rgba(245, 154, 74, 0)')
        ctx.fillStyle = sunGrad
        ctx.fillRect(0, 0, W, H)
        ctx.restore()

        // Light rays
        if (sunlightAlpha > 0.5) {
          ctx.save()
          ctx.globalAlpha = (sunlightAlpha - 0.5) * 0.2
          ctx.strokeStyle = COLORS.warmSunset
          ctx.lineWidth = 2
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI / 6) * i - Math.PI / 3
            ctx.beginPath()
            ctx.moveTo(W / 2, H / 3)
            ctx.lineTo(
              W / 2 + Math.cos(angle) * W,
              H / 3 + Math.sin(angle) * W
            )
            ctx.stroke()
          }
          ctx.restore()
        }

        // Complete after 3 seconds
        if (completionTimer > 180) {
          const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
          onComplete({ dropletsCleared: totalCleared, duration })
          return
        }
      }

      // Update and draw particles
      particles = particles
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.05,
          alpha: p.alpha - 0.015,
        }))
        .filter(p => p.alpha > 0)

      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = COLORS.warmSunset
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // Message system
      if (messageText && !isCompleting) {
        messageTimer++
        
        if (messageTimer < 30) {
          messageAlpha = Math.min(1, messageAlpha + 0.033)
        } else if (messageTimer > 90) {
          messageAlpha = Math.max(0, messageAlpha - 0.033)
          if (messageAlpha === 0) {
            messageText = ''
            messageTimer = 0
          }
        }

        if (messageAlpha > 0) {
          ctx.save()
          ctx.globalAlpha = messageAlpha * 0.9
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '400 18px -apple-system, system-ui, sans-serif'
          
          // Shadow for readability
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetY = 2
          
          ctx.fillStyle = COLORS.lavenderFog
          ctx.fillText(messageText, W / 2, 80)
          ctx.restore()
        }
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('click', handleCanvasClick)
      canvas.removeEventListener('touchstart', handleCanvasClick)
    }
  }, [onComplete])

  return (
    <div className="relative w-full h-full" style={{ background: COLORS.honeydew }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="block w-full h-full cursor-pointer"
        style={{ touchAction: 'manipulation' }}
      />
      
      {/* Droplet counter (optional) */}
      <div
        className="absolute top-4 left-0 right-0 text-center text-[12px]"
        style={{
          color: COLORS.lavenderFog,
          opacity: 0.7,
        }}
      >
        {clearedCount > 0 && `${clearedCount} thoughts released`}
      </div>
    </div>
  )
}
