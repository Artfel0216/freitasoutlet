import type { Metadata } from 'next'
import { AdminReturnsTable } from './AdminReturnsTable'

export const metadata: Metadata = {
  title: 'Devoluções | Admin Freitas Outlet',
}

export default function AdminReturnsPage() {
  return (
    <div>
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Devoluções / Trocas</h1>
      <AdminReturnsTable />
    </div>
  )
}
