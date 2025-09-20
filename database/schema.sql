-- Newomen Database Schema
-- This file contains all the database tables and relationships for the Newomen platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  nickname TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  
  -- Onboarding & Preferences
  preferred_language TEXT DEFAULT 'en',
  cultural_background TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  
  -- Personality & Growth
  personality_type TEXT,
  focus_areas JSONB DEFAULT '[]',
  
  -- Gamification
  crystals INTEGER DEFAULT 100,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  total_minutes_used INTEGER DEFAULT 0,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'discovery' CHECK (subscription_tier IN ('discovery', 'growth', 'transformation')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  area TEXT NOT NULL, -- relationships, wellness, identity, family, career, community
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  milestones_completed JSONB DEFAULT '[]',
  last_assessment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, area)
);

-- Achievements system
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  crystal_reward INTEGER DEFAULT 0,
  requirements JSONB, -- Conditions to unlock the achievement
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (many-to-many)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- Assessments and tests
CREATE TABLE IF NOT EXISTS assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER,
  crystal_reward INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT TRUE,
  required_level INTEGER DEFAULT 1,
  questions JSONB NOT NULL, -- Array of question objects
  scoring_logic JSONB, -- How to calculate results
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User assessment results
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  answers JSONB NOT NULL,
  results JSONB, -- Calculated results and insights
  score INTEGER,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, assessment_id, completed_at)
);

-- Conversation history
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT,
  messages JSONB NOT NULL DEFAULT '[]',
  voice_session BOOLEAN DEFAULT FALSE,
  duration_minutes INTEGER DEFAULT 0,
  crystals_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community connections
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(requester_id, addressee_id)
);

-- Group challenges
CREATE TABLE IF NOT EXISTS group_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  crystal_reward INTEGER DEFAULT 0,
  max_participants INTEGER,
  requirements JSONB, -- Requirements to join
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge participation
CREATE TABLE IF NOT EXISTS challenge_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES group_challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  progress JSONB DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  UNIQUE(challenge_id, user_id)
);

-- Compatibility sessions for the AI compatibility feature
CREATE TABLE IF NOT EXISTS compatibility_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  link_id TEXT UNIQUE NOT NULL,
  participant_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  analysis TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days'
);

-- Daily affirmations
CREATE TABLE IF NOT EXISTS daily_affirmations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT,
  cultural_context TEXT[], -- Which cultures this applies to
  personality_types TEXT[], -- Which personality types this resonates with
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wellness resources
CREATE TABLE IF NOT EXISTS wellness_resources (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- breathing, meditation, affirmations, sleep
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER,
  audio_url TEXT,
  benefits TEXT[],
  is_free BOOLEAN DEFAULT TRUE,
  required_level INTEGER DEFAULT 1,
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Environment variables backup (encrypted)
CREATE TABLE IF NOT EXISTS env_backups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  env_data_encrypted TEXT NOT NULL,
  backup_reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI provider configurations
CREATE TABLE IF NOT EXISTS ai_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  provider_name TEXT UNIQUE NOT NULL,
  config_encrypted TEXT NOT NULL, -- Encrypted JSON config
  is_active BOOLEAN DEFAULT TRUE,
  last_tested_at TIMESTAMPTZ,
  test_status TEXT,
  available_models JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  paypal_transaction_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  subscription_tier TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription history
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_nickname ON profiles(nickname);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_area ON user_progress(area);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_addressee ON user_connections(addressee_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_sessions_link_id ON compatibility_sessions(link_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for conversations
CREATE POLICY "Users can view own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for assessment_results
CREATE POLICY "Users can view own assessment results" ON assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessment results" ON assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_providers_updated_at
  BEFORE UPDATE ON ai_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data

-- Default achievements
INSERT INTO achievements (name, description, icon, crystal_reward, requirements, category) VALUES
('Welcome Aboard', 'Complete your onboarding journey', 'sparkles', 200, '{"onboarding_completed": true}', 'onboarding'),
('First Steps', 'Complete your first assessment', 'brain', 100, '{"assessments_completed": 1}', 'assessment'),
('Conversation Starter', 'Have your first AI conversation', 'message-circle', 75, '{"conversations_started": 1}', 'chat'),
('Community Member', 'Make your first connection', 'users', 150, '{"connections_made": 1}', 'community'),
('Growth Mindset', 'Complete 5 assessments', 'trophy', 300, '{"assessments_completed": 5}', 'assessment'),
('Consistent Grower', 'Maintain a 7-day streak', 'calendar', 250, '{"streak_days": 7}', 'consistency'),
('Transformation Champion', 'Reach level 5', 'star', 500, '{"level_reached": 5}', 'level'),
('Voice Explorer', 'Complete 10 voice conversations', 'mic', 400, '{"voice_conversations": 10}', 'voice'),
('Community Leader', 'Help 5 people through connections', 'heart', 600, '{"people_helped": 5}', 'community'),
('Master Grower', 'Complete all focus area assessments', 'crown', 1000, '{"all_areas_completed": true}', 'mastery')
ON CONFLICT (name) DO NOTHING;

-- Default assessments
INSERT INTO assessments (title, description, category, duration_minutes, crystal_reward, is_free, questions, scoring_logic) VALUES
(
  'Quick Personality Insight',
  'Discover your core personality traits in 5 minutes',
  'personality',
  5,
  50,
  TRUE,
  '[
    {
      "id": "q1",
      "question": "When facing a challenge, I typically:",
      "type": "single_choice",
      "options": [
        {"value": "analytical", "label": "Analyze the situation methodically"},
        {"value": "intuitive", "label": "Trust my gut feelings"},
        {"value": "collaborative", "label": "Seek advice from others"},
        {"value": "action-oriented", "label": "Jump in and figure it out"}
      ]
    },
    {
      "id": "q2", 
      "question": "In relationships, I value most:",
      "type": "single_choice",
      "options": [
        {"value": "deep-connection", "label": "Deep emotional connection"},
        {"value": "independence", "label": "Maintaining my independence"},
        {"value": "support", "label": "Mutual support and growth"},
        {"value": "adventure", "label": "Shared adventures and experiences"}
      ]
    },
    {
      "id": "q3",
      "question": "My ideal personal growth involves:",
      "type": "single_choice", 
      "options": [
        {"value": "structured", "label": "Structured, step-by-step progress"},
        {"value": "organic", "label": "Organic, natural development"},
        {"value": "guided", "label": "Expert guidance and support"},
        {"value": "self-directed", "label": "Self-directed exploration"}
      ]
    }
  ]',
  '{"personality_mapping": {"analytical": "Analytical Thinker", "intuitive": "Intuitive Explorer", "collaborative": "Collaborative Connector", "action-oriented": "Action-Oriented Achiever"}}'
),
(
  'Relationship Style Assessment', 
  'Understand how you connect with others',
  'relationships',
  7,
  75,
  TRUE,
  '[
    {
      "id": "r1",
      "question": "In conflicts, I tend to:",
      "type": "single_choice",
      "options": [
        {"value": "address-directly", "label": "Address issues directly and immediately"},
        {"value": "need-time", "label": "Need time to process before discussing"},
        {"value": "seek-harmony", "label": "Focus on maintaining harmony"},
        {"value": "find-compromise", "label": "Look for creative compromises"}
      ]
    },
    {
      "id": "r2",
      "question": "I feel most loved when:",
      "type": "single_choice",
      "options": [
        {"value": "words", "label": "I receive affirming words"},
        {"value": "actions", "label": "Someone does something helpful for me"},
        {"value": "time", "label": "Someone spends quality time with me"},
        {"value": "touch", "label": "I receive physical affection"},
        {"value": "gifts", "label": "I receive thoughtful gifts"}
      ]
    }
  ]',
  '{"love_languages": {"words": "Words of Affirmation", "actions": "Acts of Service", "time": "Quality Time", "touch": "Physical Touch", "gifts": "Receiving Gifts"}}'
)
ON CONFLICT (title) DO NOTHING;

-- Default wellness resources
INSERT INTO wellness_resources (title, description, category, difficulty, duration_minutes, audio_url, benefits, is_free) VALUES
('4-7-8 Calming Breath', 'Perfect for anxiety relief and relaxation', 'breathing', 'beginner', 5, '/audio/calm-breathing.mp3', ARRAY['Reduces anxiety', 'Improves sleep', 'Calms nervous system'], TRUE),
('Energizing Breath Work', 'Boost your energy and mental clarity', 'breathing', 'intermediate', 8, '/audio/energy-boost.mp3', ARRAY['Increases energy', 'Enhances focus', 'Improves mood'], TRUE),
('Box Breathing for Focus', 'Military-grade technique for concentration', 'breathing', 'beginner', 10, '/audio/box-breathing.mp3', ARRAY['Improves focus', 'Reduces stress', 'Enhances performance'], TRUE),
('Progressive Body Scan', 'Release tension and connect with your body', 'meditation', 'beginner', 15, '/audio/body-scan.mp3', ARRAY['Body awareness', 'Stress relief', 'Better sleep'], FALSE),
('Loving-Kindness Meditation', 'Cultivate compassion for yourself and others', 'meditation', 'intermediate', 20, '/audio/loving-kindness.mp3', ARRAY['Self-compassion', 'Emotional healing', 'Relationship improvement'], FALSE),
('Daily Empowerment Affirmations', 'Start your day with powerful self-affirmations', 'affirmations', 'beginner', 12, '/audio/daily-affirmations.mp3', ARRAY['Boosts confidence', 'Positive mindset', 'Self-love'], TRUE)
ON CONFLICT (title) DO NOTHING;

-- Default daily affirmations
INSERT INTO daily_affirmations (content, category, cultural_context, personality_types) VALUES
('You are the author of your own story. Write it beautifully.', 'empowerment', ARRAY['general'], ARRAY['all']),
('Your authentic self is your greatest strength.', 'identity', ARRAY['general'], ARRAY['all']),
('Growth happens outside your comfort zone. Embrace the journey.', 'growth', ARRAY['general'], ARRAY['all']),
('You have the power to transform your narrative.', 'transformation', ARRAY['general'], ARRAY['all']),
('Every conversation with yourself matters.', 'self-reflection', ARRAY['general'], ARRAY['all']),
('Your voice deserves to be heard and honored.', 'empowerment', ARRAY['general'], ARRAY['all']),
('Progress, not perfection, is the goal.', 'growth', ARRAY['general'], ARRAY['all']),
('You are worthy of the love and growth you seek.', 'self-love', ARRAY['general'], ARRAY['all'])
ON CONFLICT (content) DO NOTHING;

-- Default group challenges
INSERT INTO group_challenges (title, description, start_date, end_date, crystal_reward, max_participants) VALUES
('7-Day Mindfulness Challenge', 'Practice daily mindfulness with the community', NOW(), NOW() + INTERVAL '7 days', 150, 1000),
('Gratitude Month', 'Share daily gratitudes and spread positivity', NOW(), NOW() + INTERVAL '30 days', 300, 2000),
('Story Sharing Circle', 'Share and celebrate transformation stories', NOW() + INTERVAL '3 days', NOW() + INTERVAL '10 days', 200, 500)
ON CONFLICT (title) DO NOTHING;