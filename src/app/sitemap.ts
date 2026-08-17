import type { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { brands } from '@/data/brands'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://freitasoutlet.com.br').replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${siteUrl}/produtos`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/carrinho`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${siteUrl}/checkout`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: `${siteUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${siteUrl}/guia-de-medidas`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: `${siteUrl}/politica-de-privacidade`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${siteUrl}/termos-de-uso`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
  ]

  const productPages = products.map((p) => ({
    url: `${siteUrl}/produtos/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages = categories.flatMap((cat) => [
    { url: `${siteUrl}/categorias/${cat.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...(cat.children?.map((child) => ({
      url: `${siteUrl}/categorias/${child.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []),
  ])

  const brandPages = brands.map((b) => ({
    url: `${siteUrl}/marcas/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages]
}
