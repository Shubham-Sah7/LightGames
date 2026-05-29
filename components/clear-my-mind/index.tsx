'use client'

import { GameShell } from '@/components/game-shell'
import { RainExperience } from './rain-experience'

export function ClearMyMind() {
  return (
    <GameShell
      config={{
        title: 'Clear My Mind',
        description: 'Tap away your thoughts one by one. Find stillness in the space between.',
        completionMessage: "your mind is clear now",
      }}
      renderGame={(onComplete) => (
        <RainExperience onComplete={() => onComplete()} />
      )}
    />
  )
}
