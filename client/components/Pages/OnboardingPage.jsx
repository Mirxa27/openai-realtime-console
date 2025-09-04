import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Globe, 
  Heart, 
  Brain, 
  Users, 
  Briefcase, 
  Home,
  Sparkles,
  Check
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore, useAppStore } from '../../lib/store';
import { updateUserProfile } from '../../lib/supabase';
import GlassCard from '../UI/GlassCard';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuthStore();
  const { updateCrystals } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const steps = [
    'Language & Culture',
    'Personality Assessment', 
    'Focus Areas',
    'Diagnostic Assessment',
    'Welcome'
  ];

  const focusAreas = [
    { id: 'relationships', label: 'Relationships & Connection', icon: Heart, color: 'from-red-400 to-pink-400' },
    { id: 'wellness', label: 'Health & Wellness', icon: Sparkles, color: 'from-green-400 to-emerald-400' },
    { id: 'identity', label: 'Self-Esteem & Identity', icon: Brain, color: 'from-purple-400 to-indigo-400' },
    { id: 'family', label: 'Family Dynamics', icon: Home, color: 'from-orange-400 to-red-400' },
    { id: 'career', label: 'Career & Development', icon: Briefcase, color: 'from-blue-400 to-cyan-400' },
    { id: 'community', label: 'Social & Community', icon: Users, color: 'from-teal-400 to-green-400' }
  ];

  const personalityQuestions = [
    {
      question: "When facing a challenge, I typically:",
      options: [
        { value: 'analytical', label: 'Analyze the situation methodically' },
        { value: 'intuitive', label: 'Trust my gut feelings' },
        { value: 'collaborative', label: 'Seek advice from others' },
        { value: 'action-oriented', label: 'Jump in and figure it out' }
      ]
    },
    {
      question: "In relationships, I value most:",
      options: [
        { value: 'deep-connection', label: 'Deep emotional connection' },
        { value: 'independence', label: 'Maintaining my independence' },
        { value: 'support', label: 'Mutual support and growth' },
        { value: 'adventure', label: 'Shared adventures and experiences' }
      ]
    },
    {
      question: "My ideal personal growth involves:",
      options: [
        { value: 'structured', label: 'Structured, step-by-step progress' },
        { value: 'organic', label: 'Organic, natural development' },
        { value: 'guided', label: 'Expert guidance and support' },
        { value: 'self-directed', label: 'Self-directed exploration' }
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      const completedProfile = {
        ...profile,
        ...onboardingData,
        onboarding_completed: true,
        crystals: (profile?.crystals || 0) + 200 // Completion bonus
      };

      const { data, error } = await updateUserProfile(user.id, completedProfile);
      
      if (error) {
        throw error;
      }

      setProfile(data);
      updateCrystals(200);
      toast.success('Onboarding completed! +200 crystals earned!');
      navigate('/chat');
    } catch (error) {
      console.error('Onboarding completion error:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const updateOnboardingData = (stepData) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Language & Cultural Preferences
              </h2>
              <p className="text-white/80">
                Help us personalize your experience
              </p>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-3">
                Preferred Language
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'en', label: 'English' },
                  { value: 'ar', label: 'العربية' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' }
                ].map((lang) => (
                  <motion.button
                    key={lang.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateOnboardingData({ preferred_language: lang.value })}
                    className={`p-3 rounded-xl border transition-all ${
                      onboardingData.preferred_language === lang.value
                        ? 'bg-newomen-primary border-newomen-primary text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {lang.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-3">
                Cultural Background
              </label>
              <select
                onChange={(e) => updateOnboardingData({ cultural_background: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              >
                <option value="">Select your background</option>
                <option value="western">Western</option>
                <option value="middle-eastern">Middle Eastern</option>
                <option value="asian">Asian</option>
                <option value="african">African</option>
                <option value="latin-american">Latin American</option>
                <option value="other">Other</option>
              </select>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Personality Assessment
              </h2>
              <p className="text-white/80">
                Help us understand your unique approach to growth
              </p>
            </div>

            {personalityQuestions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-3">
                <h3 className="text-white font-medium">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => updateOnboardingData({ 
                        [`personality_q${qIndex}`]: option.value,
                        personality_type: calculatePersonalityType() 
                      })}
                      className={`w-full p-3 text-left rounded-xl border transition-all ${
                        onboardingData[`personality_q${qIndex}`] === option.value
                          ? 'bg-newomen-primary border-newomen-primary text-white'
                          : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Sparkles className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Choose Your Focus Areas
              </h2>
              <p className="text-white/80">
                Select up to 3 areas you'd like to focus on
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {focusAreas.map((area) => {
                const Icon = area.icon;
                const isSelected = onboardingData.focus_areas?.includes(area.id);
                const canSelect = !onboardingData.focus_areas || onboardingData.focus_areas.length < 3;
                
                return (
                  <motion.button
                    key={area.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      const currentAreas = onboardingData.focus_areas || [];
                      let newAreas;
                      
                      if (isSelected) {
                        newAreas = currentAreas.filter(id => id !== area.id);
                      } else if (canSelect || isSelected) {
                        newAreas = [...currentAreas, area.id];
                      } else {
                        return; // Can't select more than 3
                      }
                      
                      updateOnboardingData({ focus_areas: newAreas });
                    }}
                    disabled={!canSelect && !isSelected}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? 'bg-newomen-primary border-newomen-primary text-white'
                        : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                    } ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${area.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{area.label}</h3>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-white ml-auto" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-center text-white/60 text-sm">
              Selected: {onboardingData.focus_areas?.length || 0}/3 areas
            </p>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Brain className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Quick Diagnostic
              </h2>
              <p className="text-white/80">
                Help us understand where to focus first
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-3">
                  On a scale of 1-10, how satisfied are you currently with:
                </h3>
                
                {(onboardingData.focus_areas || []).map((areaId) => {
                  const area = focusAreas.find(a => a.id === areaId);
                  if (!area) return null;
                  
                  return (
                    <div key={areaId} className="space-y-2">
                      <label className="block text-white/80 text-sm">
                        {area.label}
                      </label>
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <motion.button
                            key={num}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateOnboardingData({ 
                              [`${areaId}_satisfaction`]: num 
                            })}
                            className={`w-8 h-8 rounded-full border transition-all ${
                              onboardingData[`${areaId}_satisfaction`] === num
                                ? 'bg-newomen-primary border-newomen-primary text-white'
                                : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                            }`}
                          >
                            {num}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-newomen-primary to-newomen-crystal rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white mb-4">
              Welcome to Your Journey!
            </h2>
            
            <GlassCard className="p-6 text-left max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Your Personal Growth Profile:
              </h3>
              <div className="space-y-3 text-white/80">
                <div>
                  <strong>Language:</strong> {onboardingData.preferred_language?.toUpperCase() || 'English'}
                </div>
                <div>
                  <strong>Cultural Background:</strong> {onboardingData.cultural_background || 'General'}
                </div>
                <div>
                  <strong>Personality Type:</strong> {onboardingData.personality_type || 'Balanced'}
                </div>
                <div>
                  <strong>Focus Areas:</strong> {onboardingData.focus_areas?.length || 0} selected
                </div>
              </div>
            </GlassCard>

            <div className="flex items-center justify-center space-x-2 text-newomen-crystal">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">+300 Welcome Crystals Earned!</span>
              <Sparkles className="w-5 h-5" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={completeOnboarding}
              className="w-full py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold text-lg hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
            >
              Start My Transformation Journey
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const calculatePersonalityType = () => {
    // Simple personality type calculation based on responses
    const responses = [
      onboardingData.personality_q0,
      onboardingData.personality_q1,
      onboardingData.personality_q2
    ].filter(Boolean);

    if (responses.length < 3) return 'Balanced';

    const types = {
      'analytical': 'Analytical Thinker',
      'intuitive': 'Intuitive Explorer', 
      'collaborative': 'Collaborative Connector',
      'action-oriented': 'Action-Oriented Achiever',
      'deep-connection': 'Deep Connector',
      'independence': 'Independent Spirit',
      'support': 'Supportive Partner',
      'adventure': 'Adventure Seeker',
      'structured': 'Structured Planner',
      'organic': 'Organic Grower',
      'guided': 'Guided Learner',
      'self-directed': 'Self-Directed Explorer'
    };

    // Find most common type pattern
    const mostCommon = responses.reduce((acc, response) => {
      acc[response] = (acc[response] || 0) + 1;
      return acc;
    }, {});

    const topType = Object.keys(mostCommon).reduce((a, b) => 
      mostCommon[a] > mostCommon[b] ? a : b
    );

    return types[topType] || 'Balanced Explorer';
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return onboardingData.preferred_language && onboardingData.cultural_background;
      case 1:
        return personalityQuestions.every((_, i) => onboardingData[`personality_q${i}`]);
      case 2:
        return onboardingData.focus_areas && onboardingData.focus_areas.length > 0;
      case 3:
        return (onboardingData.focus_areas || []).every(area => 
          onboardingData[`${area}_satisfaction`]
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-white">
                Getting Started
              </h1>
              <span className="text-white/60 text-sm">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className={`h-2 rounded-full flex-1 transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-gradient-to-r from-newomen-primary to-newomen-secondary' 
                      : 'bg-white/20'
                  }`} />
                  {index < steps.length - 1 && (
                    <div className="w-2" />
                  )}
                </div>
              ))}
            </div>
            
            <p className="text-center text-white/60 text-sm mt-2">
              {steps[currentStep]}
            </p>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          {currentStep < steps.length - 1 && (
            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}