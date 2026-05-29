'use client'

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  lavenderFog: '#76648B',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
}

interface IntroScreenProps {
  onBegin: () => void
}

export function IntroScreen({ onBegin }: IntroScreenProps) {
  return (
    <div
      className="h-full flex flex-col items-center justify-center px-6"
      style={{ background: COLORS.honeydew }}
    >
      {/* Heading */}
      <h2
        className="text-[26px] font-medium text-center mb-6 animate-fade-in"
        style={{
          color: COLORS.deepOcean,
          letterSpacing: '-0.01em',
          lineHeight: '1.3',
          maxWidth: '320px',
        }}
      >
        A Few Quiet Moments For Yourself
      </h2>

      {/* Message paragraphs */}
      <div className="max-w-[300px] mb-12">
        <p
          className="text-[15px] text-center mb-4 animate-fade-in-delay-1"
          style={{
            color: COLORS.lavenderFog,
            lineHeight: '1.6',
          }}
        >
          Every raindrop represents a thought, worry, or mental clutter.
        </p>
        <p
          className="text-[15px] text-center mb-4 animate-fade-in-delay-2"
          style={{
            color: COLORS.lavenderFog,
            lineHeight: '1.6',
          }}
        >
          Tap the drops one by one and watch them wash away.
        </p>
        <p
          className="text-[15px] text-center animate-fade-in-delay-3"
          style={{
            color: COLORS.lavenderFog,
            lineHeight: '1.6',
          }}
        >
          There is no score. There is no timer. Just a small moment to clear your mind.
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onBegin}
        className="w-full max-w-[340px] text-[16px] font-medium transition-all active:scale-[0.97] animate-fade-in-delay-4"
        style={{
          height: '58px',
          background: COLORS.lavenderFog,
          color: '#FFFFFF',
          borderRadius: '16px',
          letterSpacing: '0.01em',
        }}
      >
        Begin
      </button>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in-up 0.6s ease-out 0.3s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in-up 0.6s ease-out 0.6s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in-up 0.6s ease-out 0.9s both;
        }
        .animate-fade-in-delay-4 {
          animation: fade-in-up 0.6s ease-out 1.2s both;
        }
      `}</style>
    </div>
  )
}
