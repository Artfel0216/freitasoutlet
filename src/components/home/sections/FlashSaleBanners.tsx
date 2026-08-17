'use client'

import Link from 'next/link'
import { products } from '@/data/products'
import { FlashSaleTimer } from '@/components/product/FlashSaleTimer'
import { getActiveFlashSales } from '@/lib/flash-sales'

export function FlashSaleBanners() {
  const activeFlashSales = getActiveFlashSales()

  if (activeFlashSales.length === 0) return null

  return (
    <div>
      {activeFlashSales.map((sale) => {
        const product = products.find((p) => p.slug === sale.productSlug)
        if (!product) return null
        return (
          <Link key={sale.productSlug} href={`/produtos/${sale.productSlug}`}>
            <FlashSaleTimer endsAt={sale.endsAt} label={sale.label} variant="banner" />
          </Link>
        )
      })}
    </div>
  )
}