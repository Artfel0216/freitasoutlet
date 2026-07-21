import 'server-only'
import { readOrders } from './db'

export type RevenuePeriod = 'weekly' | 'monthly' | 'yearly'

export type RevenueData = {
  total: number
  orders: number
  averageTicket: number
  byPeriod: { label: string; revenue: number; orders: number }[]
}

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export async function getRevenueData(period: RevenuePeriod): Promise<RevenueData> {
  const orders = await readOrders()
  const now = new Date()

  const cutoff = new Date(now)
  if (period === 'weekly') cutoff.setDate(cutoff.getDate() - 7)
  else if (period === 'monthly') cutoff.setMonth(cutoff.getMonth() - 6)
  else cutoff.setFullYear(cutoff.getFullYear() - 2)

  const filtered = orders.filter((o) => {
    const date = new Date(o.createdAt)
    return date >= cutoff && date <= now && o.status !== 'rejected'
  })

  const total = filtered.reduce((sum, o) => sum + o.total, 0)
  const orderCount = filtered.length
  const avgTicket = orderCount > 0 ? total / orderCount : 0

  const grouped = new Map<string, { revenue: number; orders: number }>()

  for (const order of filtered) {
    const date = new Date(order.createdAt)
    let key: string
    if (period === 'weekly') {
      key = date.toLocaleDateString('pt-BR', { weekday: 'short' })
    } else if (period === 'monthly') {
      key = `${monthNames[date.getMonth()]}`
    } else {
      key = String(date.getFullYear())
    }

    const existing = grouped.get(key) || { revenue: 0, orders: 0 }
    existing.revenue += order.total
    existing.orders += 1
    grouped.set(key, existing)
  }

  const periodOrder = period === 'monthly'
    ? Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now)
        d.setMonth(d.getMonth() - (5 - i))
        return monthNames[d.getMonth()]
      })
    : period === 'weekly'
    ? ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'].map((_, i) => {
        const d = new Date(now)
        d.setDate(d.getDate() - (6 - i))
        return d.toLocaleDateString('pt-BR', { weekday: 'short' })
      })
    : Array.from({ length: 3 }, (_, i) => String(now.getFullYear() - (2 - i)))

  const byPeriod = periodOrder.map((label) => ({
    label,
    revenue: grouped.get(label)?.revenue || 0,
    orders: grouped.get(label)?.orders || 0,
  }))

  return { total, orders: orderCount, averageTicket: avgTicket, byPeriod }
}
