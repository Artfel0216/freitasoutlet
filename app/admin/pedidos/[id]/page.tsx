import { getOrderById } from '@/lib/db'
import { notFound } from 'next/navigation'
import { AdminOrderDetail } from './AdminOrderDetail'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  return <AdminOrderDetail order={order} />
}
