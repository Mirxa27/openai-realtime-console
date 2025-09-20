-- Design Configuration and Deployment Tables
-- This file extends the main schema with design management and deployment tracking

-- Design configurations table
CREATE TABLE IF NOT EXISTS design_configs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  config JSONB NOT NULL,
  generated_css TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deployment tracking table
CREATE TABLE IF NOT EXISTS deployments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'building', 'ready', 'error', 'cancelled')),
  vercel_deployment_id TEXT,
  vercel_url TEXT,
  error_message TEXT,
  build_logs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS policies for design_configs
ALTER TABLE design_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "design_configs_admin_all" ON design_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for deployments
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deployments_admin_all" ON deployments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_design_configs_active ON design_configs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_deployments_status ON deployments(status);
CREATE INDEX IF NOT EXISTS idx_deployments_created_at ON deployments(created_at DESC);

-- Insert default design configuration
INSERT INTO design_configs (config, is_active, created_at) VALUES (
  '{
    "colors": {
      "primary": "#8B5CF6",
      "secondary": "#A855F7", 
      "accent": "#C084FC",
      "background": "#0F0F23",
      "surface": "#1A1A35",
      "text": "#FFFFFF"
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "fontSize": {
        "base": "16px",
        "heading": "2rem",
        "small": "14px"
      }
    },
    "layout": {
      "borderRadius": "16px",
      "spacing": "1rem",
      "glassOpacity": 0.1,
      "backdropBlur": "20px"
    },
    "branding": {
      "logo": "/logo.png",
      "siteName": "Newomen",
      "favicon": "/favicon.ico"
    }
  }',
  true,
  NOW()
) ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_design_config_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for design_configs
CREATE TRIGGER update_design_configs_updated_at
  BEFORE UPDATE ON design_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_design_config_updated_at();