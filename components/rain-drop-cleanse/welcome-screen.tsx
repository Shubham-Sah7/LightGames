'use client'

import { HoneydewWelcomeScreen } from '@/components/honeydew-welcome-screen'

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <HoneydewWelcomeScreen
      title="Rain Drop Cleanse"
      description="Wipe away the rain. Take a quiet moment to clear your mind and let go of what's weighing you down."
      onStart={onStart}
    />
  )
}
