'use client'

import { GameShell } from '@/components/game-shell'
import { LanternRelease } from '@/components/lantern-release'

export default function LanternReleasePage() {
  return (
    <GameShell
      config={{
        title: 'Lantern Release',
        description: 'Write a worry and release it into the sky. Watch it rise and disappear.',
        completionMessage: "you've let it go",
      }}
      renderGame={(onComplete) => <LanternRelease onComplete={onComplete} />}
    />
  )
}
