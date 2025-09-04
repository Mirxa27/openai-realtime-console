'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
]

const cultures = [
  { code: 'western', name: 'Western', description: 'North American / European values' },
  { code: 'middle-eastern', name: 'Middle Eastern', description: 'Arab / Islamic values' },
  { code: 'asian', name: 'Asian', description: 'East / South Asian values' },
  { code: 'latin', name: 'Latin', description: 'Latin American values' },
]

interface LanguageSelectionProps {
  onComplete: (data: { language: string; culture: string }) => void
  initialData: { language: string; culture: string }
}

export function LanguageSelection({ onComplete, initialData }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialData.language)
  const [selectedCulture, setSelectedCulture] = useState(initialData.culture)

  const handleContinue = () => {
    onComplete({
      language: selectedLanguage,
      culture: selectedCulture,
    })
  }

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome to Newomen</h2>
        <p className="text-white/70">Let's personalize your experience</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Select your language</h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`glass rounded-lg p-4 text-left transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-2 border-primary'
                    : 'hover:bg-white/10'
                }`}
                dir={lang.rtl ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-white">{lang.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Select your cultural background</h3>
          <p className="text-sm text-white/60 mb-3">
            This helps NewMe provide culturally sensitive guidance
          </p>
          <div className="space-y-3">
            {cultures.map((culture) => (
              <button
                key={culture.code}
                onClick={() => setSelectedCulture(culture.code)}
                className={`w-full glass rounded-lg p-4 text-left transition-all ${
                  selectedCulture === culture.code
                    ? 'border-2 border-primary'
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-white">{culture.name}</div>
                <div className="text-sm text-white/60 mt-1">{culture.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full glass-button py-3 mt-8"
      >
        Continue
      </button>
    </div>
  )
}