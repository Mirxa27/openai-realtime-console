'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Brain, 
  Settings, 
  Database,
  Key,
  FileText,
  DollarSign,
  BarChart,
  LogOut,
  Sparkles,
  Globe
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '@/contexts/auth-context'

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/ai-config', icon: Brain, label: 'AI Configuration' },
  { href: '/admin/assessments', icon: FileText, label: 'Assessments' },
  { href: '/admin/content', icon: Sparkles, label: 'Content Management' },
  { href: '/admin/environment', icon: Key, label: 'Environment Settings' },
  { href: '/admin/site-settings', icon: Globe, label: 'Site Settings' },
  { href: '/admin/analytics', icon: BarChart, label: 'Analytics' },
  { href: '/admin/payments', icon: DollarSign, label: 'Payments' },
  { href: '/admin/database', icon: Database, label: 'Database' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Newomen Admin</h2>
      </div>

      <nav className="px-4 pb-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors',
                {
                  'bg-primary/20 text-white': isActive,
                  'text-gray-400 hover:text-white hover:bg-gray-700': !isActive,
                }
              )}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 w-full mt-8"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  )
}