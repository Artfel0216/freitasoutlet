import type { MetadataRoute } from 'next'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://freitasoutlet.com.br').replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/checkout/', '/minha-conta/'] },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
