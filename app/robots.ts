import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/checkout/', '/minha-conta/'] },
    ],
    sitemap: 'https://freitasoutlet.com.br/sitemap.xml',
  }
}
