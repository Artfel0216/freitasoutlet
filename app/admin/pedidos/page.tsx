import { readOrders } from '@/lib/db'
import { AdminOrdersTable } from './AdminOrdersTable'

export default async function AdminOrdersPage() {
  const orders = await readOrders()
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div>
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Pedidos</h1>
      <AdminOrdersTable orders={sorted} />
    </div>
  )
}
