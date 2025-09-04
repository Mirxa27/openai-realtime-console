'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile, SubscriptionTier } from '@/types'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, username?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    const { data: userData } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', userId)
      .single()

    if (userData) {
      setProfile({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        avatarUrl: userData.avatar_url,
        role: userData.role,
        subscriptionTier: userData.subscription_tier,
        subscriptionExpiresAt: userData.subscription_expires_at,
        minutesRemaining: userData.minutes_remaining,
        totalMinutesUsed: userData.total_minutes_used,
        crystals: userData.crystals,
        level: userData.level,
        experiencePoints: userData.experience_points,
        language: userData.language,
        culture: userData.culture,
        timezone: userData.timezone,
        onboardingCompleted: userData.onboarding_completed,
        personalityType: userData.user_profiles[0]?.personality_type,
        personalityAnalysis: userData.user_profiles[0]?.personality_analysis,
        focusAreas: userData.user_profiles[0]?.focus_areas || [],
        narrativePatterns: userData.user_profiles[0]?.narrative_patterns || [],
        growthZones: userData.user_profiles[0]?.growth_zones || [],
        currentStreak: userData.user_profiles[0]?.current_streak || 0,
        longestStreak: userData.user_profiles[0]?.longest_streak || 0,
      })
    }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, username?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({
        username: updates.username,
        avatar_url: updates.avatarUrl,
        language: updates.language,
        culture: updates.culture,
        timezone: updates.timezone,
      })
      .eq('id', user.id)

    if (updates.personalityType || updates.focusAreas) {
      await supabase
        .from('user_profiles')
        .update({
          personality_type: updates.personalityType,
          personality_analysis: updates.personalityAnalysis,
          focus_areas: updates.focusAreas,
          narrative_patterns: updates.narrativePatterns,
          growth_zones: updates.growthZones,
        })
        .eq('user_id', user.id)
    }

    if (!error) {
      await fetchProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}