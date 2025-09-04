'use client'

import { useState, useEffect } from 'react'
import { Brain, Plus, Save, Trash2, RefreshCw, Settings, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/toaster'
import type { AIProvider, AIPrompt } from '@/types'

const providerTypes = [
  { value: 'openai', label: 'OpenAI', fields: ['api_key', 'organization'] },
  { value: 'gemini', label: 'Google Gemini', fields: ['api_key'] },
  { value: 'elevenlabs', label: 'ElevenLabs', fields: ['api_key'] },
  { value: 'livekit', label: 'LiveKit', fields: ['api_key', 'api_secret', 'url'] },
  { value: 'deepgram', label: 'Deepgram', fields: ['api_key'] },
  { value: 'hume', label: 'Hume AI', fields: ['api_key'] },
]

export default function AIConfigPage() {
  const [providers, setProviders] = useState<AIProvider[]>([])
  const [prompts, setPrompts] = useState<AIPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | null>(null)
  const [showAddProvider, setShowAddProvider] = useState(false)
  const [showPromptEditor, setShowPromptEditor] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [providersResult, promptsResult] = await Promise.all([
      supabase.from('ai_providers').select('*').order('name'),
      supabase.from('ai_prompts').select('*').order('category, name'),
    ])

    if (providersResult.data) setProviders(providersResult.data)
    if (promptsResult.data) setPrompts(promptsResult.data)
    setLoading(false)
  }

  const addProvider = async (providerData: Partial<AIProvider>) => {
    const { data, error } = await supabase
      .from('ai_providers')
      .insert(providerData)
      .select()
      .single()

    if (data) {
      setProviders([...providers, data])
      setShowAddProvider(false)
      toast({ title: 'Provider added successfully', type: 'success' })
      
      // Auto-fetch models
      await fetchModels(data)
    } else {
      toast({ title: 'Failed to add provider', type: 'error' })
    }
  }

  const fetchModels = async (provider: AIProvider) => {
    toast({ title: `Fetching models for ${provider.name}...`, type: 'info' })
    
    try {
      const response = await fetch('/api/admin/ai/fetch-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      })

      const data = await response.json()
      
      if (data.models) {
        await supabase
          .from('ai_providers')
          .update({ models: data.models, last_synced_at: new Date().toISOString() })
          .eq('id', provider.id)

        setProviders(
          providers.map((p) =>
            p.id === provider.id ? { ...p, models: data.models } : p
          )
        )

        toast({ title: `Found ${data.models.length} models`, type: 'success' })
      }
    } catch (error) {
      toast({ title: 'Failed to fetch models', type: 'error' })
    }
  }

  const savePrompt = async (promptData: Partial<AIPrompt>) => {
    const isNew = !promptData.id

    const { data, error } = await supabase
      .from('ai_prompts')
      .upsert(promptData)
      .select()
      .single()

    if (data) {
      if (isNew) {
        setPrompts([...prompts, data])
      } else {
        setPrompts(prompts.map((p) => (p.id === data.id ? data : p)))
      }
      setShowPromptEditor(false)
      setEditingPrompt(null)
      toast({ title: 'Prompt saved successfully', type: 'success' })
    }
  }

  const deleteProvider = async (id: string) => {
    if (!confirm('Are you sure? This will remove all associated prompts.')) return

    const { error } = await supabase.from('ai_providers').delete().eq('id', id)

    if (!error) {
      setProviders(providers.filter((p) => p.id !== id))
      toast({ title: 'Provider deleted', type: 'success' })
    }
  }

  if (loading) {
    return <div className="text-white">Loading AI configuration...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">AI Configuration</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddProvider(true)}
            className="glass-button flex items-center gap-2"
          >
            <Plus size={20} />
            Add Provider
          </button>
          <button
            onClick={() => {
              setEditingPrompt(null)
              setShowPromptEditor(true)
            }}
            className="glass-button flex items-center gap-2"
          >
            <Plus size={20} />
            Create Prompt
          </button>
        </div>
      </div>

      {/* Provider Setup Wizard */}
      {showAddProvider && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Add AI Provider</h3>
          <ProviderSetupWizard
            onSave={addProvider}
            onCancel={() => setShowAddProvider(false)}
          />
        </div>
      )}

      {/* Providers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {providers.map((provider) => (
          <div key={provider.id} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Brain size={20} />
                  {provider.name}
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Type: {provider.type} • Models: {provider.models?.length || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchModels(provider)}
                  className="text-white/50 hover:text-white"
                  title="Refresh models"
                >
                  <RefreshCw size={16} />
                </button>
                <button
                  onClick={() => setSelectedProvider(provider)}
                  className="text-white/50 hover:text-white"
                  title="Configure"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={() => deleteProvider(provider.id)}
                  className="text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {provider.isActive ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <Zap size={14} />
                Active
              </div>
            ) : (
              <div className="text-white/50 text-sm">Inactive</div>
            )}

            {provider.lastSyncedAt && (
              <p className="text-xs text-white/40 mt-2">
                Last synced: {new Date(provider.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Prompts Section */}
      <div className="glass-card p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">Dynamic Prompts</h2>
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="glass rounded-lg p-4 cursor-pointer hover:bg-white/5"
              onClick={() => {
                setEditingPrompt(prompt)
                setShowPromptEditor(true)
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">{prompt.name}</h4>
                  <p className="text-sm text-white/60 mt-1">
                    {prompt.category} • {prompt.provider} • {prompt.model}
                  </p>
                  {prompt.tier && (
                    <span className="inline-block mt-2 text-xs glass rounded-full px-2 py-0.5 text-primary">
                      {prompt.tier} tier
                    </span>
                  )}
                </div>
                {prompt.isActive ? (
                  <span className="text-green-400 text-sm">Active</span>
                ) : (
                  <span className="text-white/50 text-sm">Inactive</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Editor Modal */}
      {showPromptEditor && (
        <PromptEditor
          prompt={editingPrompt}
          providers={providers}
          onSave={savePrompt}
          onClose={() => {
            setShowPromptEditor(false)
            setEditingPrompt(null)
          }}
        />
      )}

      {/* Provider Configuration Modal */}
      {selectedProvider && (
        <ProviderConfigModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onUpdate={(updated) => {
            setProviders(
              providers.map((p) => (p.id === updated.id ? updated : p))
            )
            setSelectedProvider(null)
          }}
        />
      )}
    </div>
  )
}

function ProviderSetupWizard({ onSave, onCancel }) {
  const [step, setStep] = useState(1)
  const [providerData, setProviderData] = useState({
    name: '',
    type: 'openai',
    api_key: '',
    config: {},
    is_active: true,
  })

  const selectedType = providerTypes.find((t) => t.value === providerData.type)

  return (
    <div>
      {step === 1 && (
        <div>
          <h4 className="text-white mb-4">Step 1: Select Provider Type</h4>
          <div className="grid grid-cols-2 gap-3">
            {providerTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => {
                  setProviderData({ ...providerData, type: type.value, name: type.label })
                  setStep(2)
                }}
                className={`glass rounded-lg p-4 text-left hover:bg-white/10 ${
                  providerData.type === type.value ? 'border-primary' : ''
                }`}
              >
                <h5 className="font-medium text-white">{type.label}</h5>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h4 className="text-white mb-4">Step 2: Configure {selectedType?.label}</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Provider Name
              </label>
              <input
                type="text"
                value={providerData.name}
                onChange={(e) => setProviderData({ ...providerData, name: e.target.value })}
                className="w-full glass rounded-lg px-4 py-2 text-white"
                placeholder={`e.g., ${selectedType?.label} Production`}
              />
            </div>

            {selectedType?.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  {field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
                <input
                  type="password"
                  value={providerData.config[field] || ''}
                  onChange={(e) =>
                    setProviderData({
                      ...providerData,
                      config: { ...providerData.config, [field]: e.target.value },
                    })
                  }
                  className="w-full glass rounded-lg px-4 py-2 text-white"
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onSave(providerData)}
                className="glass-button flex items-center gap-2"
              >
                <Save size={16} />
                Save Provider
              </button>
              <button
                onClick={onCancel}
                className="glass rounded-full px-4 py-2 text-white/70 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PromptEditor({ prompt, providers, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: prompt?.name || '',
    category: prompt?.category || 'general',
    provider: prompt?.provider || '',
    model: prompt?.model || '',
    prompt: prompt?.prompt || '',
    system_prompt: prompt?.systemPrompt || '',
    parameters: prompt?.parameters || { temperature: 0.7, max_tokens: 1000 },
    tier: prompt?.tier || null,
    is_active: prompt?.isActive ?? true,
  })

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">
          {prompt ? 'Edit Prompt' : 'Create New Prompt'}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Prompt Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white"
              placeholder="e.g., Growth Tier Conversation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white"
            >
              <option value="general">General</option>
              <option value="onboarding">Onboarding</option>
              <option value="therapy">Therapy</option>
              <option value="assessment">Assessment</option>
              <option value="exploration">Exploration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Provider
            </label>
            <select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white"
            >
              <option value="">Select provider</option>
              {providers.map((provider) => (
                <option key={provider.id} value={provider.name}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Model
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white"
              placeholder="e.g., gpt-4, claude-3"
            />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              System Prompt
            </label>
            <textarea
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white h-32"
              placeholder="System instructions for the AI..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              User Prompt Template
            </label>
            <textarea
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              className="w-full glass rounded-lg px-4 py-2 text-white h-32"
              placeholder="Use {{variables}} for dynamic content..."
            />
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_active" className="text-white/70">
              Active
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onSave({ ...prompt, ...formData })}
              className="glass-button flex items-center gap-2"
            >
              <Save size={16} />
              Save Prompt
            </button>
            <button
              onClick={onClose}
              className="glass rounded-full px-4 py-2 text-white/70 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProviderConfigModal({ provider, onClose, onUpdate }) {
  const [config, setConfig] = useState(provider.config || {})

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-2xl w-full p-6">
        <h3 className="text-2xl font-semibold text-white mb-6">
          Configure {provider.name}
        </h3>

        <div className="space-y-4">
          {/* Provider-specific configuration UI */}
          <p className="text-white/60">
            Advanced configuration options for {provider.type} provider.
          </p>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => onUpdate({ ...provider, config })}
              className="glass-button flex items-center gap-2"
            >
              <Save size={16} />
              Save Configuration
            </button>
            <button
              onClick={onClose}
              className="glass rounded-full px-4 py-2 text-white/70 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}