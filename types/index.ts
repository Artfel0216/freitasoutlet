export type ProductCategory = {
  id: string
  name: string
  slug: string
  parentId: string | null
  children?: ProductCategory[]
}

export type Brand = {
  id: string
  name: string
  slug: string
  logo?: string
  segment: 'sportswear' | 'premium' | 'high-end' | 'streetwear'
}

export type SizeGuide = {
  type: 'footwear' | 'shirt' | 'oversized' | 'pants'
  label: string
  measurements: { size: string; measurements: Record<string, string> }[]
  note?: string
}

export type ProductColor = {
  name: string
  hex: string
  image?: string
}

export type Product = {
  id: string
  name: string
  slug: string
  brand: Brand
  category: ProductCategory
  description: string
  price: number
  compareAtPrice?: number
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  sizeGuide: SizeGuide['type']
  tags: string[]
  isNew?: boolean
  isTrending?: boolean
  createdAt: string
  stock?: Record<string, number>
}

export type CartItem = {
  product: Product
  selectedSize: string
  selectedColor: ProductColor
  quantity: number
}

export type FilterState = {
  categories: string[]
  brands: string[]
  sizes: string[]
  colors: string[]
  minPrice: number
  maxPrice: number
  sort: 'relevance' | 'price-asc' | 'price-desc' | 'newest'
}
