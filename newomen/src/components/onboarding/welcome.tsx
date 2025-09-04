'use client'

import { Sparkles, CheckCircle } from 'lucide-react'

interface WelcomeProps {
  onComplete: () => void
  data: {
    personalityType: string
    focusAreas: string[]
  }
}

export function Welcome({ onComplete, data }: WelcomeProps) {
  const focusAreaNames = {
    relationships: 'Relationships & Connection',
    health: 'Health & Wellness',
    identity: 'Self-Esteem & Identity',
    family: 'Family Dynamics',
    career: 'Career & Self-Development',
    spirituality: 'Spirituality & Purpose',
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      <h2 className="text-3xl font-bold text-white mb-4">
        Welcome to Your Journey, {data.personalityType}!
      </h2>

      <p className="text-xl text-white/80 mb-8 max-w-lg mx-auto">
        Your personalized growth experience is ready. NewMe is excited to support you in your transformation.
      </p>

      <div className="glass rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-white mb-3">Your Journey Summary:</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white">Personality Type</div>
              <div className="text-sm text-white/60">{data.personalityType}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white">Focus Areas</div>
              <div className="text-sm text-white/60">
                {data.focusAreas.map((area) => focusAreaNames[area]).join(', ')}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-white">Starting Benefits</div>
              <div className="text-sm text-white/60">
                10 free minutes • 50 welcome crystals • Daily affirmations
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onComplete}
          className="w-full glass-button py-3 bg-gradient-to-r from-primary to-secondary text-white"
        >
          Start Your First Conversation
        </button>

        <button
          onClick={onComplete}
          className="w-full glass rounded-full py-3 text-white/70 hover:text-white"
        >
          Explore Assessments First
        </button>
      </div>

      <p className="text-sm text-white/50 mt-6">
        You can always change your preferences in settings
      </p>
    </div>
  )
}