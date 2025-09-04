import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'
import { MobileNav } from '@/components/layout/mobile-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Newomen - Your AI Companion for Personal Growth',
  description: 'An emotionally intelligent companion designed to support women\'s personal growth journeys through culturally-sensitive conversations and transformative guidance.',
  keywords: 'AI companion, personal growth, mental wellness, narrative identity, women empowerment',
  openGraph: {
    title: 'Newomen - Your AI Companion for Personal Growth',
    description: 'Transform your personal story with AI-powered guidance',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="relative min-h-screen">
            {/* Background effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 liquid-shape" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 liquid-shape" style={{ animationDelay: '5s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 liquid-shape" style={{ animationDelay: '2.5s' }} />
            </div>
            
            {/* Main content */}
            <main className="relative z-10">
              {children}
            </main>
            
            {/* Mobile navigation */}
            <MobileNav />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}