'use client'

import { GameShell } from '@/components/game-shell'
import { FireflyGame } from '@/components/firefly-game'

export default function FireflyCatcherPage() {
  return (
    <GameShell
      config={{
        title: 'Firefly Catcher',
        description: 'Tap the fireflies to collect moments of light. Rediscover what brings you joy.',
        completionMessage: "you've gathered your light",
      }}
      renderGame={(onComplete) => <FireflyGame onComplete={onComplete} />}
    />
  )
}
