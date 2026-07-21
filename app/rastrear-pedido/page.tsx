import type { Metadata } from 'next'
import { OrderTracker } from '@/components/order/OrderTracker'

export const metadata: Metadata = {
  title: 'Rastrear Pedido | Freitas Outlet',
  description: 'Acompanhe o status do seu pedido em tempo real.',
}

export default function RastrearPedidoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-2">
        Rastrear Pedido
      </h1>
      <p className="text-muted-foreground text-sm mb-8">
        Informe o número do pedido e o e-mail usado na compra para acompanhar o status.
      </p>
      <OrderTracker />
    </div>
  )
}
