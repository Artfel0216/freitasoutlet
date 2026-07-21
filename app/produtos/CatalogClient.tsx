'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Product } from '@/types'
import { ProductFilters } from '@/components/product/ProductFilters'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Button } from '@/components/ui/Button'
import { fadeUp } from '@/components/animations'
import { brands } from '@/data/brands'
import { categories } from '@/data/categories'
import { products as allProducts } from '@/data/products'
import { ProductGridSkeleton } from '@/components/Skeleton'

const ITEMS_PER_PAGE = 12

interface CatalogClientProps {
  products: Product[]
  totalCount: number
}

function ActiveFilterBadges() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const badges: { key: string; value: string; label: string }[] = []

  for (const cat of searchParams.getAll('categoria')) {
    const found = categories.find((c) => c.slug === cat)
    badges.push({ key: 'categoria', value: cat, label: found?.name || cat })
  }

  for (const brand of searchParams.getAll('marca')) {
    const found = brands.find((b) => b.slug === brand)
    badges.push({ key: 'marca', value: brand, label: found?.name || brand })
  }

  for (const size of searchParams.getAll('tamanho')) {
    badges.push({ key: 'tamanho', value: size, label: `Tam: ${size}` })
  }

  for (const color of searchParams.getAll('cor')) {
    const found = allProducts.flatMap((p) => p.colors).find((c) => c.hex === color)
    badges.push({ key: 'cor', value: color, label: found?.name || color })
  }

  const minPreco = searchParams.get('minPreco')
  const maxPreco = searchParams.get('maxPreco')
  if (minPreco) {
    badges.push({ key: 'minPreco', value: minPreco, label: `Min: R$ ${minPreco}` })
  }
  if (maxPreco) {
    badges.push({ key: 'maxPreco', value: maxPreco, label: `Max: R$ ${maxPreco}` })
  }

  function removeBadge(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    for (const v of searchParams.getAll(key)) {
      if (v !== value) {
        params.append(key, v)
      }
    }
    router.push(`/produtos?${params.toString()}`)
  }

  const sort = searchParams.get('sort')
  if (sort && sort !== 'relevance') {
    const labels: Record<string, string> = { 'price-asc': 'Menor Preço', 'price-desc': 'Maior Preço', newest: 'Mais Recentes' }
    badges.push({ key: 'sort', value: sort, label: labels[sort] || sort })
  }

  if (badges.length === 0) return null

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {badges.map((badge) => (
        <span
          key={`${badge.key}-${badge.value}`}
          className="inline-flex items-center gap-1.5 text-xs bg-black text-white px-3 py-1.5"
        >
          {badge.label}
          <button
            onClick={() => removeBadge(badge.key, badge.value)}
            className="hover:opacity-70"
            aria-label={`Remover filtro ${badge.label}`}
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
    </motion.div>
  )
}

export function CatalogClient({ products, totalCount }: CatalogClientProps) {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = useCallback(async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 300))
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
    setIsLoading(false)
  }, [])

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-center justify-between mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter">
            Produtos
          </h1>
          <motion.p
            className="text-sm text-muted-foreground mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {totalCount} {totalCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
            FILTROS
          </Button>
        </motion.div>
      </motion.div>

      <div className="flex gap-8">
        <ProductFilters isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} />
        <div className="flex-1 min-w-0">
          <ActiveFilterBadges />
          {isLoading ? (
            <ProductGridSkeleton count={ITEMS_PER_PAGE} />
          ) : (
            <>
              <ProductGrid products={visibleProducts} />
              {hasMore && (
                <motion.div
                  className="mt-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    className="px-8"
                  >
                    Carregar mais ({products.length - visibleCount} restantes)
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
