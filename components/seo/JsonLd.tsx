'use client'

import { useMemo } from 'react'
import type { Product } from '@/types'

interface ProductJsonLdProps {
  product: Product
  url: string
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const jsonLd = useMemo(() => {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images[0],
      url,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand.name,
      },
      offers: {
        '@type': 'Offer',
        url,
        priceCurrency: 'BRL',
        price: product.price.toFixed(2),
        availability: product.stock && Object.values(product.stock).some(s => s > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Freitas Outlet',
        },
      },
      category: product.category.name,
    }

    if (product.compareAtPrice && product.compareAtPrice > product.price) {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      ;(data.offers as Record<string, unknown>).priceValidUntil = futureDate.toISOString().split('T')[0]
    }

    return data
  }, [product, url])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Freitas Outlet',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: '/icon.svg',
    sameAs: [
      'https://instagram.com/freitasoutlet',
      'https://wa.me/5511999999999',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-9999',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
