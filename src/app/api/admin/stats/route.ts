import { NextResponse } from 'next/server'
import { readOrders } from '@/lib/db'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const orders = await readOrders()
  const now = new Date()

  const PAID_STATUSES = new Set(['approved', 'shipped', 'delivered'])
  const ACTIVE_STATUSES = new Set(['pending', 'approved', 'shipped', 'delivered'])

  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(now)
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  const yearAgo = new Date(now)
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)

  const weeklyOrders = orders.filter((o) => new Date(o.createdAt) >= weekAgo && ACTIVE_STATUSES.has(o.status))
  const monthlyOrders = orders.filter((o) => new Date(o.createdAt) >= monthAgo && ACTIVE_STATUSES.has(o.status))
  const yearlyOrders = orders.filter((o) => new Date(o.createdAt) >= yearAgo && ACTIVE_STATUSES.has(o.status))

  const weeklyRevenue = orders.filter((o) => new Date(o.createdAt) >= weekAgo && PAID_STATUSES.has(o.status)).reduce((s, o) => s + o.total, 0)
  const monthlyRevenue = orders.filter((o) => new Date(o.createdAt) >= monthAgo && PAID_STATUSES.has(o.status)).reduce((s, o) => s + o.total, 0)
  const yearlyRevenue = orders.filter((o) => new Date(o.createdAt) >= yearAgo && PAID_STATUSES.has(o.status)).reduce((s, o) => s + o.total, 0)

  const pendingCount = orders.filter((o) => o.status === 'pending').length
  const fraudRejections = orders.filter((o) => o.fraudAnalysis?.status === 'rejected').length

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .map((o) => ({
      orderNumber: o.orderNumber,
      customer: o.customer.name,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
    }))

  return NextResponse.json({
    weekly: { revenue: weeklyRevenue, orders: weeklyOrders.length },
    monthly: { revenue: monthlyRevenue, orders: monthlyOrders.length },
    yearly: { revenue: yearlyRevenue, orders: yearlyOrders.length },
    pendingOrders: pendingCount,
    fraudRejections,
    recentOrders,
    totalOrders: orders.length,
  })
}
