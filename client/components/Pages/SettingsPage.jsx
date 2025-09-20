import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  Globe, 
  Volume2, 
  Moon, 
  Sun, 
  Smartphone,
  Download,
  Trash2,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../../lib/store';
import { signOut } from '../../lib/supabase';
import { toast } from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';

export default function SettingsPage() {
  const { user, profile, logout } = useAuthStore();
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      achievements: true,
      challenges: true,
      reminders: true
    },
    privacy: {
      profileVisible: true,
      progressVisible: false,
      allowConnections: true
    },
    preferences: {
      theme: 'auto',
      language: profile?.preferred_language || 'en',
      voiceEnabled: true,
      soundEffects: true
    }
  });

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      // Save settings to backend
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/delete-account', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.access_token}`
          }
        });

        if (response.ok) {
          logout();
          toast.success('Account deleted successfully');
        } else {
          throw new Error('Failed to delete account');
        }
      } catch (error) {
        toast.error('Failed to delete account');
      }
    }
  };

  const SettingToggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        {description && (
          <p className="text-white/60 text-sm mt-1">{description}</p>
        )}
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all duration-300 ${
          value ? 'bg-newomen-primary' : 'bg-white/20'
        }`}
      >
        <motion.div
          animate={{ x: value ? 24 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </motion.button>
    </div>
  );

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Settings
          </h1>
          <p className="text-xl text-white/80">
            Customize your Newomen experience
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-newomen-crystal" />
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <SettingToggle
                  label="Push Notifications"
                  description="Receive notifications on your device"
                  value={settings.notifications.push}
                  onChange={(value) => updateSetting('notifications', 'push', value)}
                />
                <SettingToggle
                  label="Email Notifications"
                  description="Receive updates via email"
                  value={settings.notifications.email}
                  onChange={(value) => updateSetting('notifications', 'email', value)}
                />
                <SettingToggle
                  label="Achievement Alerts"
                  description="Get notified when you earn achievements"
                  value={settings.notifications.achievements}
                  onChange={(value) => updateSetting('notifications', 'achievements', value)}
                />
                <SettingToggle
                  label="Challenge Updates"
                  description="Receive updates about group challenges"
                  value={settings.notifications.challenges}
                  onChange={(value) => updateSetting('notifications', 'challenges', value)}
                />
                <SettingToggle
                  label="Daily Reminders"
                  description="Gentle reminders to check in with yourself"
                  value={settings.notifications.reminders}
                  onChange={(value) => updateSetting('notifications', 'reminders', value)}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-newomen-secondary" />
                <h2 className="text-2xl font-bold text-white">Privacy & Security</h2>
              </div>
              
              <div className="space-y-4">
                <SettingToggle
                  label="Profile Visibility"
                  description="Allow other community members to find your profile"
                  value={settings.privacy.profileVisible}
                  onChange={(value) => updateSetting('privacy', 'profileVisible', value)}
                />
                <SettingToggle
                  label="Progress Sharing"
                  description="Share your progress with connected friends"
                  value={settings.privacy.progressVisible}
                  onChange={(value) => updateSetting('privacy', 'progressVisible', value)}
                />
                <SettingToggle
                  label="Connection Requests"
                  description="Allow others to send you connection requests"
                  value={settings.privacy.allowConnections}
                  onChange={(value) => updateSetting('privacy', 'allowConnections', value)}
                />
              </div>
            </GlassCard>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-newomen-accent" />
                <h2 className="text-2xl font-bold text-white">Preferences</h2>
              </div>
              
              <div className="space-y-6">
                {/* Language Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">Language</label>
                  <select
                    value={settings.preferences.language}
                    onChange={(e) => updateSetting('preferences', 'language', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  >
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'auto', label: 'Auto', icon: Smartphone },
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon }
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <motion.button
                          key={theme.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateSetting('preferences', 'theme', theme.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            settings.preferences.theme === theme.value
                              ? 'bg-newomen-primary border-newomen-primary text-white'
                              : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <span className="text-sm">{theme.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="space-y-4">
                  <SettingToggle
                    label="Voice Chat Enabled"
                    description="Enable voice conversations with NewMe"
                    value={settings.preferences.voiceEnabled}
                    onChange={(value) => updateSetting('preferences', 'voiceEnabled', value)}
                  />
                  <SettingToggle
                    label="Sound Effects"
                    description="Play sounds for achievements and notifications"
                    value={settings.preferences.soundEffects}
                    onChange={(value) => updateSetting('preferences', 'soundEffects', value)}
                  />
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Data & Storage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Data & Storage</h2>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-newomen-accent" />
                    <div className="text-left">
                      <h4 className="font-medium">Export My Data</h4>
                      <p className="text-white/60 text-sm">Download all your data in JSON format</p>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Trash2 className="w-5 h-5 text-yellow-400" />
                    <div className="text-left">
                      <h4 className="font-medium">Clear Chat History</h4>
                      <p className="text-white/60 text-sm">Remove all conversation history</p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Account</h2>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveSettings}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-semibold hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
                >
                  <span>Save All Settings</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={deleteAccount}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-medium transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Account</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="w-6 h-6 text-newomen-crystal" />
                <h2 className="text-2xl font-bold text-white">Support & Help</h2>
              </div>
              
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <span>Help Center</span>
                  <span className="text-white/60">→</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <span>Contact Support</span>
                  <span className="text-white/60">→</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <span>Privacy Policy</span>
                  <span className="text-white/60">→</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                >
                  <span>Terms of Service</span>
                  <span className="text-white/60">→</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}