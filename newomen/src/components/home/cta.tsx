import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 liquid-shape" />
            <div className="absolute bottom-0 right-0 w-64 h-64 liquid-shape" style={{ animationDelay: '5s' }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to <span className="gradient-text">Transform Your Story?</span>
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of women who are rewriting their narratives and discovering their true potential with NewMe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="glass-button flex items-center justify-center gap-2 text-white hover:gap-3 transition-all"
              >
                Start Your Free Journey
                <ArrowRight size={20} />
              </Link>
              
              <Link
                href="/about"
                className="glass px-6 py-3 rounded-full text-white/90 hover:text-white transition-colors"
              >
                Learn More About Newomen
              </Link>
            </div>

            <p className="mt-8 text-sm text-white/60">
              No credit card required • 10 free minutes • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}