'use client'

import { useState } from 'react'
import { Target } from 'lucide-react'

const focusAreas = [
  {
    id: 'relationships',
    name: 'Relationships & Connection',
    icon: '❤️',
    description: 'Improve communication and deepen bonds',
  },
  {
    id: 'health',
    name: 'Health & Wellness',
    icon: '🌱',
    description: 'Physical and mental well-being',
  },
  {
    id: 'identity',
    name: 'Self-Esteem & Identity',
    icon: '✨',
    description: 'Build confidence and self-worth',
  },
  {
    id: 'family',
    name: 'Family Dynamics',
    icon: '👨‍👩‍👧‍👦',
    description: 'Navigate family relationships',
  },
  {
    id: 'career',
    name: 'Career & Self-Development',
    icon: '🚀',
    description: 'Professional growth and fulfillment',
  },
  {
    id: 'spirituality',
    name: 'Spirituality & Purpose',
    icon: '🕊️',
    description: 'Find meaning and direction',
  },
]

interface FocusAreasProps {
  onComplete: (data: { focusAreas: string[] }) => void
  initialData: { focusAreas: string[] }
}

export function FocusAreas({ onComplete, initialData }: FocusAreasProps) {
  const [selected, setSelected] = useState<string[]>(initialData.focusAreas || [])

  const toggleArea = (areaId: string) => {
    if (selected.includes(areaId)) {
      setSelected(selected.filter((id) => id !== areaId))
    } else if (selected.length < 3) {
      setSelected([...selected, areaId])
    }
  }

  const handleContinue = () => {
    if (selected.length > 0) {
      onComplete({ focusAreas: selected })
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Choose Your Focus</h2>
        <p className="text-white/70">Select up to 3 areas you'd like to work on</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {focusAreas.map((area) => {
          const isSelected = selected.includes(area.id)
          const isDisabled = !isSelected && selected.length >= 3

          return (
            <button
              key={area.id}
              onClick={() => toggleArea(area.id)}
              disabled={isDisabled}
              className={`glass rounded-lg p-4 text-left transition-all ${
                isSelected
                  ? 'border-2 border-primary scale-105'
                  : isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{area.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{area.name}</h4>
                  <p className="text-sm text-white/60 mt-1">{area.description}</p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-white/60">
          {selected.length === 0
            ? 'Please select at least one area'
            : selected.length === 3
            ? 'Maximum areas selected'
            : `${selected.length} of 3 areas selected`}
        </p>
      </div>

      <button
        onClick={handleContinue}
        disabled={selected.length === 0}
        className="w-full glass-button py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  )
}