import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBrandBySlug } from '@/data/brands'
import { getProductsByBrand } from '@/data/products/queries'
import { getPublicProducts } from '@/lib/public-products'
import { ProductGrid } from '@/components/product/ProductGrid'

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const brand = getBrandBySlug(slug)

  if (!brand) notFound()

  const allProducts = await getPublicProducts()
  const products = getProductsByBrand(allProducts, slug)

  const segmentLabels: Record<string, string> = {
    sportswear: 'Sportswear & Performance',
    premium: 'Premium & Casual',
    'high-end': 'High-End & Luxury',
    streetwear: 'Streetwear',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <Link href="/produtos" className="hover:text-black transition-colors">Marcas</Link>
        <span>/</span>
        <span className="text-black">{brand.name}</span>
      </nav>

      <div className="mb-8">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          {segmentLabels[brand.segment]}
        </p>
        <h1 className="font-heading font-black text-3xl lg:text-5xl uppercase tracking-tighter">
          {brand.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  )
}
