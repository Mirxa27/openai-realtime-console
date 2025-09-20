'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { ChatInterface } from '@/components/chat/chat-interface'
import { DailyAffirmation } from '@/components/chat/daily-affirmation'
import { MinutesDisplay } from '@/components/chat/minutes-display'
import { Loader2 } from 'lucide-react'

export default function ChatPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [showAffirmation, setShowAffirmation] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Hide affirmation after 5 seconds
    const timer = setTimeout(() => {
      setShowAffirmation(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen mobile-full-screen relative">
      {/* Minutes display */}
      <MinutesDisplay minutes={profile.minutesRemaining} />

      {/* Daily affirmation overlay */}
      {showAffirmation && profile.onboardingCompleted && (
        <DailyAffirmation
          affirmation={profile.user_profiles?.[0]?.daily_affirmation}
          onClose={() => setShowAffirmation(false)}
        />
      )}

      {/* Main chat interface */}
      <ChatInterface />
    </div>
  )
}