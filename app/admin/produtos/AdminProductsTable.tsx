'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import type { StoredProduct } from '@/lib/admin-products'

interface AdminProductsTableProps {
  products: (Product | StoredProduct)[]
}

function isActive(p: Product | StoredProduct): boolean {
  if ('active' in p) return (p as StoredProduct).active !== false
  return true
}

export function AdminProductsTable({ products }: AdminProductsTableProps) {
  return (
    <div className="border border-border bg-white overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Produto</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Marca</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Preço</th>
            <th className="text-left px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Status</th>
            <th className="text-right px-4 py-3 font-heading font-bold text-xs uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, i) => {
            const active = isActive(product)

            return (
              <motion.tr
                key={product.slug}
                className="border-b border-border/50 hover:bg-muted/30"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.brand.name}</td>
                <td className="px-4 py-3 font-medium">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/produtos/${product.slug}/editar`} className="text-xs underline hover:no-underline">
                    Editar
                  </Link>
                </td>
              </motion.tr>
            )
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto cadastrado.</p>
          <Link href="/admin/produtos/novo" className="text-sm underline hover:no-underline mt-2 inline-block">
            Adicionar primeiro produto
          </Link>
        </div>
      )}
    </div>
  )
}
