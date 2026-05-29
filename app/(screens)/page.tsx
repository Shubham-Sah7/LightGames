import Link from 'next/link'

const GAMES = [
  {
    emoji: '🌧',
    title: 'Rain Drop Cleanse',
    description: 'Release what no longer serves you',
    href: '/rain-drop-cleanse',
    category: 'RELEASE',
    available: true,
  },
  {
    emoji: '☁️',
    title: 'Cloud Drift',
    description: 'Let negative thoughts float away',
    href: '/cloud-drift',
    category: 'CALM',
    available: true,
  },
  {
    emoji: '🏮',
    title: 'Lantern Release',
    description: 'Release worries into the sky',
    href: '/lantern-release',
    category: 'MINDFUL',
    available: true,
  },
  {
    emoji: '🌳',
    title: 'Gratitude Tree',
    description: 'Grow your tree with daily gratitude',
    href: '/gratitude-tree',
    category: 'GRATITUDE',
    available: false,
  },
  {
    emoji: '✨',
    title: 'Firefly Catcher',
    description: 'Collect moments of light',
    href: '/firefly-catcher',
    category: 'FOCUS',
    available: true,
  },
]

const COLORS = {
  honeydew: '#F0FFF0',
  sageMist: '#B8CBBE',
  calmTeal: '#57A99A',
  lavenderFog: '#76648B',
  warmSunset: '#F59A4A',
  deepOcean: '#083F56',
}

export default function Hub() {
  return (
    <div
      className="h-full overflow-y-auto"
      style={{ 
        background: COLORS.honeydew,
        scrollbarWidth: 'none',
        paddingBottom: '32px'
      } as React.CSSProperties}
    >
      <div className="px-6 pt-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <h1
            className="text-[22px] font-normal leading-tight"
            style={{
              color: COLORS.deepOcean,
              letterSpacing: '-0.01em',
            }}
          >
            Hey! Even a few moments can shift your whole mood.
          </h1>
        </div>

        {/* 2-Column Card Grid */}
        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((game) => (
            game.available ? (
              <Link 
                key={game.href} 
                href={game.href}
                className="block active:scale-[0.97] transition-transform"
              >
                <GameCard game={game} />
              </Link>
            ) : (
              <div key={game.href} className="opacity-50">
                <GameCard game={game} disabled />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

function GameCard({ game, disabled = false }: { game: typeof GAMES[0]; disabled?: boolean }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.5)',
        borderRadius: '16px',
        border: `1px solid ${COLORS.sageMist}`,
        padding: '20px 16px',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: COLORS.lavenderFog,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          marginBottom: '16px',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {game.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3
          className="text-[16px] font-medium mb-1"
          style={{ 
            color: COLORS.deepOcean,
            letterSpacing: '-0.01em',
            lineHeight: '1.3'
          }}
        >
          {game.title}
        </h3>
        <p
          className="text-[12px] mb-3"
          style={{ 
            color: COLORS.deepOcean,
            opacity: 0.6,
            lineHeight: '1.4'
          }}
        >
          {game.description}
        </p>

        {/* Category Pill */}
        <div className="mt-auto">
          <span
            className="inline-block text-[10px] font-semibold px-3 py-1 rounded-full"
            style={{
              background: getCategoryColor(game.category),
              color: COLORS.deepOcean,
              letterSpacing: '0.05em',
            }}
          >
            {game.category}
          </span>
        </div>
      </div>

      {/* "Soon" badge for disabled games */}
      {disabled && (
        <div
          className="absolute top-3 right-3 text-[9px] font-semibold px-2 py-1 rounded-full"
          style={{
            background: COLORS.sageMist,
            color: COLORS.deepOcean,
            opacity: 0.7,
          }}
        >
          SOON
        </div>
      )}
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    RELEASE: 'rgba(87, 169, 154, 0.2)',    // Calm Teal
    CALM: 'rgba(184, 203, 190, 0.4)',      // Sage Mist
    MINDFUL: 'rgba(118, 100, 139, 0.2)',   // Lavender Fog
    GRATITUDE: 'rgba(245, 154, 74, 0.2)',  // Warm Sunset
    FOCUS: 'rgba(87, 169, 154, 0.25)',     // Calm Teal
  }
  return colors[category] || 'rgba(184, 203, 190, 0.3)'
}
