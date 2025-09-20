import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Search,
  UserPlus,
  Trophy,
  Target,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { useAuthStore, useAppStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';

export default function CommunityPage() {
  const { user, profile } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('discover');
  const [compatibilityLink, setCompatibilityLink] = useState('');

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Users },
    { id: 'connections', label: 'My Connections', icon: Heart },
    { id: 'challenges', label: 'Group Challenges', icon: Trophy },
    { id: 'compatibility', label: 'Compatibility AI', icon: MessageCircle }
  ];

  const groupChallenges = [
    {
      id: 'mindfulness-week',
      title: '7-Day Mindfulness Challenge',
      description: 'Practice daily mindfulness with the community',
      participants: 234,
      daysLeft: 3,
      reward: 150,
      isActive: true
    },
    {
      id: 'gratitude-month',
      title: 'Gratitude Month',
      description: 'Share daily gratitudes and spread positivity',
      participants: 567,
      daysLeft: 12,
      reward: 300,
      isActive: true
    },
    {
      id: 'story-sharing',
      title: 'Story Sharing Circle',
      description: 'Share and celebrate transformation stories',
      participants: 89,
      daysLeft: 7,
      reward: 200,
      isActive: false
    }
  ];

  const communityMembers = [
    {
      id: 'sarah_m',
      nickname: 'SarahGrows',
      avatar: null,
      level: 5,
      crystals: 2340,
      focusAreas: ['relationships', 'wellness'],
      isOnline: true,
      mutualConnection: false
    },
    {
      id: 'amira_k',
      nickname: 'AmiraShines',
      avatar: null,
      level: 3,
      crystals: 1200,
      focusAreas: ['identity', 'family'],
      isOnline: false,
      mutualConnection: true
    },
    {
      id: 'lisa_r',
      nickname: 'LisaEvolves',
      avatar: null,
      level: 7,
      crystals: 3890,
      focusAreas: ['career', 'wellness'],
      isOnline: true,
      mutualConnection: false
    }
  ];

  const generateCompatibilityLink = () => {
    const linkId = crypto.randomUUID();
    const link = `${window.location.origin}/compatibility/${linkId}`;
    setCompatibilityLink(link);
    
    // Store the compatibility session in the database
    // This will be implemented with the backend
    
    toast.success('Compatibility link generated!');
  };

  const copyCompatibilityLink = () => {
    navigator.clipboard.writeText(compatibilityLink);
    toast.success('Link copied to clipboard!');
  };

  const connectWithUser = (userId) => {
    // Implement connection request
    toast.success('Connection request sent!');
  };

  const joinChallenge = (challengeId) => {
    // Implement challenge joining
    toast.success('Joined challenge!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <div className="space-y-6">
            {/* Search */}
            <GlassCard className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by nickname..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary focus:border-transparent transition-all"
                />
              </div>
            </GlassCard>

            {/* Community Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityMembers
                .filter(member => 
                  member.nickname.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {member.nickname.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{member.nickname}</h3>
                          <p className="text-white/60 text-sm">Level {member.level}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${member.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                    </div>

                    <div className="flex items-center space-x-4 mb-4 text-sm text-white/70">
                      <div className="flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-newomen-crystal" />
                        <span>{member.crystals}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{member.focusAreas.length} areas</span>
                      </div>
                    </div>

                    {!member.mutualConnection && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => connectWithUser(member.id)}
                        className="w-full py-2 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-lg text-white font-medium hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <UserPlus className="w-4 h-4" />
                          <span>Connect</span>
                        </div>
                      </motion.button>
                    )}

                    {member.mutualConnection && (
                      <div className="flex items-center justify-center space-x-2 text-green-400">
                        <Heart className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'connections':
        return (
          <div className="space-y-6">
            <GlassCard className="p-6 text-center">
              <Heart className="w-16 h-16 text-newomen-secondary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Your Connections</h3>
              <p className="text-white/70 mb-4">
                You have {communityMembers.filter(m => m.mutualConnection).length} connections
              </p>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityMembers
                .filter(member => member.mutualConnection)
                .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {member.nickname.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">{member.nickname}</h3>
                        <p className="text-white/60">Level {member.level}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Sparkles className="w-4 h-4 text-newomen-crystal" />
                          <span className="text-white/70 text-sm">{member.crystals} crystals</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </div>
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Share2 className="w-4 h-4" />
                          <span>Share Progress</span>
                        </div>
                      </motion.button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            {groupChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                        {challenge.isActive && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 mb-4">{challenge.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-white/60">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="w-4 h-4" />
                          <span>{challenge.daysLeft} days left</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4 text-newomen-crystal" />
                          <span>+{challenge.reward} crystals</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => joinChallenge(challenge.id)}
                    disabled={challenge.isActive}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      challenge.isActive
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-gradient-to-r from-newomen-primary to-newomen-secondary text-white hover:from-newomen-secondary hover:to-newomen-primary'
                    }`}
                  >
                    {challenge.isActive ? 'Participating' : 'Join Challenge'}
                  </motion.button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        );

      case 'compatibility':
        return (
          <div className="space-y-6">
            <GlassCard className="p-6 text-center">
              <MessageCircle className="w-16 h-16 text-newomen-crystal mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Compatibility AI Challenge
              </h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Create a unique link to explore compatibility with friends, partners, or anyone special in your life
              </p>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateCompatibilityLink}
                className="w-full py-4 bg-gradient-to-r from-newomen-primary to-newomen-secondary rounded-xl text-white font-semibold text-lg hover:from-newomen-secondary hover:to-newomen-primary transition-all duration-300 mb-4"
              >
                Generate Compatibility Link
              </motion.button>

              {compatibilityLink && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <GlassCard className="p-4 bg-white/5">
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="w-5 h-5 text-newomen-crystal flex-shrink-0" />
                      <input
                        type="text"
                        value={compatibilityLink}
                        readOnly
                        className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                      />
                    </div>
                  </GlassCard>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={copyCompatibilityLink}
                    className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                  >
                    Copy Link
                  </motion.button>
                </motion.div>
              )}
            </GlassCard>

            {/* How it Works */}
            <GlassCard className="p-6">
              <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
              <div className="space-y-3 text-white/70">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-newomen-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">1</div>
                  <p>Generate a unique compatibility link</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-newomen-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">2</div>
                  <p>Share the link with someone you'd like to explore compatibility with</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-newomen-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">3</div>
                  <p>Both of you answer NewMe's insightful questions privately</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-newomen-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">4</div>
                  <p>Receive a detailed compatibility analysis and see each other's responses</p>
                </div>
              </div>
            </GlassCard>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Community & Connection
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Connect with like-minded women on similar transformation journeys
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-newomen-primary text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}