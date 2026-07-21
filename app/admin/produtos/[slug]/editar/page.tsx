import { notFound } from 'next/navigation'
import type { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { getStoredProductBySlug, type StoredProduct } from '@/lib/admin-products'
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

  return <AdminEditProductForm product={product as EditableProduct} />
}
