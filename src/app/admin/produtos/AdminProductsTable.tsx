'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
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
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null)

  async function handleDelete(slug: string) {
    setDeletingSlug(slug)
    try {
      const res = await fetch('/api/admin/produtos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      if (!res.ok) throw new Error()
      toast.success('Produto excluído com sucesso')
      setConfirmSlug(null)
      window.location.reload()
    } catch {
      toast.error('Erro ao excluir produto')
    } finally {
      setDeletingSlug(null)
    }
  }

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
            const isDeleting = deletingSlug === product.slug
            const isConfirming = confirmSlug === product.slug

            return (
              <motion.tr
                key={product.slug}
                className={`border-b border-border/50 hover:bg-muted/30 transition-opacity ${isDeleting ? 'opacity-50' : ''}`}
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
                <td className="px-4 py-3 space-y-1">
                  <div>
                    <span className={`text-xs px-2 py-0.5 font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  {'offerStatus' in product && product.offerStatus && product.offerStatus !== 'none' && (
                    <div>
                      <span className={`text-xs px-2 py-0.5 font-medium inline-block ${
                        product.offerStatus === 'sale' ? 'bg-blue-100 text-blue-700' :
                        product.offerStatus === 'promotion' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {product.offerStatus === 'sale' ? 'Oferta' :
                         product.offerStatus === 'promotion' ? 'Promoção' : 'Queima'}
                      </span>
                    </div>
                  )}
                  {'featured' in product && product.featured && (
                    <div>
                      <span className="text-xs px-2 py-0.5 font-medium bg-zinc-100 text-zinc-700 inline-block">
                        Destaque
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <AnimatePresence mode="wait">
                    {isConfirming ? (
                      <motion.div
                        key="confirm"
                        className="flex items-center justify-end gap-2"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                      >
                        <button
                          onClick={() => handleDelete(product.slug)}
                          disabled={isDeleting}
                          className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? 'Excluindo...' : 'Confirmar'}
                        </button>
                        <button
                          onClick={() => setConfirmSlug(null)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancelar
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="actions"
                        className="flex items-center justify-end gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Link href={`/admin/produtos/${product.slug}/editar`} className="text-xs underline hover:no-underline">
                          Editar
                        </Link>
                        <button
                          onClick={() => setConfirmSlug(product.slug)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Excluir
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
