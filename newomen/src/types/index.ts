export type SubscriptionTier = 'discovery' | 'growth' | 'transformation'
export type UserRole = 'user' | 'admin' | 'moderator'
export type AssessmentType = 'personality' | 'diagnostic' | 'compatibility' | 'exploration'
export type AchievementCategory = 'milestone' | 'streak' | 'challenge' | 'special'
export type CrystalTransactionType = 'earned' | 'spent' | 'bonus' | 'penalty'
export type ConversationMode = 'text' | 'voice' | 'hybrid'

export interface UserProfile {
  id: string
  email: string
  username?: string
  avatarUrl?: string
  role: UserRole
  subscriptionTier: SubscriptionTier
  subscriptionExpiresAt?: string
  minutesRemaining: number
  totalMinutesUsed: number
  crystals: number
  level: number
  experiencePoints: number
  language: string
  culture: string
  timezone: string
  onboardingCompleted: boolean
  personalityType?: string
  personalityAnalysis?: any
  focusAreas: string[]
  narrativePatterns: any[]
  growthZones: any[]
  currentStreak: number
  longestStreak: number
}

export interface Conversation {
  id: string
  userId: string
  title?: string
  mode: ConversationMode
  summary?: string
  emotionSummary?: any
  isActive: boolean
  minutesUsed: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  userId: string
  role: 'user' | 'assistant' | 'system'
  content?: string
  audioUrl?: string
  emotionData?: any
  metadata?: any
  createdAt: string
}

export interface Assessment {
  id: string
  title: string
  description?: string
  type: AssessmentType
  category?: string
  questions: AssessmentQuestion[]
  scoringLogic?: any
  isFree: boolean
  isActive: boolean
  durationMinutes?: number
  crystalReward: number
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: 'multiple_choice' | 'scale' | 'text' | 'boolean'
  options?: string[]
  minValue?: number
  maxValue?: number
  required: boolean
}

export interface UserAssessment {
  id: string
  userId: string
  assessmentId: string
  assessment?: Assessment
  responses: any
  score?: any
  insights?: any
  completedAt: string
}

export interface Achievement {
  id: string
  name: string
  description?: string
  category: AchievementCategory
  icon?: string
  crystalReward: number
  requirements: any
  isActive: boolean
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  achievement?: Achievement
  earnedAt: string
}

export interface CrystalTransaction {
  id: string
  userId: string
  amount: number
  type: CrystalTransactionType
  description?: string
  referenceId?: string
  referenceType?: string
  createdAt: string
}

export interface UserProgress {
  id: string
  userId: string
  area: string
  percentage: number
  lastUpdated: string
  history: ProgressHistory[]
}

export interface ProgressHistory {
  percentage: number
  timestamp: string
}

export interface CompatibilitySession {
  id: string
  code: string
  initiatorId: string
  partnerId?: string
  assessmentId: string
  assessment?: Assessment
  initiatorResponses?: any
  partnerResponses?: any
  compatibilityScore?: any
  insights?: any
  status: 'pending' | 'in_progress' | 'completed' | 'expired'
  expiresAt: string
  completedAt?: string
  createdAt: string
}

export interface AIProvider {
  id: string
  name: string
  type: string
  apiKey?: string
  config: any
  models: AIModel[]
  isActive: boolean
  lastSyncedAt?: string
}

export interface AIModel {
  id: string
  name: string
  description?: string
  capabilities: string[]
  maxTokens?: number
  temperature?: number
}

export interface AIPrompt {
  id: string
  name: string
  category?: string
  provider?: string
  model?: string
  prompt: string
  systemPrompt?: string
  parameters: any
  tier?: SubscriptionTier
  isActive: boolean
}

export interface SiteSetting {
  id: string
  key: string
  value: any
  category?: string
}

export interface EnvironmentVariable {
  id: string
  key: string
  value?: string
  category?: string
  description?: string
  isSecret: boolean
}