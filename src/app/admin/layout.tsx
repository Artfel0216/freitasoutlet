import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminSidebar } from './AdminSidebar'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session.authenticated) redirect('/admin/login')

  return (
    <div className="min-h-dvh flex">
      <AdminSidebar />
      <div className="flex-1 bg-muted/30">
        <header className="h-14 border-b border-border bg-white flex items-center px-6">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-heading font-black tracking-tighter">FREITAS OUTLET</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Admin</span>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
