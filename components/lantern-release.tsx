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

const FINAL_MESSAGES = [
  'Let it go.',
  'You can move forward.',
  'Tomorrow is a new day.',
]

const EXAMPLES = ['Stress', 'Anxiety', 'Self doubt', 'Fear', 'Overthinking']

type Phase = 'input' | 'rising' | 'complete'

export function LanternRelease() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<Phase>('input')
  const [thought, setThought] = useState('')
  const [inputValue, setInputValue] = useState('')

  // Animation state
  const animRef = useRef<{
    lanternY: number
    lanternX: number
    sway: number
    glow: number
    textAlpha: number
    particles: Array<{ x: number; y: number; vx: number; vy: number; alpha: number }>
    messageAlpha: number
    messageTimer: number
    finalMessage: string
  }>({
    lanternY: H / 2,
    lanternX: W / 2,
    sway: 0,
    glow: 0,
    textAlpha: 1,
    particles: [],
    messageAlpha: 0,
    messageTimer: 0,
    finalMessage: '',
  })

  const handleRelease = () => {
    if (!inputValue.trim()) return
    setThought(inputValue.trim())
    setPhase('rising')
    
    // Reset animation state
    animRef.current = {
      lanternY: H / 2,
      lanternX: W / 2,
      sway: 0,
      glow: 0,
      textAlpha: 1,
      particles: [],
      messageAlpha: 0,
      messageTimer: 0,
      finalMessage: FINAL_MESSAGES[Math.floor(Math.random() * FINAL_MESSAGES.length)],
    }
  }

  useEffect(() => {
    if (phase !== 'rising' && phase !== 'complete') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let time = 0

    const animate = () => {
      time++
      const state = animRef.current

      // Clear canvas
      ctx.fillStyle = COLORS.honeydew
      ctx.fillRect(0, 0, W, H)

      if (phase === 'rising') {
        // Lantern rises slowly
        state.lanternY -= 0.8
        
        // Gentle sway
        state.sway = Math.sin(time * 0.03) * 8
        state.lanternX = W / 2 + state.sway

        // Glow increases
        if (state.glow < 1) state.glow += 0.015

        // Text fades as lantern rises
        if (state.lanternY < H * 0.3) {
          state.textAlpha = Math.max(0, state.textAlpha - 0.008)
        }

        // Spawn particles occasionally
        if (time % 8 === 0 && state.particles.length < 30) {
          state.particles.push({
            x: state.lanternX + (Math.random() - 0.5) * 40,
            y: state.lanternY + 30 + Math.random() * 20,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.5,
            alpha: 0.6 + Math.random() * 0.4,
          })
        }

        // Update particles
        state.particles = state.particles
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.008,
          }))
          .filter(p => p.alpha > 0)

        // Draw particles
        state.particles.forEach(p => {
          ctx.save()
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = COLORS.warmSunset
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        })

        // Calculate lantern size (gets smaller as it rises)
        const progress = Math.max(0, 1 - (H / 2 - state.lanternY) / (H * 0.7))
        const size = 80 * progress

        // Draw shadow
        ctx.save()
        ctx.globalAlpha = 0.15 * progress
        ctx.fillStyle = COLORS.deepOcean
        ctx.beginPath()
        ctx.ellipse(state.lanternX, H - 60, size * 0.6, size * 0.2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw lantern glow
        if (state.glow > 0) {
          ctx.save()
          ctx.globalAlpha = state.glow * 0.4
          const glowGrad = ctx.createRadialGradient(
            state.lanternX,
            state.lanternY,
            0,
            state.lanternX,
            state.lanternY,
            size * 1.5
          )
          glowGrad.addColorStop(0, COLORS.warmSunset)
          glowGrad.addColorStop(1, 'rgba(245, 154, 74, 0)')
          ctx.fillStyle = glowGrad
          ctx.beginPath()
          ctx.arc(state.lanternX, state.lanternY, size * 1.5, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }

        // Draw lantern body
        ctx.save()
        
        // Lantern body filled with Warm Sunset
        ctx.fillStyle = COLORS.warmSunset
        
        // Lantern shape (rounded rectangle)
        const lx = state.lanternX
        const ly = state.lanternY
        const lw = size * 0.8
        const lh = size * 1.2
        
        ctx.beginPath()
        ctx.moveTo(lx - lw / 2 + 10, ly - lh / 2)
        ctx.lineTo(lx + lw / 2 - 10, ly - lh / 2)
        ctx.quadraticCurveTo(lx + lw / 2, ly - lh / 2, lx + lw / 2, ly - lh / 2 + 10)
        ctx.lineTo(lx + lw / 2, ly + lh / 2 - 10)
        ctx.quadraticCurveTo(lx + lw / 2, ly + lh / 2, lx + lw / 2 - 10, ly + lh / 2)
        ctx.lineTo(lx - lw / 2 + 10, ly + lh / 2)
        ctx.quadraticCurveTo(lx - lw / 2, ly + lh / 2, lx - lw / 2, ly + lh / 2 - 10)
        ctx.lineTo(lx - lw / 2, ly - lh / 2 + 10)
        ctx.quadraticCurveTo(lx - lw / 2, ly - lh / 2, lx - lw / 2 + 10, ly - lh / 2)
        ctx.closePath()
        ctx.fill()
        
        // Lantern outline - Deep Ocean
        ctx.strokeStyle = COLORS.deepOcean
        ctx.lineWidth = 1.8
        ctx.stroke()
        
        // Lantern ribs (horizontal lines) - Deep Ocean
        ctx.strokeStyle = COLORS.deepOcean
        ctx.globalAlpha = 0.3
        ctx.lineWidth = 1
        for (let i = 0; i < 4; i++) {
          const ribY = ly - lh / 2 + (lh / 4) * (i + 1)
          ctx.beginPath()
          ctx.moveTo(lx - lw / 2, ribY)
          ctx.lineTo(lx + lw / 2, ribY)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
        
        // Top cap
        ctx.fillStyle = COLORS.deepOcean
        ctx.beginPath()
        ctx.ellipse(lx, ly - lh / 2 - 3, lw / 2 + 2, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        
        // Bottom cap
        ctx.beginPath()
        ctx.ellipse(lx, ly + lh / 2 + 3, lw / 2 + 2, 6, 0, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.restore()

        // Draw thought text inside lantern
        if (state.textAlpha > 0 && size > 30) {
          ctx.save()
          ctx.globalAlpha = state.textAlpha
          ctx.fillStyle = COLORS.deepOcean
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.font = `400 ${Math.max(10, size * 0.18)}px -apple-system, system-ui, sans-serif`
          
          // Wrap text if needed
          const maxWidth = lw * 0.7
          const words = thought.split(' ')
          let line = ''
          const lines: string[] = []
          
          words.forEach(word => {
            const testLine = line + (line ? ' ' : '') + word
            const metrics = ctx.measureText(testLine)
            if (metrics.width > maxWidth && line) {
              lines.push(line)
              line = word
            } else {
              line = testLine
            }
          })
          if (line) lines.push(line)
          
          const lineHeight = size * 0.22
          const startY = ly - ((lines.length - 1) * lineHeight) / 2
          
          lines.forEach((line, i) => {
            ctx.fillText(line, lx, startY + i * lineHeight)
          })
          
          ctx.restore()
        }

        // Check if lantern has risen enough to complete
        if (state.lanternY < -size) {
          setPhase('complete')
          state.messageTimer = 0
        }
      } else if (phase === 'complete') {
        // Show final message
        state.messageTimer++
        
        // Fade in
        if (state.messageAlpha < 1 && state.messageTimer < 60) {
          state.messageAlpha += 0.017
        }
        
        // Hold for 3 seconds (180 frames)
        if (state.messageTimer > 240) {
          // Fade out
          state.messageAlpha = Math.max(0, state.messageAlpha - 0.017)
          
          // Restart
          if (state.messageAlpha <= 0) {
            setPhase('input')
            setInputValue('')
            setThought('')
          }
        }
        
        // Draw message
        ctx.save()
        ctx.globalAlpha = state.messageAlpha
        ctx.fillStyle = COLORS.deepOcean
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '400 28px -apple-system, system-ui, sans-serif'
        ctx.fillText(state.finalMessage, W / 2, H / 2)
        ctx.restore()
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
    }
  }, [phase, thought])

  return (
    <div className="relative w-full h-full" style={{ background: COLORS.honeydew }}>
      {/* Canvas for animation */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="absolute inset-0 w-full h-full"
        style={{ display: phase === 'input' ? 'none' : 'block' }}
      />

      {/* Input phase */}
      {phase === 'input' && (
        <div className="absolute inset-0 flex flex-col items-center px-6" style={{ paddingTop: '80px' }}>
          {/* Static lantern illustration - Warm Sunset filled */}
          <div
            className="mb-8 relative"
            style={{
              width: '110px',
              height: '145px',
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            <svg width="110" height="145" viewBox="0 0 110 145" fill="none">
              {/* Shadow */}
              <ellipse cx="55" cy="138" rx="35" ry="7" fill={COLORS.deepOcean} opacity="0.08" />
              
              {/* Lantern body - filled with Warm Sunset */}
              <rect
                x="28"
                y="18"
                width="54"
                height="90"
                rx="7"
                fill={COLORS.warmSunset}
                stroke={COLORS.deepOcean}
                strokeWidth="1.8"
              />
              
              {/* Ribs */}
              <line x1="28" y1="36" x2="82" y2="36" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
              <line x1="28" y1="54" x2="82" y2="54" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
              <line x1="28" y1="72" x2="82" y2="72" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
              <line x1="28" y1="90" x2="82" y2="90" stroke={COLORS.deepOcean} strokeWidth="1" opacity="0.3" />
              
              {/* Top cap */}
              <ellipse cx="55" cy="18" rx="29" ry="5" fill={COLORS.deepOcean} />
              
              {/* Bottom cap */}
              <ellipse cx="55" cy="108" rx="29" ry="5" fill={COLORS.deepOcean} />
              
              {/* Handle */}
              <path
                d="M 46 18 Q 46 9, 55 9 Q 64 9, 64 18"
                stroke={COLORS.deepOcean}
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Question - Lavender Fog */}
          <h2
            className="text-[26px] font-medium text-center mb-2 leading-tight"
            style={{ 
              color: COLORS.lavenderFog,
              letterSpacing: '-0.02em',
              maxWidth: '320px'
            }}
          >
            What would you like to let go of today?
          </h2>

          {/* Examples - Lavender Fog 70% */}
          <p 
            className="text-[13px] text-center mb-10" 
            style={{ 
              color: COLORS.lavenderFog, 
              opacity: 0.7,
              letterSpacing: '0.01em'
            }}
          >
            {EXAMPLES.join(' • ')}
          </p>

          {/* Input - Zumlo style */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRelease()}
            placeholder="Type here..."
            className="w-full px-6 text-center text-[16px] outline-none transition-all"
            style={{
              height: '68px',
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '16px',
              border: `1.5px solid ${COLORS.sageMist}`,
              color: COLORS.deepOcean,
              maxWidth: '340px',
            }}
            autoFocus
          />

          {/* Release button - Full width Zumlo CTA style */}
          <button
            onClick={handleRelease}
            disabled={!inputValue.trim()}
            className="w-full mt-5 text-[16px] font-medium transition-all"
            style={{
              height: '58px',
              background: inputValue.trim() ? COLORS.lavenderFog : COLORS.sageMist,
              color: '#FFFFFF',
              borderRadius: '16px',
              opacity: inputValue.trim() ? 1 : 0.5,
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              maxWidth: '340px',
              letterSpacing: '0.01em',
            }}
          >
            Release
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
      `}</style>
    </div>
  )
}
