'use client'

import { useState, useEffect } from 'react'
import { Save, Plus, Trash2, Eye, EyeOff, RefreshCw, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/toaster'
import type { EnvironmentVariable } from '@/types'

const categories = [
  { value: 'database', label: 'Database' },
  { value: 'ai_providers', label: 'AI Providers' },
  { value: 'payments', label: 'Payments' },
  { value: 'email', label: 'Email' },
  { value: 'site_branding', label: 'Site Branding' },
  { value: 'other', label: 'Other Services' },
]

export default function EnvironmentPage() {
  const [variables, setVariables] = useState<EnvironmentVariable[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSecrets, setShowSecrets] = useState<Set<string>>(new Set())
  const [newVariable, setNewVariable] = useState({
    key: '',
    value: '',
    category: 'other',
    description: '',
    isSecret: true,
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadVariables()
  }, [])

  const loadVariables = async () => {
    const { data, error } = await supabase
      .from('environment_variables')
      .select('*')
      .order('category', { ascending: true })
      .order('key', { ascending: true })

    if (data) {
      setVariables(data)
    }
    setLoading(false)
  }

  const saveVariable = async (variable: EnvironmentVariable) => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('environment_variables')
        .upsert({
          id: variable.id,
          key: variable.key,
          value: variable.value,
          category: variable.category,
          description: variable.description,
          is_secret: variable.isSecret,
        })

      if (error) throw error

      toast({
        title: 'Environment variable saved',
        type: 'success',
      })

      // Apply to Vercel if configured
      await applyToVercel(variable)
    } catch (error) {
      toast({
        title: 'Failed to save variable',
        description: error.message,
        type: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const deleteVariable = async (id: string) => {
    if (!confirm('Are you sure you want to delete this variable?')) return

    const { error } = await supabase
      .from('environment_variables')
      .delete()
      .eq('id', id)

    if (!error) {
      setVariables(variables.filter((v) => v.id !== id))
      toast({
        title: 'Variable deleted',
        type: 'success',
      })
    }
  }

  const addVariable = async () => {
    if (!newVariable.key) return

    const { data, error } = await supabase
      .from('environment_variables')
      .insert({
        key: newVariable.key,
        value: newVariable.value,
        category: newVariable.category,
        description: newVariable.description,
        is_secret: newVariable.isSecret,
      })
      .select()
      .single()

    if (data) {
      setVariables([...variables, data])
      setNewVariable({
        key: '',
        value: '',
        category: 'other',
        description: '',
        isSecret: true,
      })
      setShowAddForm(false)
      toast({
        title: 'Variable added',
        type: 'success',
      })
    }
  }

  const applyToVercel = async (variable: EnvironmentVariable) => {
    // This would integrate with Vercel API
    // For now, we'll just show a message
    console.log('Applying to Vercel:', variable.key)
  }

  const toggleSecret = (id: string) => {
    const newSet = new Set(showSecrets)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setShowSecrets(newSet)
  }

  const updateVariable = (id: string, updates: Partial<EnvironmentVariable>) => {
    setVariables(
      variables.map((v) => (v.id === id ? { ...v, ...updates } : v))
    )
  }

  const groupedVariables = categories.map((category) => ({
    ...category,
    variables: variables.filter((v) => v.category === category.value),
  }))

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Environment Settings</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="glass-button flex items-center gap-2"
        >
          <Plus size={20} />
          Add Variable
        </button>
      </div>

      <div className="glass-card p-6 mb-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-white mb-1">Important Security Notice</h3>
            <p className="text-white/70 text-sm">
              Environment variables contain sensitive information. Changes here will be applied to your production environment.
              Always use secure values and never expose secrets in client-side code.
            </p>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">Add New Variable</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Key
              </label>
              <input
                type="text"
                value={newVariable.key}
                onChange={(e) => setNewVariable({ ...newVariable, key: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_') })}
                className="w-full glass rounded-lg px-4 py-2 text-white"
                placeholder="VARIABLE_NAME"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category
              </label>
              <select
                value={newVariable.category}
                onChange={(e) => setNewVariable({ ...newVariable, category: e.target.value })}
                className="w-full glass rounded-lg px-4 py-2 text-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Value
              </label>
              <input
                type={newVariable.isSecret ? 'password' : 'text'}
                value={newVariable.value}
                onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                className="w-full glass rounded-lg px-4 py-2 text-white"
                placeholder="Value"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description
              </label>
              <input
                type="text"
                value={newVariable.description}
                onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                className="w-full glass rounded-lg px-4 py-2 text-white"
                placeholder="Brief description of this variable"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isSecret"
                checked={newVariable.isSecret}
                onChange={(e) => setNewVariable({ ...newVariable, isSecret: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isSecret" className="text-white/70">
                This is a secret value
              </label>
            </div>
            <div className="col-span-2 flex gap-2">
              <button
                onClick={addVariable}
                className="glass-button flex items-center gap-2"
              >
                <Save size={16} />
                Add Variable
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="glass rounded-full px-4 py-2 text-white/70 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {groupedVariables.map((group) => (
          <div key={group.value} className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              {group.label}
              <span className="text-sm text-white/50">({group.variables.length})</span>
            </h2>
            
            {group.variables.length === 0 ? (
              <p className="text-white/50">No variables in this category</p>
            ) : (
              <div className="space-y-3">
                {group.variables.map((variable) => (
                  <div key={variable.id} className="glass rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="font-mono text-sm text-primary">
                            {variable.key}
                          </code>
                          {variable.isSecret && (
                            <span className="text-xs glass rounded-full px-2 py-0.5 text-yellow-400">
                              Secret
                            </span>
                          )}
                        </div>
                        {variable.description && (
                          <p className="text-sm text-white/60 mb-2">{variable.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type={variable.isSecret && !showSecrets.has(variable.id) ? 'password' : 'text'}
                            value={variable.value || ''}
                            onChange={(e) => updateVariable(variable.id, { value: e.target.value })}
                            className="flex-1 glass rounded px-3 py-1 text-sm text-white"
                          />
                          {variable.isSecret && (
                            <button
                              onClick={() => toggleSecret(variable.id)}
                              className="text-white/50 hover:text-white"
                            >
                              {showSecrets.has(variable.id) ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          )}
                          <button
                            onClick={() => saveVariable(variable)}
                            disabled={saving}
                            className="glass-button px-3 py-1 text-sm"
                          >
                            <Save size={14} />
                          </button>
                          <button
                            onClick={() => deleteVariable(variable.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-4">
        <button className="glass-button flex items-center gap-2">
          <RefreshCw size={20} />
          Sync with Vercel
        </button>
        <button className="glass rounded-full px-6 py-3 text-white/70 hover:text-white">
          Create Snapshot
        </button>
      </div>
    </div>
  )
}