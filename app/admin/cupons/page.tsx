import type { Metadata } from 'next'
import { AdminCouponsTable } from './AdminCouponsTable'

export const metadata: Metadata = {
  title: 'Gerenciar Cupons | Admin Freitas Outlet',
}

export default function AdminCouponsPage() {
  return (
    <div className="p-6">
      <AdminCouponsTable />
    </div>
  )
}
