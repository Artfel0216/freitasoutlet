import { getRevenueData } from '@/lib/revenue'
import { readOrders } from '@/lib/db'
import { readStoredProducts } from '@/lib/admin-products'
import { products as staticProducts } from '@/data/products'
import { DashboardClient } from './DashboardClient'

export default async function AdminDashboardPage() {
  const [weekly, monthly, yearly, allOrders, storedProducts] = await Promise.all([
    getRevenueData('weekly'),
    getRevenueData('monthly'),
    getRevenueData('yearly'),
    readOrders(),
    readStoredProducts(),
  ])

  const totalProducts = staticProducts.length + storedProducts.length
  const totalRevenue = allOrders
    .filter((o) => o.status !== 'rejected')
    .reduce((sum, o) => sum + o.total, 0)
  const totalOrders = allOrders.length
  const pendingOrders = allOrders.filter((o) => o.status === 'pending').length

  return (
    <div>
      <h1 className="font-heading font-black text-2xl uppercase tracking-tighter mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, desc: 'Todos os pedidos' },
          { label: 'Pedidos', value: String(totalOrders), desc: `${pendingOrders} pendentes` },
          { label: 'Ticket Médio', value: `R$ ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2).replace('.', ',') : '0,00'}`, desc: 'Por pedido' },
          { label: 'Pendentes', value: String(pendingOrders), desc: 'Aguardando pagamento' },
        ].map((card) => (
          <div key={card.label} className="border border-border bg-white p-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
            <p className="font-heading font-black text-2xl mb-1">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.desc}</p>
          </div>
        ))}
      </div>

      <DashboardClient weekly={weekly} monthly={monthly} yearly={yearly} productCount={totalProducts} />
    </div>
  )
}
