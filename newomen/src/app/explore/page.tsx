'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, Heart, Users, Sparkles, Clock, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import type { Assessment } from '@/types'

const assessmentIcons = {
  personality: Brain,
  diagnostic: Heart,
  compatibility: Users,
  exploration: Sparkles,
}

export default function ExplorePage() {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all')
  const { user, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadAssessments()
  }, [])

  const loadAssessments = async () => {
    const query = supabase
      .from('assessments')
      .select('*')
      .eq('is_active', true)
      .order('is_free', { ascending: false })
      .order('crystal_reward', { ascending: false })

    const { data } = await query

    if (data) {
      setAssessments(data)
    }
    setLoading(false)
  }

  const startAssessment = (assessment: Assessment) => {
    if (!assessment.isFree && !user) {
      router.push('/auth/signin?redirect=/explore')
      return
    }

    router.push(`/assessment/${assessment.id}`)
  }

  const filteredAssessments = assessments.filter((assessment) => {
    if (filter === 'free') return assessment.isFree
    if (filter === 'premium') return !assessment.isFree
    return true
  })

  const groupedAssessments = filteredAssessments.reduce((acc, assessment) => {
    const category = assessment.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(assessment)
    return acc
  }, {} as Record<string, Assessment[]>)

  return (
    <div className="min-h-screen px-4 py-8 pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Explore Your <span className="gradient-text">Inner World</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover insights about yourself through our scientifically-designed assessments
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {['all', 'free', 'premium'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption as any)}
              className={`px-6 py-2 rounded-full transition-all ${
                filter === filterOption
                  ? 'glass-button text-white'
                  : 'glass text-white/70 hover:text-white'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* User Stats */}
        {user && profile && (
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Your Progress</h3>
                <p className="text-white/60">
                  Level {profile.level} • {profile.crystals} crystals • {profile.experiencePoints} XP
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">
                    {profile.user_assessments?.length || 0}
                  </div>
                  <div className="text-xs text-white/60">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">
                    {profile.currentStreak}
                  </div>
                  <div className="text-xs text-white/60">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessments by Category */}
        {loading ? (
          <div className="text-center text-white/60">Loading assessments...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedAssessments).map(([category, categoryAssessments]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryAssessments.map((assessment) => {
                    const Icon = assessmentIcons[assessment.type] || Brain
                    
                    return (
                      <div
                        key={assessment.id}
                        className="glass-card p-6 hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => startAssessment(assessment)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {assessment.isFree ? (
                            <span className="glass rounded-full px-3 py-1 text-xs text-green-400">
                              FREE
                            </span>
                          ) : (
                            <span className="glass rounded-full px-3 py-1 text-xs text-yellow-400">
                              PREMIUM
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold text-white mb-2">
                          {assessment.title}
                        </h3>
                        
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">
                          {assessment.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm">
                          {assessment.durationMinutes && (
                            <div className="flex items-center gap-1 text-white/60">
                              <Clock size={14} />
                              <span>{assessment.durationMinutes} min</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Award size={14} />
                            <span>+{assessment.crystalReward} crystals</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No assessments found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}