'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const headlines = [
  "Let's explore your story today",
  "Ready to discover something new about yourself?",
  "Your growth journey continues here",
  "What narrative will you rewrite today?",
  "Time to unlock your potential",
  "Your transformation awaits",
  "Let's dive deeper into your journey",
  "Ready for a breakthrough?",
]

export function DynamicHeadline() {
  const [headline, setHeadline] = useState('')

  useEffect(() => {
    // Select a random headline on mount
    const randomHeadline = headlines[Math.floor(Math.random() * headlines.length)]
    setHeadline(randomHeadline)
  }, [])

  if (!headline) return null

  return (
    <div className="px-4 py-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-yellow-400" />
        <h1 className="text-2xl font-bold gradient-text">{headline}</h1>
        <Sparkles className="w-5 h-5 text-yellow-400" />
      </div>
      <p className="text-sm text-white/60">Your AI companion is here to support you</p>
    </div>
  )
}