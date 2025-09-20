import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Camera, 
  Edit3, 
  Save, 
  Trophy, 
  Sparkles, 
  TrendingUp,
  Calendar,
  Heart,
  Brain,
  Users,
  Briefcase,
  Home,
  Target,
  Gem
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore, useAppStore } from '../../lib/store';
import { updateUserProfile } from '../../lib/supabase';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import GlassCard from '../UI/GlassCard';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuthStore();
  const { crystals, level, streak, progressData, achievements } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      nickname: profile?.nickname || '',
      cultural_background: profile?.cultural_background || '',
      preferred_language: profile?.preferred_language || 'en'
    }
  });

  const focusAreaIcons = {
    relationships: Heart,
    wellness: Sparkles,
    identity: Brain,
    family: Home,
    career: Briefcase,
    community: Users
  };

  const focusAreaLabels = {
    relationships: 'Relationships & Connection',
    wellness: 'Health & Wellness', 
    identity: 'Self-Esteem & Identity',
    family: 'Family Dynamics',
    career: 'Career & Development',
    community: 'Social & Community'
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (data.success) {
        updateProfile({ avatar_url: data.avatarUrl });
        toast.success('Profile picture updated!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      const { data, error } = await updateUserProfile(user.id, formData);
      
      if (error) {
        throw error;
      }

      updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981'; // green
    if (progress >= 60) return '#f59e0b'; // yellow
    if (progress >= 40) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const calculateOverallProgress = () => {
    const values = Object.values(progressData).filter(v => v > 0);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Your Profile
          </h1>
          <p className="text-xl text-white/80">
            Track your growth and customize your experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <GlassCard className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                </motion.button>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-newomen-primary to-newomen-secondary">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-newomen-primary hover:bg-newomen-secondary rounded-full flex items-center justify-center text-white transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </motion.button>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {profile?.full_name || 'User'}
                  </h3>
                  <p className="text-white/60 mb-2">@{profile?.nickname || 'username'}</p>
                  <div className="flex items-center space-x-4 text-sm text-white/70">
                    <span>Level {level}</span>
                    <span>•</span>
                    <span>{crystals} crystals</span>
                    <span>•</span>
                    <span>{streak} day streak</span>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Full Name</label>
                      <input
                        {...register('full_name', { required: 'Name is required' })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                      />
                      {errors.full_name && (
                        <p className="mt-1 text-red-400 text-sm">{errors.full_name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Nickname</label>
                      <input
                        {...register('nickname')}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Cultural Background</label>
                      <select
                        {...register('cultural_background')}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                      >
                        <option value="">Select background</option>
                        <option value="western">Western</option>
                        <option value="middle-eastern">Middle Eastern</option>
                        <option value="asian">Asian</option>
                        <option value="african">African</option>
                        <option value="latin-american">Latin American</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 font-medium mb-2">Preferred Language</label>
                      <select
                        {...register('preferred_language')}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </motion.button>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80">
                  <div>
                    <label className="text-white/60 text-sm">Email</label>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Cultural Background</label>
                    <p className="font-medium">{profile?.cultural_background || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Preferred Language</label>
                    <p className="font-medium">{profile?.preferred_language?.toUpperCase() || 'EN'}</p>
                  </div>
                  <div>
                    <label className="text-white/60 text-sm">Personality Type</label>
                    <p className="font-medium">{profile?.personality_type || 'Not assessed'}</p>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Progress Overview */}
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Growth Progress</h2>
              
              {/* Overall Progress */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24">
                  <CircularProgressbar
                    value={calculateOverallProgress()}
                    text={`${calculateOverallProgress()}%`}
                    styles={buildStyles({
                      textColor: 'white',
                      pathColor: '#9333ea',
                      trailColor: 'rgba(255, 255, 255, 0.1)',
                      textSize: '16px',
                    })}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Overall Progress</h3>
                  <p className="text-white/70">
                    You've explored {Object.values(progressData).filter(p => p > 0).length} out of {Object.keys(focusAreaLabels).length} focus areas
                  </p>
                </div>
              </div>

              {/* Individual Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(focusAreaLabels).map(([area, label]) => {
                  const Icon = focusAreaIcons[area];
                  const progress = progressData[area] || 0;
                  
                  return (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1">{label}</h4>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="bg-gradient-to-r from-newomen-primary to-newomen-secondary h-2 rounded-full"
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <p className="text-white/60 text-sm mt-1">{progress}% complete</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Recent Achievements */}
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Achievements</h2>
              
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.slice(0, 5).map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{achievement.name}</h4>
                        <p className="text-white/60 text-sm">{achievement.description}</p>
                      </div>
                      
                                    <div className="flex items-center space-x-1 text-newomen-crystal">
                <Gem className="w-4 h-4" />
                <span className="font-semibold">+{achievement.crystal_reward}</span>
              </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No achievements yet</p>
                  <p className="text-white/40 text-sm">Complete assessments and engage with the platform to earn achievements</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Level & Crystals */}
            <GlassCard className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Level {level}</h3>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Gem className="w-5 h-5 text-newomen-crystal" />
                <span className="text-xl font-semibold text-white">{crystals}</span>
                <span className="text-white/60">crystals</span>
              </div>
              
              {/* Progress to next level */}
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="bg-gradient-to-r from-newomen-crystal to-newomen-secondary h-2 rounded-full"
                  transition={{ duration: 1 }}
                />
              </div>
              <p className="text-white/60 text-sm">650/1000 XP to Level {level + 1}</p>
            </GlassCard>

            {/* Streak */}
            <GlassCard className="p-6 text-center">
              <Calendar className="w-12 h-12 text-newomen-accent mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Daily Streak</h3>
              <div className="text-3xl font-bold text-newomen-accent mb-2">{streak}</div>
              <p className="text-white/60 text-sm">days in a row</p>
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Minutes</span>
                  <span className="text-white font-semibold">{profile?.total_minutes_used || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Assessments</span>
                  <span className="text-white font-semibold">
                    {/* This will be calculated from assessment_results */}
                    5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Connections</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Member Since</span>
                  <span className="text-white font-semibold">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* Subscription Status */}
            <GlassCard className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                profile?.subscription_tier === 'discovery' ? 'bg-blue-500' :
                profile?.subscription_tier === 'growth' ? 'bg-green-500' :
                'bg-purple-500'
              }`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">
                {profile?.subscription_tier === 'discovery' ? 'Discovery' :
                 profile?.subscription_tier === 'growth' ? 'Growth' : 
                 'Transformation'} Tier
              </h3>
              
              <p className="text-white/60 text-sm mb-4">
                {profile?.subscription_tier === 'discovery' ? '10 minutes remaining' :
                 profile?.subscription_tier === 'growth' ? '85 minutes remaining' :
                 '950 minutes remaining'}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-medium hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
              >
                Upgrade Plan
              </motion.button>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}