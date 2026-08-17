import type { Product } from '@/types'

export interface ProductFilters {
  categories?: string[]
  brands?: string[]
  sizes?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: string
  search?: string
}

export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(products: Product[], categorySlug: string): Product[] {
  return products.filter(
    (p) => p.category.slug === categorySlug || p.category.parentId === categorySlug,
  )
}

export function getProductsByBrand(products: Product[], brandSlug: string): Product[] {
  return products.filter((p) => p.brand.slug === brandSlug)
}

export function getFilteredProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q)),
    )
  }

  if (filters.categories?.length) {
    result = result.filter(
      (p) =>
        filters.categories!.includes(p.category.slug) ||
        filters.categories!.includes(p.category.parentId!),
    )
  }

  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand.slug))
  }

  if (filters.sizes?.length) {
    result = result.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)))
  }

  if (filters.colors?.length) {
    result = result.filter((p) => p.colors.some((c) => filters.colors!.includes(c.hex)))
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  sortProducts(result, filters.sort)

  return result
}

function sortProducts(products: Product[], sort?: string): void {
  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      break
  }
}