'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

export interface FiltersController {
  activeCategories: string[]
  activeBrands: string[]
  activeSizes: string[]
  activeColors: string[]
  sort: string
  minPriceInput: string
  maxPriceInput: string
  hasActiveFilters: boolean
  updateFilter: (key: string, value: string) => void
  setSort: (value: string) => void
  clearFilters: () => void
  setMinPriceInput: (value: string) => void
  setMaxPriceInput: (value: string) => void
}

export function useProductFilters(): FiltersController {
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

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBrands.length > 0 ||
    activeSizes.length > 0 ||
    activeColors.length > 0 ||
    !!searchParams.get('minPreco') ||
    !!searchParams.get('maxPreco')

  return {
    activeCategories,
    activeBrands,
    activeSizes,
    activeColors,
    sort,
    minPriceInput,
    maxPriceInput,
    hasActiveFilters,
    updateFilter,
    setSort,
    clearFilters,
    setMinPriceInput,
    setMaxPriceInput,
  }
}