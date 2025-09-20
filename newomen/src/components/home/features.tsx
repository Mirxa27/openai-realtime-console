import { Brain, Heart, MessageSquare, Shield, Trophy, Users } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Narrative Identity Exploration',
    description: 'Discover and reshape your personal narrative through guided exploration and pattern recognition.',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Voice Conversations',
    description: 'Engage in natural, speech-to-speech conversations with your AI companion using cutting-edge technology.',
  },
  {
    icon: Heart,
    title: 'Emotionally Intelligent',
    description: 'Experience empathetic responses that adapt to your emotional state and cultural background.',
  },
  {
    icon: Trophy,
    title: 'Gamified Growth Journey',
    description: 'Track your progress, earn crystals, unlock achievements, and level up as you transform.',
  },
  {
    icon: Shield,
    title: 'Culturally Sensitive',
    description: 'Receive guidance that respects and integrates your cultural values and perspectives.',
  },
  {
    icon: Users,
    title: 'Community Connection',
    description: 'Join compatibility challenges and connect with others on similar growth journeys.',
  },
]

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Features That <span className="gradient-text">Transform</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Experience a comprehensive platform designed to support every aspect of your personal growth journey.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="glass-card p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}