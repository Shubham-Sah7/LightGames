'use client'

import { useState, useEffect, useRef } from 'react'

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

const NEGATIVE_THOUGHTS = ['Stress', 'Anxiety', 'Fear', 'Self Doubt', 'Overthinking']
const POSITIVE_WORDS = ['Peace', 'Hope', 'Calm', 'Strength', 'Joy']

type Cloud = {
  id: number
  x: number
  y: number
  width: number
  height: number
  negative: string
  positive: string
  drift: number
  bob: number
  bobSpeed: number
  cleared: boolean
  dissolving: boolean
  dissolveProgress: number
  particles: Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    alpha: number
  }>
  revealAlpha: number
}

export function CloudDrift({ onComplete }: { onComplete?: () => void } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'active' | 'complete'>('active')
  const [messageAlpha, setMessageAlpha] = useState(0)
  const [messageTimer, setMessageTimer] = useState(0)
  
  const cloudsRef = useRef<Cloud[]>([])
  const timeRef = useRef(0)
  const touchingRef = useRef<{ cloudId: number; startX: number; startY: number } | null>(null)

  // Initialize clouds
  useEffect(() => {
    const shuffledNegative = [...NEGATIVE_THOUGHTS].sort(() => Math.random() - 0.5)
    const shuffledPositive = [...POSITIVE_WORDS].sort(() => Math.random() - 0.5)
    
    cloudsRef.current = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 40 + Math.random() * (W - 180),
      y: 100 + i * 140 + Math.random() * 40,
      width: 120 + Math.random() * 60,
      height: 60 + Math.random() * 30,
      negative: shuffledNegative[i],
      positive: shuffledPositive[i],
      drift: Math.random() * Math.PI * 2,
      bob: 0,
      bobSpeed: 0.015 + Math.random() * 0.01,
      cleared: false,
      dissolving: false,
      dissolveProgress: 0,
      particles: [],
      revealAlpha: 0,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number

    const animate = () => {
      timeRef.current++
      const time = timeRef.current

      // Clear
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      if (phase === 'active') {
        const clouds = cloudsRef.current

        // Update and draw clouds
        clouds.forEach(cloud => {
          if (cloud.cleared) {
            // Show positive word
            if (cloud.revealAlpha < 1) {
              cloud.revealAlpha = Math.min(1, cloud.revealAlpha + 0.02)
            }
            
            ctx.save()
            ctx.globalAlpha = cloud.revealAlpha
            ctx.fillStyle = COLORS.calmTeal
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '400 22px -apple-system, system-ui, sans-serif'
            ctx.fillText(cloud.positive, cloud.x + cloud.width / 2, cloud.y + cloud.height / 2)
            ctx.restore()
            return
          }

          if (cloud.dissolving) {
            // Dissolve animation
            cloud.dissolveProgress += 0.015

            // Update particles
            cloud.particles.forEach(p => {
              p.x += p.vx
              p.y += p.vy
              p.vy -= 0.02 // Slight upward drift
              p.alpha = Math.max(0, p.alpha - 0.012)
            })

            // Draw particles
            cloud.particles.forEach(p => {
              if (p.alpha > 0) {
                ctx.save()
                ctx.globalAlpha = p.alpha
                ctx.fillStyle = COLORS.sageMist
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
                ctx.restore()
              }
            })

            // Check if dissolve complete
            if (cloud.dissolveProgress >= 1 && cloud.particles.every(p => p.alpha <= 0)) {
              cloud.cleared = true
              cloud.dissolving = false
            }
            return
          }

          // Normal cloud rendering
          cloud.drift += 0.003
          cloud.bob = Math.sin(time * cloud.bobSpeed) * 6

          const cx = cloud.x + Math.cos(cloud.drift) * 15
          const cy = cloud.y + cloud.bob

          // Draw cloud shadow
          ctx.save()
          ctx.globalAlpha = 0.08
          ctx.fillStyle = COLORS.deepOcean
          ctx.beginPath()
          ctx.ellipse(cx + cloud.width / 2, cy + cloud.height + 15, cloud.width * 0.4, 8, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()

          // Draw cloud shape (realistic soft clouds)
          ctx.save()
          ctx.fillStyle = '#FFFFFF'
          
          // Main cloud body
          const puffs = [
            { x: cx + cloud.width * 0.2, y: cy + cloud.height * 0.5, r: cloud.height * 0.45 },
            { x: cx + cloud.width * 0.4, y: cy + cloud.height * 0.3, r: cloud.height * 0.5 },
            { x: cx + cloud.width * 0.6, y: cy + cloud.height * 0.25, r: cloud.height * 0.55 },
            { x: cx + cloud.width * 0.8, y: cy + cloud.height * 0.4, r: cloud.height * 0.45 },
          ]

          puffs.forEach(puff => {
            ctx.beginPath()
            ctx.arc(puff.x, puff.y, puff.r, 0, Math.PI * 2)
            ctx.fill()
          })

          // Soft edges with gradient
          ctx.globalAlpha = 0.3
          puffs.forEach(puff => {
            const grad = ctx.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, puff.r * 1.2)
            grad.addColorStop(0, '#FFFFFF')
            grad.addColorStop(1, 'rgba(255,255,255,0)')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(puff.x, puff.y, puff.r * 1.2, 0, Math.PI * 2)
            ctx.fill()
          })
          ctx.restore()

          // Draw negative thought text
          ctx.save()
          ctx.fillStyle = COLORS.deepOcean
          ctx.globalAlpha = 0.75
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = '400 16px -apple-system, system-ui, sans-serif'
          ctx.fillText(cloud.negative, cx + cloud.width / 2, cy + cloud.height / 2)
          ctx.restore()
        })

        // Check if all cleared
        if (clouds.every(c => c.cleared)) {
          setPhase('complete')
          setMessageTimer(0)
          setMessageAlpha(0)
        }
      } else if (phase === 'complete') {
        // Show completion message
        setMessageTimer(prev => prev + 1)
        
        if (messageAlpha < 1 && messageTimer < 60) {
          setMessageAlpha(prev => Math.min(1, prev + 0.017))
        }
        
        if (messageTimer > 240) {
          setMessageAlpha(prev => Math.max(0, prev - 0.017))
          
          if (messageAlpha <= 0) {
            if (onComplete) { onComplete(); return }
            // Restart
            setPhase('active')
            const shuffledNegative = [...NEGATIVE_THOUGHTS].sort(() => Math.random() - 0.5)
            const shuffledPositive = [...POSITIVE_WORDS].sort(() => Math.random() - 0.5)
            
            cloudsRef.current = Array.from({ length: 5 }, (_, i) => ({
              id: i,
              x: 40 + Math.random() * (W - 180),
              y: 100 + i * 140 + Math.random() * 40,
              width: 120 + Math.random() * 60,
              height: 60 + Math.random() * 30,
              negative: shuffledNegative[i],
              positive: shuffledPositive[i],
              drift: Math.random() * Math.PI * 2,
              bob: 0,
              bobSpeed: 0.015 + Math.random() * 0.01,
              cleared: false,
              dissolving: false,
              dissolveProgress: 0,
              particles: [],
              revealAlpha: 0,
            }))
          }
        }

        ctx.save()
        ctx.globalAlpha = messageAlpha
        ctx.fillStyle = COLORS.deepOcean
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '400 26px -apple-system, system-ui, sans-serif'
        ctx.fillText('Your mind deserves space.', W / 2, H / 2)
        ctx.restore()
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [phase, messageAlpha, messageTimer])

  // Touch/swipe handling
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const toCanvas = (e: PointerEvent | TouchEvent) => {
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
        y: (clientY - r.top) * (H / r.height),
      }
    }

    const findCloudAt = (x: number, y: number): Cloud | null => {
      const clouds = cloudsRef.current
      for (let i = clouds.length - 1; i >= 0; i--) {
        const cloud = clouds[i]
        if (cloud.cleared || cloud.dissolving) continue
        
        const cx = cloud.x + Math.cos(cloud.drift) * 15
        const cy = cloud.y + cloud.bob
        
        if (
          x >= cx &&
          x <= cx + cloud.width &&
          y >= cy &&
          y <= cy + cloud.height
        ) {
          return cloud
        }
      }
      return null
    }

    const onDown = (e: PointerEvent) => {
      if (phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
      
      const pos = toCanvas(e)
      const cloud = findCloudAt(pos.x, pos.y)
      
      if (cloud) {
        touchingRef.current = {
          cloudId: cloud.id,
          startX: pos.x,
          startY: pos.y,
        }
      }
    }

    const onMove = (e: PointerEvent) => {
      if (!touchingRef.current || phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
    }

    const onUp = (e: PointerEvent) => {
      if (!touchingRef.current || phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
      
      const pos = toCanvas(e)
      const touch = touchingRef.current
      const dx = pos.x - touch.startX
      const dy = pos.y - touch.startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // If swiped (moved more than 30px)
      if (distance > 30) {
        const cloud = cloudsRef.current.find(c => c.id === touch.cloudId)
        if (cloud && !cloud.cleared && !cloud.dissolving) {
          // Start dissolve
          cloud.dissolving = true
          cloud.dissolveProgress = 0
          
          // Create particles
          const cx = cloud.x + Math.cos(cloud.drift) * 15
          const cy = cloud.y + cloud.bob
          const particleCount = 40
          
          cloud.particles = Array.from({ length: particleCount }, () => ({
            x: cx + cloud.width / 2 + (Math.random() - 0.5) * cloud.width * 0.6,
            y: cy + cloud.height / 2 + (Math.random() - 0.5) * cloud.height * 0.6,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: 2 + Math.random() * 3,
            alpha: 0.6 + Math.random() * 0.4,
          }))
        }
      }
      
      touchingRef.current = null
    }

    const onTouchStart = (e: TouchEvent) => {
      if (phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
      
      const pos = toCanvas(e)
      const cloud = findCloudAt(pos.x, pos.y)
      
      if (cloud) {
        touchingRef.current = {
          cloudId: cloud.id,
          startX: pos.x,
          startY: pos.y,
        }
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!touchingRef.current || phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchingRef.current || phase !== 'active') return
      e.preventDefault()
      e.stopPropagation()
      
      const pos = toCanvas(e)
      const touch = touchingRef.current
      const dx = pos.x - touch.startX
      const dy = pos.y - touch.startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 30) {
        const cloud = cloudsRef.current.find(c => c.id === touch.cloudId)
        if (cloud && !cloud.cleared && !cloud.dissolving) {
          cloud.dissolving = true
          cloud.dissolveProgress = 0
          
          const cx = cloud.x + Math.cos(cloud.drift) * 15
          const cy = cloud.y + cloud.bob
          const particleCount = 40
          
          cloud.particles = Array.from({ length: particleCount }, () => ({
            x: cx + cloud.width / 2 + (Math.random() - 0.5) * cloud.width * 0.6,
            y: cy + cloud.height / 2 + (Math.random() - 0.5) * cloud.height * 0.6,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 0.5,
            size: 2 + Math.random() * 3,
            alpha: 0.6 + Math.random() * 0.4,
          }))
        }
      }
      
      touchingRef.current = null
    }

    canvas.addEventListener('pointerdown', onDown, { passive: false })
    canvas.addEventListener('pointermove', onMove, { passive: false })
    canvas.addEventListener('pointerup', onUp, { passive: false })
    canvas.addEventListener('pointercancel', onUp, { passive: false })
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd, { passive: false })
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: false })

    return () => {
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
      canvas.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [phase])

  return (
    <div
      className="relative w-full h-full"
      style={{
        background: COLORS.honeydew,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="absolute inset-0 w-full h-full"
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      />
    </div>
  )
}
