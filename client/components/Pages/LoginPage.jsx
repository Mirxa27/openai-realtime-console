import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../lib/store';
import { signIn, getUserProfile } from '../../lib/supabase';
import GlassCard from '../UI/GlassCard';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setProfile } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch user profile
        const { data: profile, error: profileError } = await getUserProfile(data.user.id);
        if (profile && !profileError) {
          setProfile(profile);
          
          // Navigate based on onboarding status
          if (!profile.onboarding_completed) {
            navigate('/onboarding');
          } else {
            navigate('/chat');
          }
        } else {
          navigate('/onboarding');
        }
        
        toast.success('Welcome back to Newomen!');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-2xl flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-white/80">
              Continue your journey of growth and transformation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-white/80 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/60">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-newomen-crystal hover:text-newomen-secondary transition-colors font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Forgot Password */}
          <div className="mt-4 text-center">
            <button className="text-white/60 hover:text-white transition-colors text-sm">
              Forgot your password?
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}