import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  
  logout: () => set({ user: null, profile: null }),
  
  updateProfile: (updates) => set((state) => ({
    profile: { ...state.profile, ...updates }
  })),
}));

// App State Store
export const useAppStore = create((set, get) => ({
  // UI State
  isMobileNavOpen: false,
  currentPage: 'home',
  isVoiceChatActive: false,
  
  // Chat State
  messages: [],
  isTyping: false,
  currentHeadline: '',
  
  // Progress & Gamification
  crystals: 0,
  level: 1,
  streak: 0,
  achievements: [],
  progressData: {},
  
  // Voice Session
  voiceSession: null,
  isVoiceConnected: false,
  
  // Actions
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setVoiceChatActive: (active) => set({ isVoiceChatActive: active }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, { ...message, id: crypto.randomUUID(), timestamp: new Date() }]
  })),
  
  setTyping: (isTyping) => set({ isTyping }),
  setCurrentHeadline: (headline) => set({ currentHeadline: headline }),
  
  updateCrystals: (amount) => set((state) => ({ crystals: state.crystals + amount })),
  updateLevel: (level) => set({ level }),
  updateStreak: (streak) => set({ streak }),
  addAchievement: (achievement) => set((state) => ({
    achievements: [...state.achievements, achievement]
  })),
  
  updateProgress: (area, progress) => set((state) => ({
    progressData: { ...state.progressData, [area]: progress }
  })),
  
  setVoiceSession: (session) => set({ voiceSession: session }),
  setVoiceConnected: (connected) => set({ isVoiceConnected: connected }),
}));

// Admin Store
export const useAdminStore = create((set, get) => ({
  // Environment Variables
  envVars: {},
  envCategories: {
    database: ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'],
    ai: ['OPENAI_API_KEY', 'GEMINI_API_KEY', 'ELEVENLABS_API_KEY', 'LIVEKIT_API_KEY', 'DEEPGRAM_API_KEY', 'HUME_API_KEY'],
    payments: ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'PAYPAL_ENVIRONMENT'],
    email: ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'],
    branding: ['SITE_NAME', 'SITE_DESCRIPTION', 'SITE_LOGO_URL'],
    other: ['JWT_SECRET', 'NODE_ENV', 'PORT', 'FRONTEND_URL']
  },
  
  // AI Providers
  aiProviders: {},
  availableModels: {},
  
  // Content Management
  affirmations: [],
  assessments: [],
  challenges: [],
  
  // Analytics
  userAnalytics: {},
  aiUsageMetrics: {},
  
  // Actions
  updateEnvVar: (key, value) => set((state) => ({
    envVars: { ...state.envVars, [key]: value }
  })),
  
  setAIProvider: (provider, config) => set((state) => ({
    aiProviders: { ...state.aiProviders, [provider]: config }
  })),
  
  setAvailableModels: (provider, models) => set((state) => ({
    availableModels: { ...state.availableModels, [provider]: models }
  })),
  
  addAffirmation: (affirmation) => set((state) => ({
    affirmations: [...state.affirmations, affirmation]
  })),
  
  addAssessment: (assessment) => set((state) => ({
    assessments: [...state.assessments, assessment]
  })),
  
  updateAnalytics: (analytics) => set({ userAnalytics: analytics }),
  updateAIMetrics: (metrics) => set({ aiUsageMetrics: metrics }),
}));