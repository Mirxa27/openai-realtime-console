import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Mic, 
  Volume2, 
  Zap, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  TestTube
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function AIProviderSettings() {
  const { 
    aiProviders, 
    availableModels, 
    setAIProvider, 
    setAvailableModels 
  } = useAdminStore();
  
  const [activeProvider, setActiveProvider] = useState('openai');
  const [showApiKeys, setShowApiKeys] = useState({});
  const [isTestingConnection, setIsTestingConnection] = useState({});
  const [isFetchingModels, setIsFetchingModels] = useState({});

  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT models and Realtime API for voice conversations',
      icon: Brain,
      color: 'from-green-400 to-emerald-500',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'organization', label: 'Organization ID', type: 'text', required: false },
        { key: 'baseUrl', label: 'Base URL', type: 'text', required: false, default: 'https://api.openai.com/v1' }
      ],
      capabilities: ['text', 'voice', 'realtime', 'embeddings']
    },
    {
      id: 'gemini',
      name: 'Google Gemini',
      description: 'Google\'s advanced AI models for text and multimodal tasks',
      icon: Zap,
      color: 'from-blue-400 to-cyan-500',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'projectId', label: 'Project ID', type: 'text', required: false }
      ],
      capabilities: ['text', 'multimodal', 'embeddings']
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs',
      description: 'High-quality voice synthesis and cloning',
      icon: Volume2,
      color: 'from-purple-400 to-pink-500',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'voiceId', label: 'Default Voice ID', type: 'text', required: false }
      ],
      capabilities: ['voice-synthesis', 'voice-cloning']
    },
    {
      id: 'deepgram',
      name: 'Deepgram',
      description: 'Real-time speech recognition and transcription',
      icon: Mic,
      color: 'from-orange-400 to-red-500',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'model', label: 'Default Model', type: 'select', required: false, options: ['nova-2', 'enhanced', 'base'] }
      ],
      capabilities: ['speech-to-text', 'real-time-transcription']
    },
    {
      id: 'hume',
      name: 'Hume AI',
      description: 'Emotion detection and empathic AI capabilities',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      fields: [
        { key: 'apiKey', label: 'API Key', type: 'password', required: true },
        { key: 'configId', label: 'Config ID', type: 'text', required: false }
      ],
      capabilities: ['emotion-detection', 'empathic-ai']
    }
  ];

  const testProviderConnection = async (providerId) => {
    setIsTestingConnection(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const provider = aiProviders[providerId];
      if (!provider || !provider.apiKey) {
        throw new Error('API key is required');
      }

      const response = await fetch('/api/admin/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, config: provider })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(`${providers.find(p => p.id === providerId)?.name} connection successful!`);
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error) {
      toast.error(`Connection failed: ${error.message}`);
    } finally {
      setIsTestingConnection(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const fetchAvailableModels = async (providerId) => {
    setIsFetchingModels(prev => ({ ...prev, [providerId]: true }));
    
    try {
      const provider = aiProviders[providerId];
      if (!provider || !provider.apiKey) {
        throw new Error('API key is required');
      }

      const response = await fetch('/api/admin/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerId, config: provider })
      });

      const data = await response.json();
      
      if (data.success) {
        setAvailableModels(providerId, data.models);
        toast.success(`Models fetched for ${providers.find(p => p.id === providerId)?.name}`);
      } else {
        throw new Error(data.error || 'Failed to fetch models');
      }
    } catch (error) {
      toast.error(`Failed to fetch models: ${error.message}`);
    } finally {
      setIsFetchingModels(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const updateProviderConfig = (providerId, field, value) => {
    const currentConfig = aiProviders[providerId] || {};
    setAIProvider(providerId, {
      ...currentConfig,
      [field]: value
    });
  };

  const saveProviderConfig = async (providerId) => {
    try {
      const response = await fetch('/api/admin/ai-providers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          config: aiProviders[providerId]
        })
      });

      if (response.ok) {
        toast.success('Provider configuration saved');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      toast.error('Failed to save provider configuration');
    }
  };

  const currentProvider = providers.find(p => p.id === activeProvider);
  const currentConfig = aiProviders[activeProvider] || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">AI Provider Settings</h2>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => saveProviderConfig(activeProvider)}
          className="flex items-center space-x-2 px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Save Configuration</span>
        </motion.button>
      </div>

      {/* Provider Tabs */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-2">
          {providers.map((provider) => {
            const Icon = provider.icon;
            const isActive = activeProvider === provider.id;
            const isConfigured = aiProviders[provider.id]?.apiKey;
            
            return (
              <motion.button
                key={provider.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveProvider(provider.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all relative ${
                  isActive
                    ? 'bg-newomen-primary text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{provider.name}</span>
                
                {isConfigured && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Provider Configuration */}
      {currentProvider && (
        <GlassCard className="p-6">
          <div className="flex items-start space-x-4 mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${currentProvider.color} rounded-2xl flex items-center justify-center`}>
              <currentProvider.icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{currentProvider.name}</h3>
              <p className="text-white/70 mb-4">{currentProvider.description}</p>
              
              {/* Capabilities */}
              <div className="flex flex-wrap gap-2">
                {currentProvider.capabilities.map((capability) => (
                  <span 
                    key={capability}
                    className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {currentProvider.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-white/80 font-medium mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>
                
                {field.type === 'select' ? (
                  <select
                    value={currentConfig[field.key] || field.default || ''}
                    onChange={(e) => updateProviderConfig(activeProvider, field.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input
                      type={field.type === 'password' && !showApiKeys[field.key] ? 'password' : 'text'}
                      value={currentConfig[field.key] || field.default || ''}
                      onChange={(e) => updateProviderConfig(activeProvider, field.key, e.target.value)}
                      placeholder={`Enter ${field.label}...`}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary transition-all"
                    />
                    
                    {field.type === 'password' && (
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showApiKeys[field.key] ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => testProviderConnection(activeProvider)}
              disabled={isTestingConnection[activeProvider] || !currentConfig.apiKey}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {isTestingConnection[activeProvider] ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              <span>{isTestingConnection[activeProvider] ? 'Testing...' : 'Test Connection'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchAvailableModels(activeProvider)}
              disabled={isFetchingModels[activeProvider] || !currentConfig.apiKey}
              className="flex items-center space-x-2 px-4 py-2 bg-newomen-secondary hover:bg-newomen-accent rounded-lg text-white font-medium transition-colors disabled:opacity-50"
            >
              {isFetchingModels[activeProvider] ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isFetchingModels[activeProvider] ? 'Fetching...' : 'Fetch Models'}</span>
            </motion.button>
          </div>
        </GlassCard>
      )}

      {/* Available Models */}
      {availableModels[activeProvider] && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Available Models</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModels[activeProvider].map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{model.id}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    model.owned_by === 'openai' ? 'bg-green-500/20 text-green-400' :
                    model.owned_by === 'google' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {model.owned_by}
                  </span>
                </div>
                
                <p className="text-white/60 text-sm mb-3">
                  Created: {new Date(model.created * 1000).toLocaleDateString()}
                </p>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {/* Set as default */}}
                    className="flex-1 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded text-white text-sm font-medium transition-colors"
                  >
                    Set Default
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {/* Configure model */}}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* AI Configuration Presets */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">AI Configuration Presets</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-2">NewMe Personality</h4>
            <textarea
              placeholder="Define NewMe's personality, tone, and conversation style..."
              className="w-full h-32 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary resize-none"
              defaultValue="You are NewMe, an emotionally intelligent AI companion for the Newomen platform. You help women explore their narrative identity and personal growth. Be warm, empathetic, culturally sensitive, and focus on helping users understand and reshape their personal stories. Always maintain a supportive, non-judgmental tone and encourage self-discovery through thoughtful questions."
            />
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Cultural Sensitivity Guidelines</h4>
            <textarea
              placeholder="Define cultural sensitivity guidelines and adaptations..."
              className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary resize-none"
              defaultValue="Be respectful of diverse cultural backgrounds, especially Middle Eastern and Arabic cultures. Adapt communication style based on user's cultural preferences. Avoid assumptions about family structures, religious beliefs, or cultural practices."
            />
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-white font-semibold mb-2">Conversation Safety Guidelines</h4>
            <textarea
              placeholder="Define safety guidelines and boundaries..."
              className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary resize-none"
              defaultValue="Always prioritize user safety and well-being. If users express thoughts of self-harm or severe mental health crises, provide appropriate resources and encourage professional help. Maintain professional boundaries while being empathetic and supportive."
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
        >
          Save AI Configuration
        </motion.button>
      </GlassCard>

      {/* Provider Status Overview */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Provider Status Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => {
            const isConfigured = aiProviders[provider.id]?.apiKey;
            const hasModels = availableModels[provider.id]?.length > 0;
            
            return (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${provider.color} rounded-lg flex items-center justify-center`}>
                    <provider.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{provider.name}</h4>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isConfigured ? 'bg-green-400' : 'bg-red-400'
                      }`} />
                      <span className="text-white/60 text-sm">
                        {isConfigured ? 'Configured' : 'Not configured'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-white/60">
                  <div className="flex justify-between">
                    <span>API Key:</span>
                    <span>{isConfigured ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Models:</span>
                    <span>{hasModels ? availableModels[provider.id].length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={isConfigured ? 'text-green-400' : 'text-red-400'}>
                      {isConfigured ? 'Ready' : 'Needs setup'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}