import type { Metadata } from 'next'
import { AdminBlogTable } from './AdminBlogTable'

export const metadata: Metadata = {
  title: 'Gerenciar Blog | Admin Freitas Outlet',
}

export default function AdminBlogPage() {
  return (
    <div className="p-6">
      <AdminBlogTable />
    </div>
  )
}
