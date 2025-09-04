'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageCircle, Trophy, User, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/contexts/auth-context'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/explore', icon: Sparkles, label: 'Explore' },
  { href: '/achievements', icon: Trophy, label: 'Progress' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function MobileNav() {
  const pathname = usePathname()
  const { profile } = useAuth()

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null

  return (
    <nav className="mobile-nav">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all',
                {
                  'text-white': isActive,
                  'text-white/60 hover:text-white/80': !isActive,
                }
              )}
            >
              <div className="relative">
                <Icon size={24} />
                {item.href === '/chat' && profile && profile.minutesRemaining > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full" />
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}