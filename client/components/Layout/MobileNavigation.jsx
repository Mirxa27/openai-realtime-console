import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  ClipboardList, 
  Users, 
  BookOpen, 
  User 
} from 'lucide-react';
import GlassCard from '../UI/GlassCard';

export default function MobileNavigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/assessments', icon: ClipboardList, label: 'Tests' },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/resources', icon: BookOpen, label: 'Resources' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
    >
      <GlassCard className="rounded-2xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-colors relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-newomen-primary text-white' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-newomen-primary rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </GlassCard>
    </motion.div>
  );
}