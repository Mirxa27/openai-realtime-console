import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Download, 
  BookOpen, 
  Headphones, 
  Clock,
  Heart,
  Brain,
  Sparkles,
  Filter
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function ResourcesPage() {
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  const categories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'breathing', label: 'Breathing Practices', icon: Heart },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'affirmations', label: 'Affirmations', icon: Sparkles },
    { id: 'sleep', label: 'Sleep Stories', icon: Clock }
  ];

  const breathingPractices = [
    {
      id: 'calm-breathing',
      title: '4-7-8 Calming Breath',
      description: 'Perfect for anxiety relief and relaxation',
      duration: '5 min',
      category: 'breathing',
      difficulty: 'Beginner',
      audioUrl: '/audio/calm-breathing.mp3',
      isFree: true,
      benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system']
    },
    {
      id: 'energy-boost',
      title: 'Energizing Breath Work',
      description: 'Boost your energy and mental clarity',
      duration: '8 min',
      category: 'breathing',
      difficulty: 'Intermediate',
      audioUrl: '/audio/energy-boost.mp3',
      isFree: true,
      benefits: ['Increases energy', 'Enhances focus', 'Improves mood']
    },
    {
      id: 'box-breathing',
      title: 'Box Breathing for Focus',
      description: 'Military-grade technique for concentration',
      duration: '10 min',
      category: 'breathing',
      difficulty: 'Beginner',
      audioUrl: '/audio/box-breathing.mp3',
      isFree: true,
      benefits: ['Improves focus', 'Reduces stress', 'Enhances performance']
    }
  ];

  const meditations = [
    {
      id: 'body-scan',
      title: 'Progressive Body Scan',
      description: 'Release tension and connect with your body',
      duration: '15 min',
      category: 'meditation',
      difficulty: 'Beginner',
      audioUrl: '/audio/body-scan.mp3',
      isFree: false,
      benefits: ['Body awareness', 'Stress relief', 'Better sleep']
    },
    {
      id: 'loving-kindness',
      title: 'Loving-Kindness Meditation',
      description: 'Cultivate compassion for yourself and others',
      duration: '20 min',
      category: 'meditation',
      difficulty: 'Intermediate',
      audioUrl: '/audio/loving-kindness.mp3',
      isFree: false,
      benefits: ['Self-compassion', 'Emotional healing', 'Relationship improvement']
    }
  ];

  const affirmations = [
    {
      id: 'daily-affirmations',
      title: 'Daily Empowerment Affirmations',
      description: 'Start your day with powerful self-affirmations',
      duration: '12 min',
      category: 'affirmations',
      difficulty: 'Beginner',
      audioUrl: '/audio/daily-affirmations.mp3',
      isFree: true,
      benefits: ['Boosts confidence', 'Positive mindset', 'Self-love']
    }
  ];

  const allResources = [...breathingPractices, ...meditations, ...affirmations];
  
  const filteredResources = selectedCategory === 'all' 
    ? allResources 
    : allResources.filter(r => r.category === selectedCategory);

  const togglePlay = (resourceId) => {
    if (currentlyPlaying === resourceId) {
      setCurrentlyPlaying(null);
      // Stop audio
    } else {
      setCurrentlyPlaying(resourceId);
      // Start audio
    }
  };

  const downloadResource = (resource) => {
    // Implement download functionality
    toast.success(`Downloading ${resource.title}...`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-400';
      case 'Intermediate':
        return 'text-yellow-400';
      case 'Advanced':
        return 'text-red-400';
      default:
        return 'text-white/60';
    }
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
            Wellness Resources
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Guided practices, meditations, and tools to support your journey
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => {
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

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredResources.map((resource, index) => {
            const isPlaying = currentlyPlaying === resource.id;
            const canAccess = resource.isFree || user;
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className={`p-6 h-full ${!canAccess ? 'opacity-75' : ''}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-white/70 text-sm mb-3 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                    
                    {!resource.isFree && (
                      <div className="ml-2">
                        <span className="px-2 py-1 bg-newomen-crystal/20 text-newomen-crystal rounded-full text-xs font-medium">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div className="flex items-center space-x-4 text-white/60">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getDifficultyColor(resource.difficulty)}`}>
                        <Filter className="w-4 h-4" />
                        <span>{resource.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="text-white/80 font-medium mb-2 text-sm">Benefits:</h4>
                    <div className="flex flex-wrap gap-1">
                      {resource.benefits.map((benefit, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-white/10 text-white/70 rounded-full text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={canAccess ? { scale: 1.02 } : {}}
                      whileTap={canAccess ? { scale: 0.98 } : {}}
                      onClick={() => canAccess && togglePlay(resource.id)}
                      disabled={!canAccess}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        !canAccess
                          ? 'bg-white/10 text-white/50 cursor-not-allowed'
                          : isPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-gradient-to-r from-newomen-primary to-newomen-secondary text-white hover:from-newomen-secondary hover:to-newomen-primary'
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                        <span>{isPlaying ? 'Pause' : 'Play'}</span>
                      </div>
                    </motion.button>

                    {canAccess && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => downloadResource(resource)}
                        className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  {/* Lock Message */}
                  {!canAccess && (
                    <div className="mt-3 text-center">
                      <p className="text-white/60 text-sm">
                        Sign up to access this resource
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Audio Player - Global */}
        {currentlyPlaying && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 z-40"
          >
            <GlassCard className="p-4">
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePlay(currentlyPlaying)}
                  className="p-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-full text-white"
                >
                  <Pause className="w-5 h-5" />
                </motion.button>
                
                <div className="flex-1">
                  <h4 className="text-white font-semibold">
                    {allResources.find(r => r.id === currentlyPlaying)?.title}
                  </h4>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="bg-gradient-to-r from-newomen-primary to-newomen-secondary h-2 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-white/60">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm">2:15 / 5:00</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Call to Action for Non-Users */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <GlassCard className="p-8 text-center">
              <Sparkles className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Unlock Your Full Wellness Library
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Access premium guided meditations, advanced breathing techniques, and personalized content
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