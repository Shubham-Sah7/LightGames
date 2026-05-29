'use client'

import { useRouter } from 'next/navigation'

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  lavenderFog: '#76648B',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
}

interface RewardScreenProps {
  stats: {
    dropletsCleared: number
    duration: number
  }
  streak?: number
}

export function RewardScreen({ stats, streak = 1 }: RewardScreenProps) {
  const router = useRouter()

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins === 0) return `${secs} sec`
    return `${mins} min ${secs} sec`
  }

  return (
    <div
      className="h-full flex flex-col items-center justify-center px-6 animate-fade-in"
      style={{ background: COLORS.honeydew }}
    >
      {/* Heading */}
      <h2
        className="text-[28px] font-medium text-center mb-8"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: '-0.01em',
        }}
      >
        Mind Cleared
      </h2>

      {/* Stats Card */}
      <div
        className="w-full max-w-[320px] mb-6 p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '16px',
          border: `1px solid ${COLORS.sageMist}`,
        }}
      >
        {/* Thoughts Released */}
        <div className="mb-5 text-center">
          <div
            className="text-[13px] mb-1"
            style={{
              color: COLORS.lavenderFog,
              opacity: 0.7,
            }}
          >
            💧 Thoughts Released
          </div>
          <div
            className="text-[24px] font-medium animate-count-up"
            style={{
              color: COLORS.deepOcean,
            }}
          >
            {stats.dropletsCleared}
          </div>
        </div>

        {/* Time Spent */}
        <div className="mb-5 text-center">
          <div
            className="text-[13px] mb-1"
            style={{
              color: COLORS.lavenderFog,
              opacity: 0.7,
            }}
          >
            ⏱️ Time Spent Relaxing
          </div>
          <div
            className="text-[24px] font-medium"
            style={{
              color: COLORS.deepOcean,
            }}
          >
            {formatDuration(stats.duration)}
          </div>
        </div>

        {/* Calmness Streak */}
        <div className="text-center">
          <div
            className="text-[13px] mb-1"
            style={{
              color: COLORS.lavenderFog,
              opacity: 0.7,
            }}
          >
            🔥 Calmness Streak
          </div>
          <div
            className="text-[24px] font-medium"
            style={{
              color: COLORS.deepOcean,
            }}
          >
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        </div>
      </div>

      {/* Message */}
      <p
        className="text-[15px] text-center mb-6 max-w-[280px]"
        style={{
          color: COLORS.lavenderFog,
          opacity: 0.85,
          lineHeight: '1.5',
        }}
      >
        Even a few quiet moments can make a difference.
      </p>

      {/* Quote */}
      <p
        className="text-[14px] text-center italic mb-8 max-w-[280px]"
        style={{
          color: COLORS.deepOcean,
          opacity: 0.7,
          lineHeight: '1.5',
        }}
      >
        "A calm mind is not the absence of thoughts, but the ability to let them pass."
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
        @keyframes count-up {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-count-up {
          animation: count-up 0.6s ease-out 0.3s both;
        }
      `}</style>
    </div>
  )
}
