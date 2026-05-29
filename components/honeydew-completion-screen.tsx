'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HoneydewMascot } from './honeydew-mascot'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
}

interface HoneydewCompletionScreenProps {
  message: string
}

export function HoneydewCompletionScreen({ message }: HoneydewCompletionScreenProps) {
  const router = useRouter()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in
    const timer = setTimeout(() => {
      setOpacity(1)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-8"
      style={{
        background: COLORS.honeydew,
        transition: 'opacity 0.8s ease-out',
        opacity,
      }}
    >
      {/* Honeydew Mascot */}
      <div className="mb-8">
        <HoneydewMascot size={120} />
      </div>

      {/* Title - Large and friendly */}
      <h2
        className="text-[36px] font-medium text-center mb-2"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
        }}
      >
        Heyy...
      </h2>

      {/* Message - Small and lightweight, single line */}
      <p
        className="text-[14px] text-center mb-16"
        style={{
          color: COLORS.lavenderFog,
          lineHeight: '1.4',
          opacity: 0.85,
        }}
      >
        {message}
      </p>

      {/* CTA Button */}
      <button
        onClick={() => router.push('/')}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: '58px',
          background: COLORS.lavenderFog,
          color: '#FFFFFF',
          borderRadius: '16px',
          letterSpacing: '0.01em',
        }}
      >
        Continue
      </button>
    </div>
  )
}
