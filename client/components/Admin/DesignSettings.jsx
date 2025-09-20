import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Save, 
  RefreshCw, 
  Eye, 
  Monitor,
  Smartphone,
  Type,
  Layout,
  Image,
  Brush,
  Settings,
  Download,
  Upload,
  Undo,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import GlassCard from '../UI/GlassCard';

export default function DesignSettings() {
  const [designConfig, setDesignConfig] = useState({
    colors: {
      primary: '#8B5CF6',
      secondary: '#A855F7',
      accent: '#C084FC',
      background: '#0F0F23',
      surface: '#1A1A35',
      text: '#FFFFFF'
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: {
        base: '16px',
        heading: '2rem',
        small: '14px'
      }
    },
    layout: {
      borderRadius: '16px',
      spacing: '1rem',
      glassOpacity: 0.1,
      backdropBlur: '20px'
    },
    branding: {
      logo: '/logo.png',
      siteName: 'Newomen',
      favicon: '/favicon.ico'
    }
  });
  
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isApplying, setIsApplying] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    // Load current design configuration
    loadDesignConfig();
  }, []);

  const loadDesignConfig = async () => {
    try {
      const response = await fetch('/api/admin/design-config');
      if (response.ok) {
        const data = await response.json();
        if (data.config) {
          setDesignConfig(data.config);
        }
      }
    } catch (error) {
      console.error('Failed to load design config:', error);
    }
  };

  const updateDesignValue = (category, key, value) => {
    setDesignConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedValue = (category, subKey, key, value) => {
    setDesignConfig(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subKey]: {
          ...prev[category][subKey],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const applyDesignChanges = async () => {
    setIsApplying(true);
    try {
      // Save design configuration
      const response = await fetch('/api/admin/design-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: designConfig })
      });

      if (response.ok) {
        // Apply CSS custom properties to document root
        applyDesignToDom();
        
        // Trigger Vercel deployment with new design
        await triggerDeployment();
        
        setHasChanges(false);
        setLastSaved(new Date());
        toast.success('Design changes applied successfully!');
      } else {
        throw new Error('Failed to save design configuration');
      }
    } catch (error) {
      toast.error('Failed to apply design changes');
      console.error('Design application error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const applyDesignToDom = () => {
    const root = document.documentElement;
    
    // Apply color variables
    Object.entries(designConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Apply typography variables
    root.style.setProperty('--font-heading', designConfig.typography.headingFont);
    root.style.setProperty('--font-body', designConfig.typography.bodyFont);
    Object.entries(designConfig.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    
    // Apply layout variables
    Object.entries(designConfig.layout).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const triggerDeployment = async () => {
    try {
      const response = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: 'Design configuration update',
          config: designConfig 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Deployment triggered - changes will be live in a few minutes');
      }
    } catch (error) {
      console.error('Deployment trigger failed:', error);
      toast.error('Failed to trigger deployment');
    }
  };

  const resetToDefaults = () => {
    const defaultConfig = {
      colors: {
        primary: '#8B5CF6',
        secondary: '#A855F7',
        accent: '#C084FC',
        background: '#0F0F23',
        surface: '#1A1A35',
        text: '#FFFFFF'
      },
      typography: {
        headingFont: 'Inter',
        bodyFont: 'Inter',
        fontSize: {
          base: '16px',
          heading: '2rem',
          small: '14px'
        }
      },
      layout: {
        borderRadius: '16px',
        spacing: '1rem',
        glassOpacity: 0.1,
        backdropBlur: '20px'
      },
      branding: {
        logo: '/logo.png',
        siteName: 'Newomen',
        favicon: '/favicon.ico'
      }
    };
    
    setDesignConfig(defaultConfig);
    setHasChanges(true);
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(designConfig, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'design-config.json';
    link.click();
  };

  const importConfig = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target.result);
          setDesignConfig(config);
          setHasChanges(true);
          toast.success('Design configuration imported');
        } catch (error) {
          toast.error('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Design Settings
          </h2>
          <p className="text-white/80">
            Customize the visual appearance and branding of your platform
          </p>
        </motion.div>

        <div className="flex items-center space-x-3">
          {lastSaved && (
            <div className="text-sm text-white/60">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={applyDesignChanges}
            disabled={!hasChanges || isApplying}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-newomen-secondary to-newomen-accent rounded-lg text-white font-medium hover:from-newomen-accent hover:to-newomen-secondary transition-all duration-300 disabled:opacity-50"
          >
            {isApplying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isApplying ? 'Applying...' : 'Apply Changes'}</span>
          </motion.button>
        </div>
      </div>

      {/* Preview Mode Selector */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Preview Mode
          </h3>
          
          <div className="flex bg-white/5 rounded-lg p-1">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setPreviewMode(id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all ${
                  previewMode === id
                    ? 'bg-newomen-primary text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Color Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Color Scheme
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(designConfig.colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-white/80 text-sm font-medium capitalize">
                {key} Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => updateDesignValue('colors', key, e.target.value)}
                  className="w-12 h-10 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateDesignValue('colors', key, e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Typography Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Type className="w-5 h-5 mr-2" />
          Typography
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Heading Font
              </label>
              <select
                value={designConfig.typography.headingFont}
                onChange={(e) => updateDesignValue('typography', 'headingFont', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Body Font
              </label>
              <select
                value={designConfig.typography.bodyFont}
                onChange={(e) => updateDesignValue('typography', 'bodyFont', e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              >
                <option value="Inter">Inter</option>
                <option value="Poppins">Poppins</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(designConfig.typography.fontSize).map(([key, value]) => (
              <div key={key}>
                <label className="block text-white/80 text-sm font-medium mb-2 capitalize">
                  {key} Font Size
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateNestedValue('typography', 'fontSize', key, e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
                />
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Layout Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Layout className="w-5 h-5 mr-2" />
          Layout & Effects
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designConfig.layout).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-white/80 text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateDesignValue('layout', key, e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Branding Configuration */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Image className="w-5 h-5 mr-2" />
          Branding
        </h3>
        
        <div className="space-y-4">
          {Object.entries(designConfig.branding).map(([key, value]) => (
            <div key={key}>
              <label className="block text-white/80 text-sm font-medium mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateDesignValue('branding', key, e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-newomen-primary"
              />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Actions */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Actions
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <Undo className="w-4 h-4" />
            <span>Reset to Defaults</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportConfig}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Config</span>
          </motion.button>
          
          <label className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Config</span>
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </label>
        </div>
      </GlassCard>
    </div>
  );
}