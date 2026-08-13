import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getFilteredProducts } from '@/data/products'
import { ProductDetailClient } from './ProductDetailClient'
import { ProductGrid } from '@/components/product/ProductGrid'
import { queryOne } from '@/lib/database'

async function getDbProductBySlug(slug: string) {
  try {
    const row = await queryOne('SELECT * FROM products WHERE slug = $1 AND active = 1', [slug])
    if (!row) return null
    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      brand: { id: row.brand as string, name: row.brand as string, slug: row.brand as string, segment: 'premium' as const },
      category: { id: row.category as string, name: row.category as string, slug: row.category as string, parentId: null },
      description: row.description as string,
      price: Number(row.price),
      compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
      images: JSON.parse((row.images as string) || '[]'),
      video: (row.video as string) || '',
      colors: JSON.parse((row.colors as string) || '[]'),
      sizes: JSON.parse((row.sizes as string) || '[]'),
      sizeGuide: (row.size_guide as 'footwear' | 'shirt' | 'oversized' | 'pants') || 'shirt',
      tags: JSON.parse((row.tags as string) || '[]'),
      isNew: Boolean(row.is_new),
      isTrending: Boolean(row.is_trending),
      createdAt: row.created_at as string,
      stock: JSON.parse((row.stock as string) || '{}') as Record<string, number>,
    }
  } catch {
    return null
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const dbProduct = await getDbProductBySlug(slug)

  const hiddenRow = await queryOne<{ slug: string }>('SELECT slug FROM products WHERE slug = $1 AND active = 0', [slug]).catch(() => undefined)
  if (!dbProduct && hiddenRow) notFound()

  const staticProduct = !dbProduct ? getProductBySlug(slug) : null
  const product = dbProduct || staticProduct

  if (!product) notFound()

  const relatedProducts = getFilteredProducts({
    categories: [product.category.parentId || product.category.slug],
  }).filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link href="/produtos" className="hover:text-black transition-colors">Produtos</Link>
          <span>/</span>
          <Link href={`/categorias/${product.category.parentId || product.category.slug}`} className="hover:text-black transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>
      </div>

      <ProductDetailClient product={product} />

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 border-t border-border mt-12">
          <div className="mb-8">
            <h2 className="font-heading font-black text-2xl uppercase tracking-tighter">Produtos Relacionados</h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}
