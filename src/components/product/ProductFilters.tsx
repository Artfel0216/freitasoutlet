'use client'

import { brands } from '@/data/brands'
import { categories } from '@/data/categories'
import { Button } from '@/components/ui/Button'
import { useProductFilters } from './filters/use-product-filters'
import { FilterCheckboxList } from './filters/FilterCheckboxList'
import { SortOptions } from './filters/SortOptions'
import { PriceRangeFilter } from './filters/PriceRangeFilter'
import { ColorFilter, SizeFilter } from './filters/ColorSizeFilter'

interface ProductFiltersProps {
  isOpen: boolean
  onClose: () => void
}

export function ProductFilters({ isOpen, onClose }: ProductFiltersProps) {
  const f = useProductFilters()

  const filterContent = (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-bold text-lg uppercase tracking-wider">Filtros</h2>
        {f.hasActiveFilters && (
          <button onClick={f.clearFilters} className="text-xs underline hover:no-underline">
            Limpar todos
          </button>
        )}
      </div>

      <SortOptions value={f.sort} onChange={f.setSort} />

      <FilterCheckboxList
        title="Categorias"
        items={categories}
        active={f.activeCategories}
        onToggle={(slug) => f.updateFilter('categoria', slug)}
      />

      <FilterCheckboxList
        title="Marcas"
        items={brands}
        active={f.activeBrands}
        onToggle={(slug) => f.updateFilter('marca', slug)}
        scrollable
      />

      <PriceRangeFilter
        minPriceInput={f.minPriceInput}
        maxPriceInput={f.maxPriceInput}
        setMinPriceInput={f.setMinPriceInput}
        setMaxPriceInput={f.setMaxPriceInput}
      />

      <ColorFilter active={f.activeColors} onToggle={(hex) => f.updateFilter('cor', hex)} />
      <SizeFilter active={f.activeSizes} onToggle={(size) => f.updateFilter('tamanho', size)} />
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