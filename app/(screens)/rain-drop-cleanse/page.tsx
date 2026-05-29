import Link from 'next/link'
import { RainWipeGame } from '@/components/rain-wipe-game'

export default function RainDropCleansePage() {
  return (
    <div className="relative w-full h-full">
      <RainWipeGame />
      {/* Back button — sibling of game canvas so it receives pointer events */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center justify-center"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.68)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.85)',
        } as React.CSSProperties}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 4L6 8l4 4"
            stroke="#1A3530"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  )
}
