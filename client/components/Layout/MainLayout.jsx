import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useAppStore } from '../../lib/store';
import MobileNavigation from './MobileNavigation';
import Header from './Header';
import GlassMorphicBackground from '../UI/GlassMorphicBackground';

export default function MainLayout({ children }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { isMobileNavOpen, setMobileNavOpen } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isAuthPage = ['/login', '/signup', '/onboarding'].includes(location.pathname);
  const showMobileNav = isMobile && user && !isAuthPage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-newomen-primary via-newomen-secondary to-newomen-accent relative overflow-hidden">
      <GlassMorphicBackground />
      
      {!isAuthPage && <Header />}
      
      <main className={`relative z-10 ${!isAuthPage ? 'pt-16' : ''} ${showMobileNav ? 'pb-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {showMobileNav && <MobileNavigation />}
      
      {/* Glass overlay for mobile nav */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}