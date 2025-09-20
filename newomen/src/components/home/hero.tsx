'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

export function Hero() {
  const { user } = useAuth()

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8 inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-white/90">AI-Powered Personal Growth</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          Transform Your{' '}
          <span className="gradient-text">Personal Story</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
          Meet NewMe, your emotionally intelligent AI companion designed to support your journey through culturally-sensitive conversations and transformative guidance.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={user ? '/chat' : '/auth/signup'}
            className="glass-button flex items-center justify-center gap-2 text-white hover:gap-3 transition-all"
          >
            {user ? 'Continue Your Journey' : 'Start Your Journey'}
            <ArrowRight size={20} />
          </Link>
          
          <Link
            href="/explore"
            className="glass px-6 py-3 rounded-full text-white/90 hover:text-white transition-colors"
          >
            Explore Free Assessments
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">10K+</div>
            <div className="text-sm text-white/60">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">98%</div>
            <div className="text-sm text-white/60">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-white/60">Available Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}