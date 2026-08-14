import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { products } from '@/data/products'
import { blogPosts } from '@/data/blog'

const MODELO_SLUGS = new Set(['oversized', 'regular', 'classic', 'performance', 'luxo'])
const DB_TTL = 60_000

let cached: { produtos: Set<string>; blog: Set<string>; at: number } | null = null

function readDbSlugs(): { produtos: string[]; blog: string[] } {
  if (process.env.DATABASE_URL) return { produtos: [], blog: [] }
  try {
    const file = path.join(process.cwd(), 'data', 'freitasoutlet.db')
    if (!fs.existsSync(file)) return { produtos: [], blog: [] }
    const db = new Database(file, { readonly: true })
    let produtos: string[] = []
    let blog: string[] = []
    try {
      produtos = (db.prepare('SELECT slug FROM products WHERE active = 1').all() as { slug: string }[]).map((r) => r.slug)
      blog = (db.prepare('SELECT slug FROM blog_posts WHERE published = 1').all() as { slug: string }[]).map((r) => r.slug)
    } catch {
      // tables may not exist yet
    }
    db.close()
    return { produtos, blog }
  } catch {
    return { produtos: [], blog: [] }
  }
}

function getSlugSets() {
  const now = Date.now()
  if (!cached || now - cached.at > DB_TTL) {
    const dbSlugs = readDbSlugs()
    cached = {
      produtos: new Set([...products.map((p) => p.slug), ...dbSlugs.produtos]),
      blog: new Set([...blogPosts.map((p) => p.slug), ...dbSlugs.blog]),
      at: now,
    }
  }
  return cached
}

export function slugExists(route: 'produtos' | 'blog' | 'modelos', slug: string): boolean {
  if (!slug) return false
  if (route === 'modelos') return MODELO_SLUGS.has(slug)
  const sets = getSlugSets()
  return sets[route].has(slug)
}
