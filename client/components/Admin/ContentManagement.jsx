import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Brain, 
  Heart, 
  Sparkles,
  Users,
  Target,
  Wand2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAdminStore } from '../../lib/store';
import GlassCard from '../UI/GlassCard';

export default function ContentManagement() {
  const { affirmations, assessments, challenges, addAffirmation, addAssessment } = useAdminStore();
  const [activeTab, setActiveTab] = useState('affirmations');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const tabs = [
    { id: 'affirmations', label: 'Daily Affirmations', icon: Heart },
    { id: 'assessments', label: 'Assessments', icon: Brain },
    { id: 'challenges', label: 'Group Challenges', icon: Target },
    { id: 'explorations', label: 'AI Explorations', icon: Wand2 }
  ];

  const [newContent, setNewContent] = useState({
    affirmation: {
      content: '',
      category: 'empowerment',
      cultural_context: ['general'],
      personality_types: ['all']
    },
    assessment: {
      title: '',
      description: '',
      category: 'personality',
      duration_minutes: 5,
      crystal_reward: 50,
      is_free: true,
      questions: []
    },
    challenge: {
      title: '',
      description: '',
      duration_days: 7,
      crystal_reward: 150,
      max_participants: 1000
    },
    exploration: {
      topic: '',
      target_audience: 'general',
      difficulty: 'beginner',
      estimated_duration: 15
    }
  });

  const generateAIContent = async (type, topic) => {
    setAiGenerating(true);
    
    try {
      const response = await fetch('/api/admin/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, topic, target_audience: newContent[type]?.target_audience })
      });

      const data = await response.json();
      
      if (data.success) {
        if (type === 'affirmation') {
          setNewContent(prev => ({
            ...prev,
            affirmation: { ...prev.affirmation, content: data.content }
          }));
        } else if (type === 'assessment') {
          setNewContent(prev => ({
            ...prev,
            assessment: { 
              ...prev.assessment, 
              title: data.title,
              description: data.description,
              questions: data.questions 
            }
          }));
        } else if (type === 'exploration') {
          // Handle exploration generation
          toast.success('AI exploration generated successfully');
        }
        
        toast.success('Content generated successfully!');
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setAiGenerating(false);
    }
  };

  const saveContent = async (type) => {
    try {
      const response = await fetch(`/api/admin/${type}s`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent[type])
      });

      const data = await response.json();
      
      if (data.success) {
        if (type === 'affirmation') {
          addAffirmation(data.item);
        } else if (type === 'assessment') {
          addAssessment(data.item);
        }
        
        setIsCreating(false);
        setNewContent(prev => ({
          ...prev,
          [type]: type === 'affirmation' ? { content: '', category: 'empowerment', cultural_context: ['general'], personality_types: ['all'] } :
                   type === 'assessment' ? { title: '', description: '', category: 'personality', duration_minutes: 5, crystal_reward: 50, is_free: true, questions: [] } :
                   { title: '', description: '', duration_days: 7, crystal_reward: 150, max_participants: 1000 }
        }));
        
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      toast.error(`Failed to create ${type}`);
    }
  };

  const renderAffirmationsTab = () => (
    <div className="space-y-6">
      {/* Create New Affirmation */}
      {isCreating && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Create New Affirmation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 font-medium mb-2">Affirmation Content</label>
              <div className="flex space-x-2">
                <textarea
                  value={newContent.affirmation.content}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    affirmation: { ...prev.affirmation, content: e.target.value }
                  }))}
                  placeholder="Enter affirmation text..."
                  className="flex-1 h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary resize-none"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => generateAIContent('affirmation', 'empowering affirmation for women')}
                  disabled={aiGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-lg text-white font-medium hover:from-newomen-secondary hover:to-newomen-crystal transition-all duration-300 disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 font-medium mb-2">Category</label>
                <select
                  value={newContent.affirmation.category}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    affirmation: { ...prev.affirmation, category: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                >
                  <option value="empowerment">Empowerment</option>
                  <option value="identity">Identity</option>
                  <option value="growth">Growth</option>
                  <option value="transformation">Transformation</option>
                  <option value="self-love">Self-Love</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">Cultural Context</label>
                <select
                  value={newContent.affirmation.cultural_context[0]}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    affirmation: { ...prev.affirmation, cultural_context: [e.target.value] }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                >
                  <option value="general">General</option>
                  <option value="western">Western</option>
                  <option value="middle-eastern">Middle Eastern</option>
                  <option value="asian">Asian</option>
                  <option value="african">African</option>
                  <option value="latin-american">Latin American</option>
                </select>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">Personality Types</label>
                <select
                  value={newContent.affirmation.personality_types[0]}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    affirmation: { ...prev.affirmation, personality_types: [e.target.value] }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                >
                  <option value="all">All Types</option>
                  <option value="analytical">Analytical Thinker</option>
                  <option value="intuitive">Intuitive Explorer</option>
                  <option value="collaborative">Collaborative Connector</option>
                  <option value="action-oriented">Action-Oriented Achiever</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => saveContent('affirmation')}
                className="px-6 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Affirmation</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Existing Affirmations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sample affirmations - these would come from the database */}
        {[
          { id: 1, content: 'You are the author of your own story. Write it beautifully.', category: 'empowerment', cultural_context: ['general'], active: true },
          { id: 2, content: 'Your authentic self is your greatest strength.', category: 'identity', cultural_context: ['general'], active: true },
          { id: 3, content: 'Growth happens outside your comfort zone. Embrace the journey.', category: 'growth', cultural_context: ['general'], active: true }
        ].map((affirmation) => (
          <motion.div
            key={affirmation.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  affirmation.category === 'empowerment' ? 'bg-newomen-primary/20 text-newomen-primary' :
                  affirmation.category === 'identity' ? 'bg-newomen-secondary/20 text-newomen-secondary' :
                  'bg-newomen-accent/20 text-newomen-accent'
                }`}>
                  {affirmation.category}
                </span>
                
                <div className="flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingItem(affirmation)}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
              
              <p className="text-white italic mb-3">"{affirmation.content}"</p>
              
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>Cultural: {affirmation.cultural_context.join(', ')}</span>
                <div className={`w-2 h-2 rounded-full ${affirmation.active ? 'bg-green-400' : 'bg-gray-400'}`} />
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAssessmentsTab = () => (
    <div className="space-y-6">
      {/* Create New Assessment */}
      {isCreating && (
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Create New Assessment</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 font-medium mb-2">Title</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newContent.assessment.title}
                    onChange={(e) => setNewContent(prev => ({
                      ...prev,
                      assessment: { ...prev.assessment, title: e.target.value }
                    }))}
                    placeholder="Assessment title..."
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => generateAIContent('assessment', newContent.exploration.topic)}
                    disabled={aiGenerating || !newContent.exploration.topic}
                    className="px-4 py-2 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-lg text-white font-medium hover:from-newomen-secondary hover:to-newomen-crystal transition-all duration-300 disabled:opacity-50"
                  >
                    {aiGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">Category</label>
                <select
                  value={newContent.assessment.category}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    assessment: { ...prev.assessment, category: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                >
                  <option value="personality">Personality</option>
                  <option value="relationships">Relationships</option>
                  <option value="career">Career</option>
                  <option value="wellness">Wellness</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-2">Description</label>
              <textarea
                value={newContent.assessment.description}
                onChange={(e) => setNewContent(prev => ({
                  ...prev,
                  assessment: { ...prev.assessment, description: e.target.value }
                }))}
                placeholder="Assessment description..."
                className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/80 font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newContent.assessment.duration_minutes}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    assessment: { ...prev.assessment, duration_minutes: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                />
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-2">Crystal Reward</label>
                <input
                  type="number"
                  value={newContent.assessment.crystal_reward}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    assessment: { ...prev.assessment, crystal_reward: parseInt(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  checked={newContent.assessment.is_free}
                  onChange={(e) => setNewContent(prev => ({
                    ...prev,
                    assessment: { ...prev.assessment, is_free: e.target.checked }
                  }))}
                  className="w-4 h-4 text-newomen-primary bg-white/10 border-white/20 rounded focus:ring-newomen-primary"
                />
                <label className="text-white/80">Free Assessment</label>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => saveContent('assessment')}
                className="px-6 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save Assessment</span>
                </div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Existing Assessments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample assessments */}
        {[
          { id: 1, title: 'Quick Personality Insight', category: 'personality', duration: 5, reward: 50, free: true, questions: 3 },
          { id: 2, title: 'Relationship Style Assessment', category: 'relationships', duration: 7, reward: 75, free: true, questions: 5 },
          { id: 3, title: 'Deep Narrative Identity', category: 'personality', duration: 25, reward: 200, free: false, questions: 10 }
        ].map((assessment) => (
          <motion.div
            key={assessment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    assessment.free ? 'bg-green-500/20 text-green-400' : 'bg-newomen-crystal/20 text-newomen-crystal'
                  }`}>
                    {assessment.free ? 'Free' : 'Premium'}
                  </span>
                  <span className="px-2 py-1 bg-white/10 text-white/80 rounded-full text-xs">
                    {assessment.category}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>
              
              <h4 className="text-white font-semibold mb-2">{assessment.title}</h4>
              
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{assessment.duration} min</span>
                </div>
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span>{assessment.questions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reward:</span>
                  <span className="text-newomen-crystal">+{assessment.reward}</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderExplorationsTab = () => (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">AI-Generated Explorations</h3>
        <p className="text-white/70 mb-6">
          Let AI create comprehensive explorations based on topics you provide. The AI will generate questions, 
          activities, and insights tailored to your specified audience and difficulty level.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-white/80 font-medium mb-2">Exploration Topic</label>
            <input
              type="text"
              value={newContent.exploration.topic}
              onChange={(e) => setNewContent(prev => ({
                ...prev,
                exploration: { ...prev.exploration, topic: e.target.value }
              }))}
              placeholder="e.g., 'Building self-confidence', 'Healing from trauma', 'Career transitions'..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/80 font-medium mb-2">Target Audience</label>
              <select
                value={newContent.exploration.target_audience}
                onChange={(e) => setNewContent(prev => ({
                  ...prev,
                  exploration: { ...prev.exploration, target_audience: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              >
                <option value="general">General Audience</option>
                <option value="young-adults">Young Adults (18-25)</option>
                <option value="professionals">Working Professionals</option>
                <option value="mothers">Mothers & Caregivers</option>
                <option value="students">Students</option>
                <option value="seniors">Mature Women (50+)</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-2">Difficulty Level</label>
              <select
                value={newContent.exploration.difficulty}
                onChange={(e) => setNewContent(prev => ({
                  ...prev,
                  exploration: { ...prev.exploration, difficulty: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={newContent.exploration.estimated_duration}
                onChange={(e) => setNewContent(prev => ({
                  ...prev,
                  exploration: { ...prev.exploration, estimated_duration: parseInt(e.target.value) }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => generateAIContent('exploration', newContent.exploration.topic)}
            disabled={aiGenerating || !newContent.exploration.topic}
            className="w-full py-3 bg-gradient-to-r from-newomen-crystal to-newomen-secondary rounded-lg text-white font-semibold hover:from-newomen-secondary hover:to-newomen-crystal transition-all duration-300 disabled:opacity-50"
          >
            {aiGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Exploration...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Wand2 className="w-5 h-5" />
                <span>Generate AI Exploration</span>
              </div>
            )}
          </motion.button>
        </div>
      </GlassCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'affirmations':
        return renderAffirmationsTab();
      case 'assessments':
        return renderAssessmentsTab();
      case 'explorations':
        return renderExplorationsTab();
      default:
        return <div className="text-center text-white/60 py-12">Coming soon...</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsCreating(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-newomen-primary hover:bg-newomen-secondary rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Content</span>
        </motion.button>
      </div>

      {/* Tabs */}
      <GlassCard className="p-4">
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
                <span>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
}