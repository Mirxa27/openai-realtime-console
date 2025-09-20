import Link from 'next/link'
import { Check, Sparkles } from 'lucide-react'

const tiers = [
  {
    name: 'Discovery',
    price: 'Free',
    minutes: '10 minutes',
    features: [
      'Initial personality assessment',
      'Basic narrative exploration',
      'Free assessments access',
      'Daily affirmations',
      'Text chat only',
    ],
    cta: 'Start Free',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Growth',
    price: '$22',
    minutes: '100 minutes',
    features: [
      'Everything in Discovery',
      'Voice conversations',
      'Advanced assessments',
      'Progress tracking',
      'Crystal rewards',
      'Achievement badges',
      'Community access',
    ],
    cta: 'Grow Now',
    href: '/auth/signup?tier=growth',
    popular: true,
  },
  {
    name: 'Transformation',
    price: '$222',
    minutes: '1000 minutes',
    features: [
      'Everything in Growth',
      'Deep therapeutic guidance',
      'Advanced pattern analysis',
      'Priority support',
      'Exclusive workshops',
      'Compatibility challenges',
      'Personal growth coach',
    ],
    cta: 'Transform Today',
    href: '/auth/signup?tier=transformation',
    popular: false,
  },
]

export function Pricing() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Growth Path</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select the plan that best supports your transformation journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`glass-card p-8 relative ${
                tier.popular ? 'scale-105 border-primary/50' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="glass-button px-4 py-1 text-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold gradient-text mb-1">{tier.price}</div>
                <div className="text-white/60">{tier.minutes}</div>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block text-center py-3 px-6 rounded-full font-medium transition-all hover:scale-105 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-primary to-secondary text-white'
                    : 'glass-button text-white'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60">
            All plans auto-renew monthly. Cancel anytime. 100% satisfaction guaranteed.
          </p>
        </div>
      </div>
    </section>
  )
}