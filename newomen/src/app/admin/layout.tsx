import { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminAuthGuard } from '@/components/admin/auth-guard'

export const metadata: Metadata = {
  title: 'Newomen Admin',
  description: 'Admin panel for Newomen platform',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-gray-900">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminAuthGuard>
  )
}