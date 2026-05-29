import Link from 'next/link'

const GAMES = [
  {
    emoji: '🌧',
    title: 'Rain Drop Cleanse',
    description: 'Release what no longer serves you.',
    href: '/rain-drop-cleanse',
    available: true,
  },
  {
    emoji: '🌳',
    title: 'Gratitude Tree',
    description: 'Grow your tree with daily gratitude.',
    href: '/gratitude-tree',
    available: false,
  },
  {
    emoji: '☁️',
    title: 'Cloud Drift',
    description: 'Let negative thoughts float away.',
    href: '/cloud-drift',
    available: true,
  },
  {
    emoji: '🏮',
    title: 'Lantern Release',
    description: 'Release worries into the sky.',
    href: '/lantern-release',
    available: true,
  },
  {
    emoji: '✨',
    title: 'Firefly Catcher',
    description: 'Collect moments of light.',
    href: '/firefly-catcher',
    available: true,
  },
]

export default function Hub() {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ background: '#F0FFF0', scrollbarWidth: 'none' } as React.CSSProperties}
    >
      <div className="px-5 pt-12 pb-8">

        {/* Brand */}
        <p
          className="text-[10px] font-bold tracking-widest uppercase mb-5"
          style={{ color: '#57A99A', letterSpacing: '0.2em' }}
        >
          Zumlo
        </p>

        {/* Header */}
        <h1
          className="text-[24px] font-semibold leading-tight"
          style={{ color: '#1A3530', letterSpacing: '-0.02em' }}
        >
          How would you like<br />to feel today?
        </h1>
        <p className="mt-2 text-[13px]" style={{ color: '#6B9C94' }}>
          Choose a mindful activity.
        </p>

        {/* Divider */}
        <div
          className="mt-7 mb-5 h-px"
          style={{ background: 'rgba(87,169,154,0.12)' }}
        />

        {/* Game cards */}
        <div className="flex flex-col gap-3">
          {GAMES.map((g) =>
            g.available ? (
              <Link key={g.href} href={g.href} className="block active:scale-[0.98] transition-transform">
                <div
                  className="flex items-center gap-4 p-4 rounded-2xl"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(87,169,154,0.18)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.055), 0 1px 3px rgba(0,0,0,0.035)',
                  }}
                >
                  <IconBox emoji={g.emoji} active />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold" style={{ color: '#1A3530' }}>
                      {g.title}
                    </p>
                    <p className="text-[12px] mt-[3px]" style={{ color: '#7A9E96' }}>
                      {g.description}
                    </p>
                  </div>
                  <Chevron />
                </div>
              </Link>
            ) : (
              <div
                key={g.href}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  opacity: 0.52,
                }}
              >
                <IconBox emoji={g.emoji} active={false} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium" style={{ color: '#1A3530' }}>
                    {g.title}
                  </p>
                  <p className="text-[12px] mt-[3px]" style={{ color: '#7A9E96' }}>
                    {g.description}
                  </p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-[3px] rounded-full flex-shrink-0"
                  style={{ background: '#E8F5F3', color: '#57A99A', letterSpacing: '0.02em' }}
                >
                  Soon
                </span>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  )
}

function IconBox({ emoji, active }: { emoji: string; active: boolean }) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 text-[22px]"
      style={{
        width: '46px',
        height: '46px',
        borderRadius: '13px',
        background: active ? '#E8F5F3' : '#F0FFF0',
        border: active ? '1px solid rgba(87,169,154,0.2)' : 'none',
      }}
    >
      {emoji}
    </div>
  )
}

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="#57A99A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
