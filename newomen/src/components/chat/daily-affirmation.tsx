'use client'

import { X } from 'lucide-react'

interface DailyAffirmationProps {
  affirmation?: string | null
  onClose: () => void
}

const defaultAffirmations = [
  "You are capable of rewriting your story at any moment.",
  "Your journey of growth is unique and valuable.",
  "Every conversation brings you closer to your authentic self.",
  "You have the power to transform your narrative.",
  "Your voice matters, and your story deserves to be heard.",
]

export function DailyAffirmation({ affirmation, onClose }: DailyAffirmationProps) {
  const displayAffirmation = affirmation || defaultAffirmations[Math.floor(Math.random() * defaultAffirmations.length)]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass-card max-w-md w-full p-8 text-center relative animate-in fade-in slide-in-from-bottom-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold gradient-text mb-4">Today's Affirmation</h2>
        
        <p className="text-xl text-white mb-6 italic">"{displayAffirmation}"</p>
        
        <div className="text-sm text-white/60">
          Take a moment to reflect on this message
        </div>
      </div>
    </div>
  )
}