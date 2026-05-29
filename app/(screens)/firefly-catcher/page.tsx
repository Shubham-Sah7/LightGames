import Link from 'next/link'
import { FireflyGame } from '@/components/firefly-game'

export default function FireflyCatcherPage() {
  return (
    <div className="relative w-full h-full">
      <FireflyGame />
      <Link
        href="/"
        className="absolute top-4 left-4 z-50 flex items-center justify-center"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: 'rgba(240,255,240,0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(87,169,154,0.2)',
        } as React.CSSProperties}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 4L6 8l4 4" stroke="#1A3530" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  )
}
