import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Heart, 
  Users, 
  Briefcase, 
  Home, 
  Sparkles, 
  Play, 
  Lock,
  Trophy,
  Target,
  TrendingUp,
  Gem
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../../lib/store';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import GlassCard from '../UI/GlassCard';

export default function AssessmentsPage() {
  const { user, profile } = useAuthStore();
  const { crystals, progressData, updateProgress, updateCrystals } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const assessmentCategories = [
    { id: 'all', label: 'All Assessments', icon: Brain },
    { id: 'personality', label: 'Personality', icon: Heart },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'wellness', label: 'Wellness', icon: Sparkles },
    { id: 'family', label: 'Family', icon: Home }
  ];

  const freeAssessments = [
    {
      id: 'personality-quick',
      title: 'Quick Personality Insight',
      description: 'Discover your core personality traits in 5 minutes',
      duration: '5 min',
      category: 'personality',
      crystalReward: 50,
      isFree: true,
      icon: Brain,
      color: 'from-purple-400 to-indigo-400'
    },
    {
      id: 'relationship-style',
      title: 'Relationship Style Assessment',
      description: 'Understand how you connect with others',
      duration: '7 min',
      category: 'relationships', 
      crystalReward: 75,
      isFree: true,
      icon: Heart,
      color: 'from-red-400 to-pink-400'
    },
    {
      id: 'stress-management',
      title: 'Stress Management Style',
      description: 'Learn your natural stress response patterns',
      duration: '6 min',
      category: 'wellness',
      crystalReward: 60,
      isFree: true,
      icon: Sparkles,
      color: 'from-green-400 to-emerald-400'
    },
    {
      id: 'communication-style',
      title: 'Communication Preferences',
      description: 'Discover your unique communication style',
      duration: '8 min',
      category: 'relationships',
      crystalReward: 80,
      isFree: true,
      icon: Users,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'goal-setting',
      title: 'Goal Achievement Style',
      description: 'Understand how you best achieve your goals',
      duration: '10 min',
      category: 'career',
      crystalReward: 100,
      isFree: true,
      icon: Target,
      color: 'from-orange-400 to-yellow-400'
    }
  ];

  const premiumAssessments = [
    {
      id: 'narrative-identity-deep',
      title: 'Deep Narrative Identity Exploration',
      description: 'Comprehensive exploration of your personal story and identity patterns',
      duration: '25 min',
      category: 'personality',
      crystalReward: 200,
      isFree: false,
      requiredLevel: 2,
      icon: Brain,
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'attachment-style-advanced',
      title: 'Advanced Attachment Style Analysis',
      description: 'Deep dive into your attachment patterns and relationship dynamics',
      duration: '20 min',
      category: 'relationships',
      crystalReward: 180,
      isFree: false,
      requiredLevel: 3,
      icon: Heart,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: 'career-alignment',
      title: 'Career & Purpose Alignment',
      description: 'Discover your ideal career path and life purpose alignment',
      duration: '30 min',
      category: 'career',
      crystalReward: 250,
      isFree: false,
      requiredLevel: 4,
      icon: Briefcase,
      color: 'from-blue-500 to-cyan-600'
    }
  ];

  const allAssessments = [...freeAssessments, ...premiumAssessments];

  const filteredAssessments = selectedCategory === 'all' 
    ? allAssessments 
    : allAssessments.filter(a => a.category === selectedCategory);

  const balanceWheelData = [
    { area: 'Relationships', progress: progressData.relationships || 0, color: '#ef4444' },
    { area: 'Wellness', progress: progressData.wellness || 0, color: '#10b981' },
    { area: 'Identity', progress: progressData.identity || 0, color: '#8b5cf6' },
    { area: 'Family', progress: progressData.family || 0, color: '#f59e0b' },
    { area: 'Career', progress: progressData.career || 0, color: '#06b6d4' },
    { area: 'Community', progress: progressData.community || 0, color: '#84cc16' }
  ];

  const startAssessment = (assessment) => {
    if (!assessment.isFree && !user) {
      toast.error('Please sign up to access premium assessments');
      return;
    }
    
    if (!assessment.isFree && profile?.level < assessment.requiredLevel) {
      toast.error(`Level ${assessment.requiredLevel} required for this assessment`);
      return;
    }

    // Navigate to assessment
    // This will be implemented with the assessment engine
    toast.success(`Starting ${assessment.title}...`);
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Assessments & Growth
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Discover insights about yourself through our scientifically-backed assessments
          </p>
        </motion.div>

        {/* Balance Wheel - Only for logged in users */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Your Growth Balance Wheel
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {balanceWheelData.map((item, index) => (
                  <motion.div
                    key={item.area}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-3">
                      <CircularProgressbar
                        value={item.progress}
                        text={`${item.progress}%`}
                        styles={buildStyles({
                          textColor: 'white',
                          pathColor: item.color,
                          trailColor: 'rgba(255, 255, 255, 0.1)',
                          textSize: '16px',
                        })}
                      />
                    </div>
                    <p className="text-white/80 text-sm font-medium">
                      {item.area}
                    </p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Complete assessments to track your progress in each area
                </p>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <GlassCard className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {assessmentCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                      selectedCategory === category.id
                        ? 'bg-newomen-primary text-white'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Free Assessments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-newomen-crystal" />
            Free Assessments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeAssessments.filter(a => selectedCategory === 'all' || a.category === selectedCategory).map((assessment, index) => {
              const Icon = assessment.icon;
              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${assessment.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 text-center">
                      {assessment.title}
                    </h3>
                    
                    <p className="text-white/70 text-center mb-4 leading-relaxed">
                      {assessment.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 text-sm">{assessment.duration}</span>
                      <div className="flex items-center space-x-1 text-newomen-crystal">
                        <Gem className="w-4 h-4" />
                        <span className="font-semibold">+{assessment.crystalReward}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startAssessment(assessment)}
                      className="w-full py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Play className="w-4 h-4" />
                        <span>Start Assessment</span>
                      </div>
                    </motion.button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Premium Assessments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-newomen-crystal" />
            Premium Assessments
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumAssessments.filter(a => selectedCategory === 'all' || a.category === selectedCategory).map((assessment, index) => {
              const Icon = assessment.icon;
              const isLocked = !user || (profile?.level || 1) < assessment.requiredLevel;
              
              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className={`p-6 h-full relative ${isLocked ? 'opacity-75' : ''}`}>
                    {isLocked && (
                      <div className="absolute top-4 right-4">
                        <Lock className="w-5 h-5 text-white/60" />
                      </div>
                    )}
                    
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${assessment.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-3 text-center">
                      {assessment.title}
                    </h3>
                    
                    <p className="text-white/70 text-center mb-4 leading-relaxed">
                      {assessment.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/60 text-sm">{assessment.duration}</span>
                      <div className="flex items-center space-x-1 text-newomen-crystal">
                        <Gem className="w-4 h-4" />
                        <span className="font-semibold">+{assessment.crystalReward}</span>
                      </div>
                    </div>
                    
                    {isLocked && (
                      <div className="mb-4 text-center">
                        <span className="text-white/60 text-sm">
                          Level {assessment.requiredLevel} required
                        </span>
                      </div>
                    )}
                    
                    <motion.button
                      whileHover={!isLocked ? { scale: 1.02 } : {}}
                      whileTap={!isLocked ? { scale: 0.98 } : {}}
                      onClick={() => !isLocked && startAssessment(assessment)}
                      disabled={isLocked}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isLocked
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : 'bg-gradient-to-r from-newomen-primary to-newomen-secondary text-white hover:from-newomen-secondary hover:to-newomen-primary'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Locked</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Start Assessment</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Progress Overview - Only for logged in users */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-newomen-crystal" />
              Your Progress Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 text-center">
                <div className="text-3xl font-bold text-newomen-crystal mb-2">
                  {crystals}
                </div>
                <div className="text-white/80">Total Crystals</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center">
                <div className="text-3xl font-bold text-newomen-secondary mb-2">
                  {profile?.level || 1}
                </div>
                <div className="text-white/80">Current Level</div>
              </GlassCard>
              
              <GlassCard className="p-6 text-center">
                <div className="text-3xl font-bold text-newomen-accent mb-2">
                  {Object.values(progressData).filter(p => p > 0).length}
                </div>
                <div className="text-white/80">Areas Explored</div>
              </GlassCard>
            </div>
          </motion.div>
        )}

        {/* Call to Action for Non-Users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <GlassCard className="p-8 text-center">
              <Sparkles className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready for Deeper Growth?
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Sign up to access premium assessments, track your progress, and unlock your full potential
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold text-lg hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
              >
                Join Newomen Today
              </motion.button>
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}