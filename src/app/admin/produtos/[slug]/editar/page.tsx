import { notFound } from 'next/navigation'
import type { Product, Brand } from '@/types'
import { products as staticProducts } from '@/data/products'
import { brands as staticBrands } from '@/data/brands'
import { getStoredProductBySlug, type StoredProduct } from '@/lib/admin-products'
import { readStoredBrands } from '@/lib/admin-brands'
import { AdminEditProductForm } from './Form'

export type EditableProduct = (Product | StoredProduct) & {
  isNew?: boolean
  isTrending?: boolean
  sizeGuide?: string
  compareAtPrice?: number | null
}

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const staticProduct = staticProducts.find((p) => p.slug === slug)
  const storedProduct = await getStoredProductBySlug(slug)

  const product = storedProduct || staticProduct

  if (!product) notFound()

  const storedBrands = await readStoredBrands()
  const allBrands: Brand[] = [
    ...storedBrands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, segment: b.segment as Brand['segment'] })),
    ...staticBrands.filter((b) => !storedBrands.some((s) => s.slug === b.slug)),
  ]

  return <AdminEditProductForm product={product as EditableProduct} brands={allBrands} />
}
