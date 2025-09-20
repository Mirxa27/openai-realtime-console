'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { LanguageSelection } from '@/components/onboarding/language-selection'
import { PersonalityTest } from '@/components/onboarding/personality-test'
import { FocusAreas } from '@/components/onboarding/focus-areas'
import { Welcome } from '@/components/onboarding/welcome'
import { Loader2 } from 'lucide-react'

const steps = ['language', 'personality', 'focus', 'welcome'] as const
type Step = typeof steps[number]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('language')
  const [onboardingData, setOnboardingData] = useState({
    language: 'en',
    culture: 'western',
    personalityType: '',
    personalityAnalysis: {},
    focusAreas: [] as string[],
  })
  const { user, profile, updateProfile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    } else if (!loading && profile?.onboardingCompleted) {
      router.push('/chat')
    }
  }, [user, profile, loading, router])

  const handleStepComplete = (data: any) => {
    setOnboardingData({ ...onboardingData, ...data })
    
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handleComplete = async () => {
    await updateProfile({
      ...onboardingData,
      onboardingCompleted: true,
    })
    router.push('/chat')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="glass rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{
                width: `${((steps.indexOf(currentStep) + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-center text-white/60 text-sm mt-2">
            Step {steps.indexOf(currentStep) + 1} of {steps.length}
          </p>
        </div>

        {/* Step content */}
        <div className="glass-card p-8">
          {currentStep === 'language' && (
            <LanguageSelection
              onComplete={handleStepComplete}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'personality' && (
            <PersonalityTest
              onComplete={handleStepComplete}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'focus' && (
            <FocusAreas
              onComplete={handleStepComplete}
              initialData={onboardingData}
            />
          )}
          
          {currentStep === 'welcome' && (
            <Welcome
              onComplete={handleComplete}
              data={onboardingData}
            />
          )}
        </div>
      </div>
    </div>
  )
}