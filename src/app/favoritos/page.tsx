'use client'

import { useWishlist } from '@/lib/wishlist-context'
import { products } from '@/data/products'
import { ProductGrid } from '@/components/product/ProductGrid'
import Link from 'next/link'

export default function FavoritosPage() {
  const { items } = useWishlist()
  const wishlistProducts = products.filter((p) => items.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-2">
        Favoritos
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {wishlistProducts.length} {wishlistProducts.length === 1 ? 'produto salvo' : 'produtos salvos'}
      </p>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-2">Você ainda não tem favoritos.</p>
          <Link href="/produtos" className="text-sm underline hover:no-underline">VER PRODUTOS</Link>
        </div>
      ) : (
        <ProductGrid products={wishlistProducts} />
      )}
    </div>
  )
}
