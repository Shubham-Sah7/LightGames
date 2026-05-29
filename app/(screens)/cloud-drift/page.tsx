'use client'

import { GameShell } from '@/components/game-shell'
import { CloudDrift } from '@/components/cloud-drift'

export default function CloudDriftPage() {
  return (
    <GameShell
      config={{
        title: 'Cloud Drift',
        description: 'Touch the clouds to let your worries float away. Watch heavy thoughts dissolve into peace.',
        completionMessage: "your worries have drifted away",
      }}
      renderGame={(onComplete) => <CloudDrift onComplete={onComplete} />}
    />
  )
}
