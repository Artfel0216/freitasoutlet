import { Suspense } from 'react'
import { getFilteredProducts } from '@/data/products/queries'
import { getPublicProducts } from '@/lib/public-products'
import { CatalogClient } from './CatalogClient'
import { ProductGridSkeleton } from '@/components/Skeleton'

async function CatalogContent({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams

  const filters = {
    categories: typeof params.categoria === 'string' ? [params.categoria] : params.categoria || [],
    brands: typeof params.marca === 'string' ? [params.marca] : params.marca || [],
    sizes: typeof params.tamanho === 'string' ? [params.tamanho] : params.tamanho || [],
    colors: typeof params.cor === 'string' ? [params.cor] : params.cor || [],
    minPrice: typeof params.minPreco === 'string' ? Number(params.minPreco) : undefined,
    maxPrice: typeof params.maxPreco === 'string' ? Number(params.maxPreco) : undefined,
    sort: typeof params.sort === 'string' ? params.sort : 'relevance',
  }

  const allProducts = await getPublicProducts()
  const filteredProducts = getFilteredProducts(allProducts, filters)

  return <CatalogClient products={filteredProducts} totalCount={filteredProducts.length} />
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 bg-muted rounded" />
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    }>
      <CatalogContent searchParams={searchParams} />
    </Suspense>
  )
}
