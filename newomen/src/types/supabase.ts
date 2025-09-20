export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          username: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator'
          subscription_tier: 'discovery' | 'growth' | 'transformation'
          subscription_expires_at: string | null
          minutes_remaining: number
          total_minutes_used: number
          crystals: number
          level: number
          experience_points: number
          language: string
          culture: string
          timezone: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          subscription_tier?: 'discovery' | 'growth' | 'transformation'
          subscription_expires_at?: string | null
          minutes_remaining?: number
          total_minutes_used?: number
          crystals?: number
          level?: number
          experience_points?: number
          language?: string
          culture?: string
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          subscription_tier?: 'discovery' | 'growth' | 'transformation'
          subscription_expires_at?: string | null
          minutes_remaining?: number
          total_minutes_used?: number
          crystals?: number
          level?: number
          experience_points?: number
          language?: string
          culture?: string
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          personality_type: string | null
          personality_analysis: Json | null
          focus_areas: Json
          narrative_patterns: Json
          growth_zones: Json
          daily_affirmation: string | null
          current_streak: number
          longest_streak: number
          last_active_at: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          personality_type?: string | null
          personality_analysis?: Json | null
          focus_areas?: Json
          narrative_patterns?: Json
          growth_zones?: Json
          daily_affirmation?: string | null
          current_streak?: number
          longest_streak?: number
          last_active_at?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          personality_type?: string | null
          personality_analysis?: Json | null
          focus_areas?: Json
          narrative_patterns?: Json
          growth_zones?: Json
          daily_affirmation?: string | null
          current_streak?: number
          longest_streak?: number
          last_active_at?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          mode: string
          summary: string | null
          emotion_summary: Json | null
          is_active: boolean
          minutes_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          mode?: string
          summary?: string | null
          emotion_summary?: Json | null
          is_active?: boolean
          minutes_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          mode?: string
          summary?: string | null
          emotion_summary?: Json | null
          is_active?: boolean
          minutes_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string | null
          audio_url: string | null
          emotion_data: Json | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content?: string | null
          audio_url?: string | null
          emotion_data?: Json | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string | null
          audio_url?: string | null
          emotion_data?: Json | null
          metadata?: Json
          created_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'personality' | 'diagnostic' | 'compatibility' | 'exploration'
          category: string | null
          questions: Json
          scoring_logic: Json | null
          is_free: boolean
          is_active: boolean
          duration_minutes: number | null
          crystal_reward: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'personality' | 'diagnostic' | 'compatibility' | 'exploration'
          category?: string | null
          questions: Json
          scoring_logic?: Json | null
          is_free?: boolean
          is_active?: boolean
          duration_minutes?: number | null
          crystal_reward?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'personality' | 'diagnostic' | 'compatibility' | 'exploration'
          category?: string | null
          questions?: Json
          scoring_logic?: Json | null
          is_free?: boolean
          is_active?: boolean
          duration_minutes?: number | null
          crystal_reward?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}