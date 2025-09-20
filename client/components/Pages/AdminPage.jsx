import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Database, 
  Brain, 
  CreditCard, 
  Mail, 
  Image, 
  Users, 
  BarChart3,
  Key,
  Zap,
  Globe,
  Shield,
  Wrench
} from 'lucide-react';
import { useAdminStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

// Admin Sub-components
import EnvironmentSettings from '../Admin/EnvironmentSettings';
import AIProviderSettings from '../Admin/AIProviderSettings';
import ContentManagement from '../Admin/ContentManagement';
import UserAnalytics from '../Admin/UserAnalytics';
import PaymentSettings from '../Admin/PaymentSettings';

export default function AdminPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/admin' },
    { id: 'environment', label: 'Environment', icon: Settings, path: '/admin/environment' },
    { id: 'ai-providers', label: 'AI Providers', icon: Brain, path: '/admin/ai-providers' },
    { id: 'content', label: 'Content', icon: Globe, path: '/admin/content' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeTabFromPath = adminTabs.find(tab => tab.path === currentPath);
    if (activeTabFromPath) {
      setActiveTab(activeTabFromPath.id);
    }
  }, [location.pathname]);

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center">
          <Users className="w-8 h-8 text-newomen-crystal mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">1,234</div>
          <div className="text-white/60 text-sm">Total Users</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Brain className="w-8 h-8 text-newomen-secondary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">5,678</div>
          <div className="text-white/60 text-sm">AI Conversations</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <CreditCard className="w-8 h-8 text-newomen-accent mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">$12,345</div>
          <div className="text-white/60 text-sm">Revenue (MTD)</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Zap className="w-8 h-8 text-newomen-primary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">98.5%</div>
          <div className="text-white/60 text-sm">Uptime</div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'New user registered', user: 'sarah.m@example.com', time: '2 min ago' },
            { action: 'AI conversation completed', user: 'amira.k@example.com', time: '5 min ago' },
            { action: 'Assessment completed', user: 'lisa.r@example.com', time: '12 min ago' },
            { action: 'Payment processed', user: 'maya.s@example.com', time: '18 min ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
              <div>
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-white/60 text-sm">{activity.user}</p>
              </div>
              <span className="text-white/60 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* System Status */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { service: 'Database', status: 'healthy', uptime: '99.9%' },
            { service: 'OpenAI API', status: 'healthy', uptime: '98.5%' },
            { service: 'Supabase Auth', status: 'healthy', uptime: '99.8%' },
            { service: 'PayPal API', status: 'warning', uptime: '97.2%' },
            { service: 'Voice Services', status: 'healthy', uptime: '99.1%' },
            { service: 'Email Service', status: 'healthy', uptime: '98.9%' }
          ].map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{service.service}</p>
                <p className="text-white/60 text-sm">{service.uptime} uptime</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                service.status === 'healthy' ? 'bg-green-400' : 
                service.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-white/80">
            Manage your Newomen platform
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-2">
            <div className="flex flex-wrap gap-2">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <Link
                    key={tab.id}
                    to={tab.path}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-newomen-primary text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Routes>
            <Route path="/" element={renderDashboard()} />
            <Route path="/environment" element={<EnvironmentSettings />} />
            <Route path="/ai-providers" element={<AIProviderSettings />} />
            <Route path="/content" element={<ContentManagement />} />
            <Route path="/payments" element={<PaymentSettings />} />
            <Route path="/users" element={<UserAnalytics />} />
            <Route path="/analytics" element={<UserAnalytics />} />
          </Routes>
        </motion.div>
      </div>
    </div>
  );
}