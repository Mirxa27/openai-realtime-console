import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Download,
  Upload
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAdminStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function EnvironmentSettings() {
  const { 
    envVars, 
    envCategories, 
    updateEnvVar 
  } = useAdminStore();
  
  const [showSecrets, setShowSecrets] = useState({});
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('database');
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarValue, setNewVarValue] = useState('');
  const [newVarDescription, setNewVarDescription] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const envDescriptions = {
    // Database
    'SUPABASE_URL': 'Supabase project URL for database connections',
    'SUPABASE_ANON_KEY': 'Public anonymous key for client-side operations',
    'SUPABASE_SERVICE_ROLE_KEY': 'Service role key for server-side operations (keep secret)',
    'SUPABASE_DB_URL': 'Direct PostgreSQL database connection string',
    
    // AI Providers
    'OPENAI_API_KEY': 'OpenAI API key for GPT models and Realtime API',
    'GEMINI_API_KEY': 'Google Gemini API key for alternative AI models',
    'ELEVENLABS_API_KEY': 'ElevenLabs API key for voice synthesis',
    'LIVEKIT_API_KEY': 'LiveKit API key for real-time communication',
    'DEEPGRAM_API_KEY': 'Deepgram API key for speech recognition',
    'HUME_API_KEY': 'Hume AI API key for emotion detection',
    
    // Payments
    'PAYPAL_CLIENT_ID': 'PayPal client ID for payment processing',
    'PAYPAL_CLIENT_SECRET': 'PayPal client secret (keep secret)',
    'PAYPAL_ENVIRONMENT': 'PayPal environment (sandbox or live)',
    
    // Email
    'SMTP_HOST': 'SMTP server hostname for email sending',
    'SMTP_PORT': 'SMTP server port (usually 587 or 465)',
    'SMTP_USER': 'SMTP username for authentication',
    'SMTP_PASS': 'SMTP password (keep secret)',
    
    // Branding
    'SITE_NAME': 'Display name for the application',
    'SITE_DESCRIPTION': 'SEO description for the application',
    'SITE_LOGO_URL': 'URL path to the main logo image',
    
    // Other
    'JWT_SECRET': 'Secret key for JWT token signing (keep secret)',
    'NODE_ENV': 'Application environment (development/production)',
    'PORT': 'Server port number',
    'FRONTEND_URL': 'Frontend application URL'
  };

  const categoryLabels = {
    database: 'Database Configuration',
    ai: 'AI Providers',
    payments: 'Payment Processing',
    email: 'Email Configuration',
    branding: 'Site Branding',
    other: 'Other Settings'
  };

  const isSecretField = (key) => {
    return key.includes('SECRET') || key.includes('PASS') || key.includes('KEY');
  };

  const toggleSecretVisibility = (key) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addNewVariable = async () => {
    if (!newVarKey.trim()) {
      toast.error('Variable key is required');
      return;
    }

    try {
      // Add to current category
      updateEnvVar(newVarKey, newVarValue);
      
      // Save to backend
      const response = await fetch('/api/admin/env-vars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: newVarKey,
          value: newVarValue,
          description: newVarDescription,
          category: activeCategory
        })
      });

      if (response.ok) {
        toast.success('Environment variable added');
        setNewVarKey('');
        setNewVarValue('');
        setNewVarDescription('');
      } else {
        throw new Error('Failed to add variable');
      }
    } catch (error) {
      toast.error('Failed to add environment variable');
    }
  };

  const saveEnvironmentChanges = async () => {
    try {
      const response = await fetch('/api/admin/env-vars/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ envVars })
      });

      if (response.ok) {
        toast.success('Environment variables saved');
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      toast.error('Failed to save environment changes');
    }
  };

  const deployToVercel = async () => {
    setIsDeploying(true);
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Deployment initiated successfully');
      } else {
        throw new Error(data.error || 'Deployment failed');
      }
    } catch (error) {
      toast.error('Failed to deploy to Vercel');
    } finally {
      setIsDeploying(false);
    }
  };

  const exportEnvironment = () => {
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const blob = new Blob([envContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Environment file exported');
  };

  const importEnvironment = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        
        lines.forEach(line => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=');
            updateEnvVar(key.trim(), value.trim());
          }
        });
        
        toast.success('Environment file imported');
      } catch (error) {
        toast.error('Failed to import environment file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Environment Settings</h2>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportEnvironment}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".env"
              onChange={importEnvironment}
              className="hidden"
            />
          </label>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveEnvironmentChanges}
            className="flex items-center space-x-2 px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={deployToVercel}
            disabled={isDeploying}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-newomen-secondary to-newomen-accent rounded-lg text-white font-medium hover:from-newomen-accent hover:to-newomen-secondary transition-all duration-300 disabled:opacity-50"
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            <span>{isDeploying ? 'Deploying...' : 'Deploy to Vercel'}</span>
          </motion.button>
        </div>
      </div>

      {/* Category Tabs */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(envCategories).map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeCategory === category
                  ? 'bg-newomen-primary text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {categoryLabels[category]}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      {/* Environment Variables */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {categoryLabels[activeCategory]}
          </h3>
          
          {/* Add New Variable */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-3 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Variable</span>
          </motion.button>
        </div>

        {/* Add New Variable Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 p-4 bg-white/5 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={newVarKey}
                onChange={(e) => setNewVarKey(e.target.value)}
                placeholder="Variable Key (e.g., NEW_API_KEY)"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
              <input
                type="text"
                value={newVarValue}
                onChange={(e) => setNewVarValue(e.target.value)}
                placeholder="Variable Value"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
              <input
                type="text"
                value={newVarDescription}
                onChange={(e) => setNewVarDescription(e.target.value)}
                placeholder="Description"
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={addNewVariable}
              className="px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
            >
              Add Variable
            </motion.button>
          </motion.div>
        )}

        {/* Environment Variables List */}
        <div className="space-y-4">
          {envCategories[activeCategory]?.map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-white font-semibold">{key}</h4>
                    {isSecretField(key) && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        Secret
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">
                    {envDescriptions[key] || 'No description available'}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isSecretField(key) && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSecretVisibility(key)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                      {showSecrets[key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateEnvVar(key, '')}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type={isSecretField(key) && !showSecrets[key] ? 'password' : 'text'}
                  value={envVars[key] || ''}
                  onChange={(e) => updateEnvVar(key, e.target.value)}
                  placeholder={`Enter ${key}...`}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary transition-all"
                />
                
                {/* Status Indicator */}
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {envVars[key] ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Vercel Integration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Vercel Integration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-white/80 font-medium mb-2">
              Vercel Token
            </label>
            <input
              type="password"
              value={envVars.VERCEL_TOKEN || ''}
              onChange={(e) => updateEnvVar('VERCEL_TOKEN', e.target.value)}
              placeholder="Enter Vercel API token..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>
          
          <div>
            <label className="block text-white/80 font-medium mb-2">
              Project ID
            </label>
            <input
              type="text"
              value={envVars.VERCEL_PROJECT_ID || ''}
              onChange={(e) => updateEnvVar('VERCEL_PROJECT_ID', e.target.value)}
              placeholder="Enter project ID..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>
          
          <div>
            <label className="block text-white/80 font-medium mb-2">
              Organization ID
            </label>
            <input
              type="text"
              value={envVars.VERCEL_ORG_ID || ''}
              onChange={(e) => updateEnvVar('VERCEL_ORG_ID', e.target.value)}
              placeholder="Enter org ID..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={deployToVercel}
            disabled={isDeploying || !envVars.VERCEL_TOKEN}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-newomen-secondary to-newomen-accent rounded-lg text-white font-semibold hover:from-newomen-accent hover:to-newomen-secondary transition-all duration-300 disabled:opacity-50"
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ExternalLink className="w-4 h-4" />
            )}
            <span>{isDeploying ? 'Deploying...' : 'Deploy Now'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {/* Test connection */}}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Test Connection</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Environment Backup */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Backup & Recovery</h3>
        <p className="text-white/70 mb-4">
          Automatic backups are created before each deployment. Restore previous configurations if needed.
        </p>
        
        <div className="space-y-3">
          {[
            { date: '2024-01-15 14:30', status: 'success', changes: 3 },
            { date: '2024-01-14 09:15', status: 'success', changes: 1 },
            { date: '2024-01-13 16:45', status: 'rollback', changes: 5 }
          ].map((backup, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  backup.status === 'success' ? 'bg-green-400' : 
                  backup.status === 'rollback' ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <div>
                  <p className="text-white font-medium">{backup.date}</p>
                  <p className="text-white/60 text-sm">{backup.changes} variables changed</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-sm transition-colors"
              >
                Restore
              </motion.button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}