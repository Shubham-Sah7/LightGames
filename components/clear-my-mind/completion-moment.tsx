'use client'

import { HoneydewCompletionScreen } from '@/components/honeydew-completion-screen'

export function CompletionMoment({ onContinue }: { onContinue: () => void }) {
  // Auto-continue after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onContinue])

  return (
    <HoneydewCompletionScreen message="your mind feels lighter" />
  )
}

import { useEffect } from 'react'
