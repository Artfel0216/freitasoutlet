import type { MetadataRoute } from 'next'
import { products } from '@/data/products'
import { categories } from '@/data/categories'
import { brands } from '@/data/brands'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: 'https://freitasoutlet.com.br', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: 'https://freitasoutlet.com.br/produtos', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: 'https://freitasoutlet.com.br/carrinho', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: 'https://freitasoutlet.com.br/checkout', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.3 },
    { url: 'https://freitasoutlet.com.br/sobre', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://freitasoutlet.com.br/contato', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: 'https://freitasoutlet.com.br/blog', lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.6 },
    { url: 'https://freitasoutlet.com.br/faq', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: 'https://freitasoutlet.com.br/guia-de-medidas', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.4 },
    { url: 'https://freitasoutlet.com.br/politica-de-privacidade', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: 'https://freitasoutlet.com.br/termos-de-uso', lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.2 },
  ]

  const productPages = products.map((p) => ({
    url: `https://freitasoutlet.com.br/produtos/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryPages = categories.flatMap((cat) => [
    { url: `https://freitasoutlet.com.br/categorias/${cat.slug}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    ...(cat.children?.map((child) => ({
      url: `https://freitasoutlet.com.br/categorias/${child.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []),
  ])

  const brandPages = brands.map((b) => ({
    url: `https://freitasoutlet.com.br/marcas/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages, ...brandPages]
}
