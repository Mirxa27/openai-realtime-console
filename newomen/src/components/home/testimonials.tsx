'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Growth Tier Member',
    content: 'NewMe has completely transformed how I understand myself. The narrative exploration helped me identify patterns I never noticed before.',
    rating: 5,
    avatar: '👩🏽',
  },
  {
    name: 'Fatima A.',
    role: 'Transformation Tier Member',
    content: 'As someone from a Middle Eastern background, I appreciate how culturally sensitive the conversations are. It feels like talking to a wise friend.',
    rating: 5,
    avatar: '🧕🏻',
  },
  {
    name: 'Emily R.',
    role: 'Growth Tier Member',
    content: 'The voice conversations feel so natural! I love earning crystals and seeing my progress visualized. It makes personal growth feel achievable.',
    rating: 5,
    avatar: '👩🏼',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stories of <span className="gradient-text">Transformation</span>
          </h2>
          <p className="text-xl text-white/70">
            Join thousands of women who have rewritten their personal narratives
          </p>
        </div>

        <div className="relative">
          <div className="glass-card p-8 md:p-12">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            
            <p className="text-lg text-white/90 mb-6 italic">
              "{testimonials[currentIndex].content}"
            </p>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">{testimonials[currentIndex].avatar}</div>
              <div>
                <div className="font-semibold text-white">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-white/60">
                  {testimonials[currentIndex].role}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="glass rounded-full p-3 hover:scale-110 transition-transform"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-white'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="glass rounded-full p-3 hover:scale-110 transition-transform"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}