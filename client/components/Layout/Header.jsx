import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Settings, LogOut, Gem } from 'lucide-react';
import { useAuthStore, useAppStore } from '../../lib/store';
import { signOut } from '../../lib/supabase';
import GlassCard from '../UI/GlassCard';

export default function Header() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuthStore();
  const { crystals, setMobileNavOpen, isMobileNavOpen } = useAppStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await signOut();
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16">
      <GlassCard className="h-full rounded-none border-0 border-b border-white/10">
        <div className="flex items-center justify-between h-full px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">N</span>
            </motion.div>
            <span className="text-white font-display font-semibold text-xl">
              Newomen
            </span>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/chat" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Chat
              </Link>
              <Link 
                to="/assessments" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Assessments
              </Link>
              <Link 
                to="/community" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Community
              </Link>
              <Link 
                to="/resources" 
                className="text-white/80 hover:text-white transition-colors"
              >
                Resources
              </Link>
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Crystal Count */}
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-glass-white backdrop-blur-md rounded-full px-3 py-1"
              >
                <Gem className="w-4 h-4 text-newomen-crystal" />
                <span className="text-white font-semibold">{crystals}</span>
              </motion.div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-glass-white backdrop-blur-md rounded-full p-2"
                >
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-12 w-48"
                    >
                      <GlassCard className="py-2">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-white font-semibold">
                            {profile?.full_name || 'User'}
                          </p>
                          <p className="text-white/60 text-sm">{user.email}</p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </GlassCard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-glass-white backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileNavOpen(!isMobileNavOpen)}
                className="md:hidden bg-glass-white backdrop-blur-md rounded-full p-2"
              >
                {isMobileNavOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </GlassCard>
    </header>
  );
}