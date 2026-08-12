'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { brands } from '@/data/brands'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import { Button } from '@/components/ui/Button'
import type { ProductColor } from '@/types'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

interface ProductFiltersProps {
  isOpen: boolean
  onClose: () => void
}

const allColors: ProductColor[] = Array.from(
  new Map(products.flatMap((p) => p.colors).map((c) => [c.hex, c])).values()
).sort((a, b) => a.name.localeCompare(b.name))

export function ProductFilters({ isOpen, onClose }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeCategories = searchParams.getAll('categoria')
  const activeBrands = searchParams.getAll('marca')
  const activeSizes = searchParams.getAll('tamanho')
  const activeColors = searchParams.getAll('cor')
  const sort = searchParams.get('sort') || 'relevance'

  const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minPreco') || '')
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxPreco') || '')
  const debouncedMinPrice = useDebounce(minPriceInput, 500)
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500)

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    if (debouncedMinPrice) {
      params.set('minPreco', debouncedMinPrice)
    } else {
      params.delete('minPreco')
    }
    if (debouncedMaxPrice) {
      params.set('maxPreco', debouncedMaxPrice)
    } else {
      params.delete('maxPreco')
    }

    const currentPath = `/produtos${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    const nextPath = `/produtos${params.toString() ? `?${params.toString()}` : ''}`
    if (currentPath === nextPath) return

    router.push(nextPath)
  }, [debouncedMinPrice, debouncedMaxPrice, router, searchParams])

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const current = params.getAll(key)

    if (current.includes(value)) {
      params.delete(key)
      current.filter((v) => v !== value).forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }

    router.push(`/produtos?${params.toString()}`)
  }

  function setSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/produtos?${params.toString()}`)
  }

  function clearFilters() {
    router.push('/produtos')
  }

  const hasActiveFilters = activeCategories.length > 0 || activeBrands.length > 0 || activeSizes.length > 0 || activeColors.length > 0 || !!searchParams.get('minPreco') || !!searchParams.get('maxPreco')

  const allSizes = ['P', 'M', 'G', 'GG', 'XGG', '36', '37', '38', '39', '40', '41', '42', '43', '44', 'Único']

  const filterContent = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg uppercase tracking-wider">Filtros</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs underline hover:no-underline">
            Limpar todos
          </button>
        )}
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { value: 'relevance', label: 'Relevância' },
            { value: 'price-asc', label: 'Menor Preço' },
            { value: 'price-desc', label: 'Maior Preço' },
            { value: 'newest', label: 'Mais Recentes' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="sort"
                checked={sort === option.value}
                onChange={() => setSort(option.value)}
                className="accent-black"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id}>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={activeCategories.includes(cat.slug)}
                  onChange={() => updateFilter('categoria', cat.slug)}
                  className="accent-black"
                />
                {cat.name}
              </label>
              {cat.children && (
                <div className="ml-6 mt-1 space-y-1">
                  {cat.children.map((child) => (
                    <label key={child.id} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={activeCategories.includes(child.slug)}
                        onChange={() => updateFilter('categoria', child.slug)}
                        className="accent-black"
                      />
                      {child.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Marcas</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={activeBrands.includes(brand.slug)}
                onChange={() => updateFilter('marca', brand.slug)}
                className="accent-black"
              />
              {brand.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Faixa de Preço</h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-sm border border-border focus:border-black outline-none"
            />
          </div>
          <span className="text-xs text-muted-foreground">—</span>
          <div className="relative flex-1">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">R$</span>
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full pl-7 pr-2 py-1.5 text-sm border border-border focus:border-black outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Cor</h3>
        <div className="flex flex-wrap gap-2">
          {allColors.map((color) => {
            const isActive = activeColors.includes(color.hex)
            const isWhite = color.hex.toUpperCase() === '#FFFFFF'
            return (
              <button
                key={color.hex}
                onClick={() => updateFilter('cor', color.hex)}
                title={color.name}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  isActive ? 'border-black scale-110' : 'border-border hover:border-black'
                } ${isWhite ? 'shadow-inner' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Tamanho</h3>
        <div className="grid grid-cols-4 gap-1">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => updateFilter('tamanho', size)}
              className={`text-xs py-1 border transition-colors ${
                activeSizes.includes(size) ? 'bg-black text-white border-black' : 'border-border hover:border-black'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">{filterContent}</aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto p-6">
            <div className="flex justify-end mb-4">
              <button onClick={onClose} className="p-1" aria-label="Fechar filtros">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {filterContent}
            <div className="mt-6">
              <Button variant="primary" fullWidth onClick={onClose}>
                Ver Resultados
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
