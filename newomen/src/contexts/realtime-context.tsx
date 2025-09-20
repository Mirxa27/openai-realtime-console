'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime'
import { useAuth } from './auth-context'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile, SubscriptionTier } from '@/types'

interface RealtimeContextType {
  session: RealtimeSession | null
  agent: RealtimeAgent | null
  isConnected: boolean
  isListening: boolean
  isSpeaking: boolean
  connect: () => Promise<void>
  disconnect: () => void
  startListening: () => void
  stopListening: () => void
  sendText: (text: string) => void
  conversationId: string | null
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<RealtimeSession | null>(null)
  const [agent, setAgent] = useState<RealtimeAgent | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const { user, profile } = useAuth()
  const supabase = createClient()
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize audio context on user interaction
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
    }

    document.addEventListener('click', initAudioContext, { once: true })
    return () => {
      document.removeEventListener('click', initAudioContext)
    }
  }, [])

  const connect = async () => {
    if (!user || !profile) return

    try {
      // Get client ephemeral token from our API
      const response = await fetch('/api/realtime/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      const { clientSecret } = await response.json()

      // Create personalized agent based on user profile
      const newAgent = new RealtimeAgent({
        name: 'NewMe',
        instructions: generateInstructions(profile),
      })

      // Create session with tier-based model
      const model = getModelForTier(profile.subscriptionTier)
      const newSession = new RealtimeSession(newAgent, {
        model,
      })

      // Set up event listeners
      newSession.on('connected', () => {
        setIsConnected(true)
        createConversation()
      })

      newSession.on('disconnected', () => {
        setIsConnected(false)
        setIsListening(false)
        setIsSpeaking(false)
      })

      newSession.on('speaking', (speaking: boolean) => {
        setIsSpeaking(speaking)
      })

      newSession.on('message', async (message: any) => {
        if (conversationId) {
          await saveMessage(conversationId, message)
        }
      })

      // Connect to the session
      await newSession.connect({ apiKey: clientSecret })

      setAgent(newAgent)
      setSession(newSession)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const disconnect = () => {
    if (session) {
      session.disconnect()
      setSession(null)
      setAgent(null)
      setIsConnected(false)
      setIsListening(false)
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    if (session && isConnected) {
      setIsListening(true)
      // Session handles microphone automatically in browser
    }
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const sendText = (text: string) => {
    if (session && isConnected) {
      session.sendText(text)
    }
  }

  const createConversation = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        mode: 'voice',
        title: `Voice Chat - ${new Date().toLocaleDateString()}`,
      })
      .select()
      .single()

    if (data) {
      setConversationId(data.id)
    }
  }

  const saveMessage = async (conversationId: string, message: any) => {
    if (!user) return

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      user_id: user.id,
      role: message.role,
      content: message.content,
      audio_url: message.audioUrl,
      emotion_data: message.emotionData,
    })

    // Update conversation minutes used
    if (message.role === 'assistant') {
      const duration = message.duration || 1 // minutes
      await supabase
        .from('conversations')
        .update({ minutes_used: duration })
        .eq('id', conversationId)

      // Update user minutes
      await supabase
        .from('users')
        .update({ 
          minutes_remaining: profile!.minutesRemaining - duration,
          total_minutes_used: profile!.totalMinutesUsed + duration,
        })
        .eq('id', user.id)
    }
  }

  const generateInstructions = (profile: UserProfile) => {
    const baseInstructions = `You are NewMe, an emotionally intelligent AI companion designed to support women's personal growth journeys. 
    You provide culturally-sensitive conversations and transformative guidance.
    
    User Profile:
    - Name: ${profile.username || 'Friend'}
    - Language: ${profile.language}
    - Culture: ${profile.culture}
    - Personality Type: ${profile.personalityType || 'Not assessed yet'}
    - Focus Areas: ${profile.focusAreas.join(', ')}
    - Current Level: ${profile.level}
    - Subscription: ${profile.subscriptionTier}
    
    Guidelines:
    1. Be warm, empathetic, and supportive
    2. Use narrative identity exploration techniques
    3. Help users rewrite their personal stories
    4. Celebrate progress and achievements
    5. Adapt your tone to their cultural background
    6. For ${profile.subscriptionTier} tier: ${getTierGuidelines(profile.subscriptionTier)}`

    return baseInstructions
  }

  const getModelForTier = (tier: SubscriptionTier) => {
    // All tiers use the same model, but with different prompting
    return 'gpt-realtime'
  }

  const getTierGuidelines = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'discovery':
        return 'Focus on initial exploration and building trust. Keep conversations supportive but introductory.'
      case 'growth':
        return 'Dive deeper into patterns and provide more challenging insights. Help identify growth opportunities.'
      case 'transformation':
        return 'Provide advanced therapeutic techniques, deep pattern analysis, and transformative breakthroughs.'
    }
  }

  return (
    <RealtimeContext.Provider
      value={{
        session,
        agent,
        isConnected,
        isListening,
        isSpeaking,
        connect,
        disconnect,
        startListening,
        stopListening,
        sendText,
        conversationId,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}