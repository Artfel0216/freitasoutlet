import type { StoredProduct } from '@/lib/admin-products'

export interface ProductFormData {
  name: string
  slug: string
  brand: StoredProduct['brand']
  category: StoredProduct['category']
  description: string
  price: number
  compareAtPrice: number | null
  video: string
  sizes: string[]
  colors: { name: string; hex: string }[]
  sizeGuide: string
  tags: string[]
  isNew: boolean
  isTrending: boolean
  offerStatus: StoredProduct['offerStatus']
  offerType: StoredProduct['offerType']
  offerDiscount: number
  featured: boolean
  active: boolean
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function readString(formData: FormData, key: string, fallback = ''): string {
  return (formData.get(key) as string) || fallback
}

function readNumber(formData: FormData, key: string): number {
  return Number(formData.get(key))
}

function readNullableNumber(formData: FormData, key: string): number | null {
  return formData.get(key) ? Number(formData.get(key)) : null
}

function readJsonArray<T>(formData: FormData, key: string): T[] {
  try {
    return JSON.parse(readString(formData, key, '[]')) as T[]
  } catch {
    return []
  }
}

function readTags(formData: FormData): string[] {
  return readString(formData, 'tags')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

function readBoolean(formData: FormData, key: string): boolean {
  return formData.get(key) === 'true'
}

function readActive(formData: FormData): boolean {
  return formData.get('active') !== 'false'
}

export function parseProductFormData(formData: FormData, opts?: { deriveSlug?: boolean }): ProductFormData {
  const name = readString(formData, 'name')
  const brandSlug = readString(formData, 'brandSlug')
  const categorySlug = readString(formData, 'categorySlug')
  const deriveSlug = opts?.deriveSlug ?? true

  return {
    name,
    slug: deriveSlug ? slugify(name) : readString(formData, 'slug'),
    brand: {
      id: readString(formData, 'brandId') || brandSlug,
      name: readString(formData, 'brandName'),
      slug: brandSlug,
      segment: readString(formData, 'brandSegment', 'premium'),
    },
    category: {
      id: readString(formData, 'categoryId') || categorySlug,
      name: readString(formData, 'categoryName'),
      slug: categorySlug,
      parentId: readString(formData, 'categoryParentSlug') || null,
    },
    description: readString(formData, 'description'),
    price: readNumber(formData, 'price'),
    compareAtPrice: readNullableNumber(formData, 'compareAtPrice'),
    video: readString(formData, 'video'),
    sizes: readJsonArray<string>(formData, 'sizes'),
    colors: readJsonArray<{ name: string; hex: string }>(formData, 'colors'),
    sizeGuide: readString(formData, 'sizeGuide', 'shirt'),
    tags: readTags(formData),
    isNew: readBoolean(formData, 'isNew'),
    isTrending: readBoolean(formData, 'isTrending'),
    offerStatus: (readString(formData, 'offerStatus', 'none') as StoredProduct['offerStatus']),
    offerType: (readString(formData, 'offerType', 'none') as StoredProduct['offerType']),
    offerDiscount: readNumber(formData, 'offerDiscount'),
    featured: readBoolean(formData, 'featured'),
    active: readActive(formData),
  }
}