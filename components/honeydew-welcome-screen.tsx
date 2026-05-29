'use client'

import { HoneydewMascot } from './honeydew-mascot'

const COLORS = {
  honeydew: '#F0FFF0',
  lavenderFog: '#76648B',
  deepOcean: '#083F56',
}

interface HoneydewWelcomeScreenProps {
  title: string
  description: string
  onStart: () => void
}

export function HoneydewWelcomeScreen({ title, description, onStart }: HoneydewWelcomeScreenProps) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center px-8 animate-fade-in"
      style={{ background: COLORS.honeydew }}
    >
      {/* Honeydew Mascot */}
      <div className="mb-8">
        <HoneydewMascot size={120} />
      </div>

      {/* Title */}
      <h1
        className="text-[36px] font-medium text-center mb-4"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: '-0.02em',
          lineHeight: '1.1',
        }}
      >
        {title}
      </h1>

      {/* Description - Short and lightweight, 1-2 sentences */}
      <p
        className="text-[14px] text-center mb-16 max-w-[280px]"
        style={{
          color: COLORS.lavenderFog,
          lineHeight: '1.5',
          opacity: 0.85,
        }}
      >
        {description}
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97]"
        style={{
          height: '58px',
          background: COLORS.lavenderFog,
          color: '#FFFFFF',
          borderRadius: '16px',
          letterSpacing: '0.01em',
        }}
      >
        Start
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  )
}
