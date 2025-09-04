import { Metadata } from 'next'
import { Hero } from '@/components/home/hero'
import { Features } from '@/components/home/features'
import { Testimonials } from '@/components/home/testimonials'
import { Pricing } from '@/components/home/pricing'
import { CTA } from '@/components/home/cta'

export const metadata: Metadata = {
  title: 'Newomen - Transform Your Story',
  description: 'Your AI companion for personal growth and narrative transformation',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  )
}