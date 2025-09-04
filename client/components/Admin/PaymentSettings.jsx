import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  DollarSign, 
  Settings, 
  TestTube,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';

export default function PaymentSettings() {
  const [paypalConfig, setPaypalConfig] = useState({
    clientId: '',
    clientSecret: '',
    environment: 'sandbox',
    webhookId: ''
  });
  
  const [subscriptionTiers, setSubscriptionTiers] = useState({
    discovery: { price: 0, minutes: 10, name: 'Discovery Tier' },
    growth: { price: 22, minutes: 100, name: 'Growth Tier' },
    transformation: { price: 222, minutes: 1000, name: 'Transformation Tier' }
  });

  const [showSecrets, setShowSecrets] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('unknown');

  const testPayPalConnection = async () => {
    setIsTestingConnection(true);
    
    try {
      const response = await fetch('/api/admin/test-paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paypalConfig)
      });

      const data = await response.json();
      
      if (data.success) {
        setConnectionStatus('connected');
        toast.success('PayPal connection successful!');
      } else {
        setConnectionStatus('error');
        throw new Error(data.error || 'Connection failed');
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error(`PayPal connection failed: ${error.message}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const savePayPalConfig = async () => {
    try {
      const response = await fetch('/api/admin/paypal-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paypalConfig)
      });

      if (response.ok) {
        toast.success('PayPal configuration saved');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      toast.error('Failed to save PayPal configuration');
    }
  };

  const updateSubscriptionTier = (tier, field, value) => {
    setSubscriptionTiers(prev => ({
      ...prev,
      [tier]: { ...prev[tier], [field]: value }
    }));
  };

  const saveSubscriptionTiers = async () => {
    try {
      const response = await fetch('/api/admin/subscription-tiers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionTiers)
      });

      if (response.ok) {
        toast.success('Subscription tiers updated');
      } else {
        throw new Error('Failed to update tiers');
      }
    } catch (error) {
      toast.error('Failed to update subscription tiers');
    }
  };

  // Mock payment data
  const recentTransactions = [
    { id: 'txn_001', user: 'sarah.m@example.com', amount: 22, tier: 'Growth', status: 'completed', date: '2024-01-15' },
    { id: 'txn_002', user: 'amira.k@example.com', amount: 222, tier: 'Transformation', status: 'completed', date: '2024-01-15' },
    { id: 'txn_003', user: 'lisa.r@example.com', amount: 22, tier: 'Growth', status: 'pending', date: '2024-01-15' },
    { id: 'txn_004', user: 'maya.s@example.com', amount: 222, tier: 'Transformation', status: 'failed', date: '2024-01-14' }
  ];

  const paymentStats = {
    totalRevenue: 12345,
    monthlyRevenue: 3456,
    totalTransactions: 234,
    successRate: 96.5,
    avgTransactionValue: 67.50
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Payment Settings</h2>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-400' :
            connectionStatus === 'error' ? 'bg-red-400' :
            'bg-yellow-400'
          }`} />
          <span className="text-white/70 text-sm">
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'error' ? 'Connection Error' :
             'Unknown Status'}
          </span>
        </div>
      </div>

      {/* PayPal Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-newomen-crystal" />
          PayPal Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-white/80 font-medium mb-2">Client ID</label>
            <input
              type="text"
              value={paypalConfig.clientId}
              onChange={(e) => setPaypalConfig(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="PayPal Client ID..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>
          
          <div>
            <label className="block text-white/80 font-medium mb-2">Client Secret</label>
            <div className="relative">
              <input
                type={showSecrets ? 'text' : 'password'}
                value={paypalConfig.clientSecret}
                onChange={(e) => setPaypalConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="PayPal Client Secret..."
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-white/80 font-medium mb-2">Environment</label>
            <select
              value={paypalConfig.environment}
              onChange={(e) => setPaypalConfig(prev => ({ ...prev, environment: e.target.value }))}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            >
              <option value="sandbox">Sandbox (Testing)</option>
              <option value="live">Live (Production)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white/80 font-medium mb-2">Webhook ID</label>
            <input
              type="text"
              value={paypalConfig.webhookId}
              onChange={(e) => setPaypalConfig(prev => ({ ...prev, webhookId: e.target.value }))}
              placeholder="Webhook ID..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={testPayPalConnection}
            disabled={isTestingConnection || !paypalConfig.clientId}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
          >
            {isTestingConnection ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4" />
            )}
            <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={savePayPalConfig}
            className="flex items-center space-x-2 px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Save Configuration</span>
          </motion.button>
        </div>
      </GlassCard>

      {/* Subscription Tiers */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-newomen-secondary" />
          Subscription Tiers
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {Object.entries(subscriptionTiers).map(([tier, config]) => (
            <motion.div
              key={tier}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-white/5 rounded-lg"
            >
              <h4 className="text-white font-semibold mb-4 capitalize">{config.name}</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-white/80 text-sm mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={config.price}
                    onChange={(e) => updateSubscriptionTier(tier, 'price', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Minutes</label>
                  <input
                    type="number"
                    value={config.minutes}
                    onChange={(e) => updateSubscriptionTier(tier, 'minutes', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-1">Display Name</label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => updateSubscriptionTier(tier, 'name', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={saveSubscriptionTiers}
          className="px-6 py-3 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
        >
          Update Subscription Tiers
        </motion.button>
      </GlassCard>

      {/* Payment Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <GlassCard className="p-6 text-center">
          <DollarSign className="w-8 h-8 text-newomen-crystal mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${paymentStats.totalRevenue}</div>
          <div className="text-white/60 text-sm">Total Revenue</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${paymentStats.monthlyRevenue}</div>
          <div className="text-white/60 text-sm">This Month</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <CreditCard className="w-8 h-8 text-newomen-secondary mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{paymentStats.totalTransactions}</div>
          <div className="text-white/60 text-sm">Transactions</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">{paymentStats.successRate}%</div>
          <div className="text-white/60 text-sm">Success Rate</div>
        </GlassCard>
        
        <GlassCard className="p-6 text-center">
          <DollarSign className="w-8 h-8 text-newomen-accent mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">${paymentStats.avgTransactionValue}</div>
          <div className="text-white/60 text-sm">Avg Value</div>
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/80 font-medium py-3 px-2">Transaction ID</th>
                <th className="text-left text-white/80 font-medium py-3 px-2">User</th>
                <th className="text-left text-white/80 font-medium py-3 px-2">Amount</th>
                <th className="text-left text-white/80 font-medium py-3 px-2">Tier</th>
                <th className="text-left text-white/80 font-medium py-3 px-2">Status</th>
                <th className="text-left text-white/80 font-medium py-3 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3 px-2 text-white/70 font-mono text-sm">{transaction.id}</td>
                  <td className="py-3 px-2 text-white">{transaction.user}</td>
                  <td className="py-3 px-2 text-white font-semibold">${transaction.amount}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.tier === 'Growth' ? 'bg-green-500/20 text-green-400' :
                      transaction.tier === 'Transformation' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {transaction.tier}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-white/70 text-sm">{transaction.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Webhook Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">Webhook Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 font-medium mb-2">Webhook URL</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={`${window.location.origin}/api/webhooks/paypal`}
                readOnly
                className="flex-1 px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/70 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/api/webhooks/paypal`);
                  toast.success('Webhook URL copied!');
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
              >
                Copy
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 font-medium mb-2">Events to Subscribe</label>
              <div className="space-y-2 text-sm">
                {[
                  'PAYMENT.SALE.COMPLETED',
                  'BILLING.SUBSCRIPTION.CREATED',
                  'BILLING.SUBSCRIPTION.CANCELLED',
                  'PAYMENT.SALE.REFUNDED'
                ].map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/70">{event}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-white/80 font-medium mb-2">Webhook Status</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/70 text-sm">Webhook Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/70 text-sm">SSL Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-white/70 text-sm">Last Event: 2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}