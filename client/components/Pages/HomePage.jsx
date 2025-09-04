import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  Users, 
  Sparkles, 
  ArrowRight,
  Play,
  Star,
  Heart
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function HomePage() {
  const { user, profile } = useAuthStore();
  const [dailyAffirmation, setDailyAffirmation] = useState('');

  useEffect(() => {
    // Generate daily affirmation based on user profile
    if (user && profile) {
      generateDailyAffirmation();
    } else {
      setDailyAffirmation('Every journey begins with a single step. Today is your day to grow.');
    }
  }, [user, profile]);

  const generateDailyAffirmation = () => {
    const affirmations = [
      'You are the author of your own story. Write it beautifully.',
      'Your authentic self is your greatest strength.',
      'Growth happens outside your comfort zone. Embrace the journey.',
      'You have the power to transform your narrative.',
      'Every conversation with yourself matters.',
      'Your voice deserves to be heard and honored.',
      'Progress, not perfection, is the goal.',
      'You are worthy of the love and growth you seek.'
    ];
    
    const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    setDailyAffirmation(randomAffirmation);
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Conversations',
      description: 'Engage in meaningful, culturally-sensitive dialogues with NewMe, your AI companion.',
      color: 'from-newomen-primary to-newomen-secondary'
    },
    {
      icon: Brain,
      title: 'Narrative Identity',
      description: 'Explore and reshape your personal story through guided self-discovery.',
      color: 'from-newomen-secondary to-newomen-accent'
    },
    {
      icon: Users,
      title: 'Community Growth',
      description: 'Connect with like-minded women on similar transformation journeys.',
      color: 'from-newomen-accent to-newomen-primary'
    },
    {
      icon: Sparkles,
      title: 'Gamified Progress',
      description: 'Earn crystals, unlock achievements, and track your personal growth.',
      color: 'from-newomen-crystal to-newomen-secondary'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      text: 'Newomen helped me understand my story and rewrite it with confidence.',
      rating: 5
    },
    {
      name: 'Amira K.',
      text: 'The cultural sensitivity and emotional intelligence is remarkable.',
      rating: 5
    },
    {
      name: 'Lisa R.',
      text: 'I\'ve grown more in 3 months than I have in years of traditional therapy.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Daily Affirmation */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <GlassCard className="p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-newomen-crystal mr-2" />
                  <span className="text-white/80 font-medium">Today's Affirmation</span>
                </div>
                <p className="text-white text-lg font-light italic">
                  "{dailyAffirmation}"
                </p>
              </GlassCard>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
          >
            Welcome to{' '}
            <span className="bg-gradient-to-r from-newomen-crystal to-newomen-secondary bg-clip-text text-transparent">
              Newomen
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto font-light"
          >
            Your emotionally intelligent AI companion for personal growth, 
            narrative transformation, and culturally-sensitive conversations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {user ? (
              <>
                <Link to="/chat">
                  <GlassCard className="px-8 py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300">
                    <div className="flex items-center space-x-2 text-white font-semibold">
                      <MessageCircle className="w-5 h-5" />
                      <span>Start Conversation</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </GlassCard>
                </Link>
                <Link to="/assessments">
                  <GlassCard className="px-8 py-4 hover:bg-white/20">
                    <div className="flex items-center space-x-2 text-white font-medium">
                      <Brain className="w-5 h-5" />
                      <span>Take Assessment</span>
                    </div>
                  </GlassCard>
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <GlassCard className="px-8 py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300">
                    <div className="flex items-center space-x-2 text-white font-semibold">
                      <Sparkles className="w-5 h-5" />
                      <span>Begin Your Journey</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </GlassCard>
                </Link>
                <Link to="/assessments">
                  <GlassCard className="px-8 py-4 hover:bg-white/20">
                    <div className="flex items-center space-x-2 text-white font-medium">
                      <Play className="w-5 h-5" />
                      <span>Try Free Assessment</span>
                    </div>
                  </GlassCard>
                </Link>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Transform Your Story
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Discover the power of narrative identity exploration through AI-guided conversations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              Stories of Transformation
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-newomen-crystal fill-current" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <p className="text-white font-semibold">
                    {testimonial.name}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                Ready to Begin Your Transformation?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join thousands of women who are rewriting their stories with Newomen
              </p>
              {!user && (
                <Link to="/signup">
                  <GlassCard className="inline-block px-8 py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300">
                    <div className="flex items-center space-x-2 text-white font-semibold text-lg">
                      <Sparkles className="w-6 h-6" />
                      <span>Start Free Trial</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </GlassCard>
                </Link>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}