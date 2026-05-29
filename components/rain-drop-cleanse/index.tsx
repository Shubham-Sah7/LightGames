'use client'

import { GameShell } from '@/components/game-shell'
import { RainExperience } from './rain-experience'

export function RainDropCleanse() {
  return (
    <GameShell
      config={{
        title: 'Rain Drop Cleanse',
        description: 'Wipe away the rain. Take a quiet moment to clear your mind and let go of what\'s weighing you down.',
        completionMessage: "you've cleared your mind",
      }}
      renderGame={(onComplete) => <RainExperience onComplete={onComplete} />}
    />
  )
}
