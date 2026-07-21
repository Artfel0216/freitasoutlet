import Link from 'next/link'
import type { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { readStoredProducts, type StoredProduct } from '@/lib/admin-products'
import { Button } from '@/components/ui/Button'
import { AdminProductsTable } from './AdminProductsTable'

export default async function AdminProductsPage() {
  const storedProducts = await readStoredProducts()
  const allProducts: (Product | StoredProduct)[] = [
    ...storedProducts.filter((sp) => !staticProducts.some((p) => p.slug === sp.slug)),
    ...staticProducts,
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">Produtos</h1>
          <p className="text-sm text-muted-foreground mt-1">{allProducts.length} produtos no catálogo</p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button variant="primary" size="sm">NOVO PRODUTO</Button>
        </Link>
      </div>

      <AdminProductsTable products={allProducts} />
    </div>
  )
}
