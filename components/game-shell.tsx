'use client'

import { useState } from 'react'
import { HoneydewWelcomeScreen } from './honeydew-welcome-screen'
import { HoneydewCompletionScreen } from './honeydew-completion-screen'

export interface GameConfig {
  title: string
  description: string
  completionMessage: string
}

interface GameShellProps {
  config: GameConfig
  renderGame: (onComplete: () => void) => React.ReactNode
}

export function GameShell({ config, renderGame }: GameShellProps) {
  const [screen, setScreen] = useState<'welcome' | 'game' | 'completion'>('welcome')

  return (
    <div className="w-full h-full">
      {screen === 'welcome' && (
        <HoneydewWelcomeScreen
          title={config.title}
          description={config.description}
          onStart={() => setScreen('game')}
        />
      )}
      {screen === 'game' && renderGame(() => setScreen('completion'))}
      {screen === 'completion' && (
        <HoneydewCompletionScreen message={config.completionMessage} />
      )}
    </div>
  )
}
