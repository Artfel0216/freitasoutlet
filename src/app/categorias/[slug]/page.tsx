import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getAllChildSlugs } from '@/data/categories'
import { getFilteredProducts } from '@/data/products/queries'
import { getPublicProducts } from '@/lib/public-products'
import { ProductGrid } from '@/components/product/ProductGrid'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)

  if (!category) notFound()

  const childSlugs = getAllChildSlugs(slug)
  const allProducts = await getPublicProducts()
  const products = getFilteredProducts(allProducts, { categories: childSlugs })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <span>/</span>
        <span className="text-black">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter">
          {category.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'}
        </p>
      </div>

      {category.children && (
        <div className="flex flex-wrap gap-2 mb-8">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/categorias/${child.slug}`}
              className="text-xs uppercase tracking-wider font-heading font-bold px-4 py-2 border border-border hover:border-black transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <ProductGrid products={products} />
    </div>
  )
}
