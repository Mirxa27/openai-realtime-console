'use client'

import { useState, useEffect } from 'react'
import { Users, MessageCircle, Trophy, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalConversations: number
  totalMinutesUsed: number
  totalRevenue: number
  userGrowth: any[]
  revenueData: any[]
  tierDistribution: any[]
}

const COLORS = ['#9333ea', '#ec4899', '#8b5cf6', '#a855f7']

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalConversations: 0,
    totalMinutesUsed: 0,
    totalRevenue: 0,
    userGrowth: [],
    revenueData: [],
    tierDistribution: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      // Fetch active users (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      
      const { count: activeUsers } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact' })
        .gte('last_active_at', sevenDaysAgo.toISOString())

      // Fetch conversation stats
      const { data: conversationStats } = await supabase
        .from('conversations')
        .select('minutes_used')

      const totalConversations = conversationStats?.length || 0
      const totalMinutesUsed = conversationStats?.reduce(
        (sum, conv) => sum + (conv.minutes_used || 0),
        0
      ) || 0

      // Fetch subscription stats
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('tier, created_at')
        .eq('status', 'active')

      // Calculate revenue (simplified)
      const revenue = subscriptions?.reduce((sum, sub) => {
        if (sub.tier === 'growth') return sum + 22
        if (sub.tier === 'transformation') return sum + 222
        return sum
      }, 0) || 0

      // Calculate tier distribution
      const tierCounts = {
        discovery: 0,
        growth: 0,
        transformation: 0,
      }

      const { data: userTiers } = await supabase
        .from('users')
        .select('subscription_tier')

      userTiers?.forEach((user) => {
        tierCounts[user.subscription_tier]++
      })

      const tierDistribution = Object.entries(tierCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))

      // Generate sample growth data (in production, this would be real data)
      const userGrowth = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: format(date, 'MMM dd'),
          users: Math.floor(Math.random() * 50) + 20,
        }
      })

      const revenueData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: format(date, 'MMM dd'),
          revenue: Math.floor(Math.random() * 2000) + 1000,
        }
      })

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalConversations,
        totalMinutesUsed,
        totalRevenue: revenue,
        userGrowth,
        revenueData,
        tierDistribution,
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-white">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Activity}
          subtitle="Last 7 days"
        />
        <StatCard
          title="Conversations"
          value={stats.totalConversations.toLocaleString()}
          icon={MessageCircle}
          subtitle={`${stats.totalMinutesUsed.toLocaleString()} minutes`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8%"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#9333ea"
                fill="url(#colorUsers)"
              />
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ec4899"
                strokeWidth={3}
                dot={{ fill: '#ec4899' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Subscription Tier Distribution</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.tierDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col justify-center space-y-4">
            {stats.tierDistribution.map((tier, index) => (
              <div key={tier.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-white">{tier.name}</span>
                </div>
                <span className="text-white/60">{tier.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 mt-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityItem
            icon={Users}
            text="New user registered"
            time="2 minutes ago"
          />
          <ActivityItem
            icon={Trophy}
            text="User achieved 'Transformation Master' badge"
            time="15 minutes ago"
          />
          <ActivityItem
            icon={DollarSign}
            text="New transformation tier subscription"
            time="1 hour ago"
          />
          <ActivityItem
            icon={MessageCircle}
            text="Voice conversation milestone: 10,000 minutes"
            time="3 hours ago"
          />
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, trend, trendUp, subtitle }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-white/60 text-sm">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-white/50 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="glass rounded-lg p-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
          <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}

function ActivityItem({ icon: Icon, text, time }) {
  return (
    <div className="flex items-center gap-3 p-3 glass rounded-lg">
      <Icon className="w-5 h-5 text-primary" />
      <div className="flex-1">
        <p className="text-white text-sm">{text}</p>
        <p className="text-white/50 text-xs">{time}</p>
      </div>
    </div>
  )
}