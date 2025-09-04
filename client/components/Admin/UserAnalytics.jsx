import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  MessageCircle, 
  Brain, 
  CreditCard,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock
} from 'lucide-react';
import { useAdminStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function UserAnalytics() {
  const { userAnalytics, aiUsageMetrics, updateAnalytics } = useAdminStore();
  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        updateAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demonstration
  const mockAnalytics = {
    totalUsers: 1234,
    activeUsers: 567,
    newUsersToday: 23,
    totalConversations: 5678,
    avgSessionDuration: 12.5,
    totalMinutesUsed: 45230,
    revenue: 12345,
    conversionRate: 8.5,
    retentionRate: 72,
    satisfactionScore: 4.7
  };

  const mockChartData = {
    userGrowth: [
      { date: '2024-01-01', users: 100 },
      { date: '2024-01-02', users: 125 },
      { date: '2024-01-03', users: 150 },
      { date: '2024-01-04', users: 180 },
      { date: '2024-01-05', users: 210 },
      { date: '2024-01-06', users: 245 },
      { date: '2024-01-07', users: 280 }
    ],
    subscriptionTiers: [
      { tier: 'Discovery', count: 800, percentage: 65 },
      { tier: 'Growth', count: 300, percentage: 24 },
      { tier: 'Transformation', count: 134, percentage: 11 }
    ],
    topFocusAreas: [
      { area: 'Relationships', users: 450, percentage: 36 },
      { area: 'Wellness', users: 380, percentage: 31 },
      { area: 'Identity', users: 320, percentage: 26 },
      { area: 'Career', users: 280, percentage: 23 },
      { area: 'Family', users: 240, percentage: 19 },
      { area: 'Community', users: 180, percentage: 15 }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">User Analytics</h2>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </motion.button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6 text-center">
          <Users className="w-8 h-8 text-newomen-crystal mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{mockAnalytics.totalUsers}</div>
          <div className="text-white/60 text-sm">Total Users</div>
          <div className="text-green-400 text-xs mt-1">+{mockAnalytics.newUsersToday} today</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Activity className="w-8 h-8 text-newomen-secondary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{mockAnalytics.activeUsers}</div>
          <div className="text-white/60 text-sm">Active Users</div>
          <div className="text-white/40 text-xs mt-1">{Math.round(mockAnalytics.activeUsers / mockAnalytics.totalUsers * 100)}% of total</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <MessageCircle className="w-8 h-8 text-newomen-accent mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{mockAnalytics.totalConversations}</div>
          <div className="text-white/60 text-sm">Conversations</div>
          <div className="text-white/40 text-xs mt-1">{mockAnalytics.avgSessionDuration} min avg</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <CreditCard className="w-8 h-8 text-newomen-primary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${mockAnalytics.revenue}</div>
          <div className="text-white/60 text-sm">Revenue (MTD)</div>
          <div className="text-green-400 text-xs mt-1">{mockAnalytics.conversionRate}% conversion</div>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-newomen-crystal" />
            User Growth Trend
          </h3>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {mockChartData.userGrowth.map((point, index) => (
              <motion.div
                key={point.date}
                initial={{ height: 0 }}
                animate={{ height: `${(point.users / 300) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-t from-newomen-primary to-newomen-crystal rounded-t flex-1 min-w-0"
                title={`${point.date}: ${point.users} users`}
              />
            ))}
          </div>
          
          <div className="flex justify-between mt-4 text-xs text-white/60">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </GlassCard>

        {/* Subscription Distribution */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-newomen-secondary" />
            Subscription Tiers
          </h3>
          
          <div className="space-y-4">
            {mockChartData.subscriptionTiers.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    tier.tier === 'Discovery' ? 'bg-blue-400' :
                    tier.tier === 'Growth' ? 'bg-green-400' :
                    'bg-purple-400'
                  }`} />
                  <span className="text-white font-medium">{tier.tier}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-white/20 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${tier.percentage}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className={`h-2 rounded-full ${
                        tier.tier === 'Discovery' ? 'bg-blue-400' :
                        tier.tier === 'Growth' ? 'bg-green-400' :
                        'bg-purple-400'
                      }`}
                    />
                  </div>
                  <span className="text-white/70 text-sm w-12 text-right">{tier.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Focus Areas Popularity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-newomen-accent" />
          Popular Focus Areas
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockChartData.topFocusAreas.map((area, index) => (
            <motion.div
              key={area.area}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-semibold">{area.area}</h4>
                <span className="text-newomen-crystal font-bold">{area.percentage}%</span>
              </div>
              
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${area.percentage}%` }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  className="bg-gradient-to-r from-newomen-primary to-newomen-secondary h-2 rounded-full"
                />
              </div>
              
              <p className="text-white/60 text-sm">{area.users} users</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Metrics */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Engagement Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Average Session Duration</span>
              <span className="text-white font-semibold">{mockAnalytics.avgSessionDuration} min</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Total Minutes Used</span>
              <span className="text-white font-semibold">{mockAnalytics.totalMinutesUsed.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">User Retention (30d)</span>
              <span className="text-green-400 font-semibold">{mockAnalytics.retentionRate}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Satisfaction Score</span>
              <span className="text-newomen-crystal font-semibold">{mockAnalytics.satisfactionScore}/5.0</span>
            </div>
          </div>
        </GlassCard>

        {/* AI Usage Metrics */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">AI Usage Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Text Conversations</span>
              <span className="text-white font-semibold">3,245</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Voice Conversations</span>
              <span className="text-white font-semibold">2,433</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Average Response Time</span>
              <span className="text-green-400 font-semibold">1.2s</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">API Cost (MTD)</span>
              <span className="text-yellow-400 font-semibold">$234.56</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent User Activity</h3>
        
        <div className="space-y-3">
          {[
            { action: 'New user registered', user: 'sarah.m@example.com', time: '2 min ago', type: 'signup' },
            { action: 'Assessment completed', user: 'amira.k@example.com', time: '5 min ago', type: 'assessment' },
            { action: 'Voice conversation started', user: 'lisa.r@example.com', time: '8 min ago', type: 'voice' },
            { action: 'Subscription upgraded', user: 'maya.s@example.com', time: '12 min ago', type: 'payment' },
            { action: 'Community connection made', user: 'zara.h@example.com', time: '15 min ago', type: 'community' },
            { action: 'Achievement unlocked', user: 'fatima.a@example.com', time: '18 min ago', type: 'achievement' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'signup' ? 'bg-green-400' :
                  activity.type === 'assessment' ? 'bg-blue-400' :
                  activity.type === 'voice' ? 'bg-purple-400' :
                  activity.type === 'payment' ? 'bg-yellow-400' :
                  activity.type === 'community' ? 'bg-pink-400' :
                  'bg-orange-400'
                }`} />
                <div>
                  <p className="text-white font-medium">{activity.action}</p>
                  <p className="text-white/60 text-sm">{activity.user}</p>
                </div>
              </div>
              <span className="text-white/60 text-sm">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <Clock className="w-8 h-8 text-newomen-crystal mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">98.5%</div>
          <div className="text-white/60 text-sm">Uptime</div>
          <div className="text-green-400 text-xs mt-1">Last 30 days</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <Brain className="w-8 h-8 text-newomen-secondary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">1.2s</div>
          <div className="text-white/60 text-sm">Avg Response Time</div>
          <div className="text-green-400 text-xs mt-1">AI responses</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-newomen-accent mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{mockAnalytics.satisfactionScore}</div>
          <div className="text-white/60 text-sm">User Satisfaction</div>
          <div className="text-white/40 text-xs mt-1">Out of 5.0</div>
        </GlassCard>
      </div>
    </div>
  );
}