'use client'

import { HoneydewWelcomeScreen } from '@/components/honeydew-welcome-screen'

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <HoneydewWelcomeScreen
      title="Clear My Mind"
      description="Tap away distracting thoughts and create space for calm and clarity."
      onStart={onStart}
    />
  )
}
