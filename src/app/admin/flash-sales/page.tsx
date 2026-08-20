'use client'

import { useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { flashSales, type FlashSale } from '@/lib/flash-sales'
import { products } from '@/data/products'
import { Button } from '@/components/ui/Button'

function subscribe() {
  return () => {}
}

function getClientNow() {
  return Date.now()
}

function getServerNow() {
  return Date.now()
}

function ExpiresIn({ endsAt }: { endsAt: string }) {
  const now = useSyncExternalStore(subscribe, getClientNow, getServerNow)
  const expiresIn = Math.max(0, Math.round((new Date(endsAt).getTime() - now) / (1000 * 60 * 60)))

  if (expiresIn === 0) return <span className="text-xs text-red-600">Expirada</span>
  return <span className="text-xs">{expiresIn}h restantes</span>
}

export default function AdminFlashSalesPage() {
  const [sales, setSales] = useState<FlashSale[]>(flashSales)

  const handleAddSale = () => {
    const product = products.find((p) => !sales.some((s) => s.productSlug === p.slug))
    if (!product) return
    const newSale: FlashSale = {
      productSlug: product.slug,
      discountPercent: 20,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      label: 'OFERTA RELÂMPAGO',
    }
    setSales([...sales, newSale])
  }

  const handleRemove = (slug: string) => {
    setSales(sales.filter((s) => s.productSlug !== slug))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">Ofertas Relâmpago</h1>
          <p className="text-sm text-muted-foreground mt-1">{sales.length} ofertas ativas</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleAddSale}>
          NOVA OFERTA
        </Button>
      </div>

      <div className="border border-border bg-white overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Produto</th>
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Desconto</th>
              <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Expira em</th>
              <th className="text-right px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale, i) => {
              const product = products.find((p) => p.slug === sale.productSlug)

              return (
                <motion.tr
                  key={sale.productSlug}
                  className="border-b border-border/50 hover:bg-muted/30"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{product?.name || sale.productSlug}</p>
                    <p className="text-xs text-muted-foreground">{sale.productSlug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-red-600 font-bold">-{sale.discountPercent}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <ExpiresIn endsAt={sale.endsAt} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRemove(sale.productSlug)}
                      className="text-xs underline hover:no-underline text-red-600"
                    >
                      Remover
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>

        {sales.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma oferta relâmpago ativa.</p>
            <button onClick={handleAddSale} className="text-sm underline hover:no-underline mt-2 inline-block">
              Criar primeira oferta
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
