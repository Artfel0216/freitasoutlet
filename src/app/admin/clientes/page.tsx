import type { Metadata } from 'next'
import { AdminCustomersTable } from './AdminCustomersTable'

export const metadata: Metadata = {
  title: 'Gerenciar Clientes | Admin Freitas Outlet',
}

export default function AdminCustomersPage() {
  return (
    <div className="p-6">
      <AdminCustomersTable />
    </div>
  )
}
