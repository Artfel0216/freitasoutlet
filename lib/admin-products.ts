import 'server-only'
import { queryOne, queryAll, queryRun, sql } from './database'

export type StoredProduct = {
  id: string
  name: string
  slug: string
  brand: { id: string; name: string; slug: string; segment: string }
  category: { id: string; name: string; slug: string; parentId: string | null }
  description: string
  price: number
  compareAtPrice: number | null
  images: string[]
  colors: { name: string; hex: string }[]
  sizes: string[]
  sizeGuide: string
  tags: string[]
  isNew: boolean
  isTrending: boolean
  stock: Record<string, number>
  active: boolean
  createdAt: string
  updatedAt: string
}

export async function readStoredProducts(): Promise<StoredProduct[]> {
  const rows = await queryAll('SELECT * FROM products ORDER BY created_at DESC')
  return rows.map(rowToStoredProduct)
}

export async function writeStoredProducts(products: StoredProduct[]): Promise<void> {
  const statements = products.map(p => sql`
    INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price,
      images, colors, sizes, size_guide, tags, is_new, is_trending, stock, active, created_at, updated_at)
    VALUES (${p.id}, ${p.name}, ${p.slug}, ${JSON.stringify(p.brand)}, ${JSON.stringify(p.category)},
      ${p.description}, ${p.price}, ${p.compareAtPrice},
      ${JSON.stringify(p.images)}, ${JSON.stringify(p.colors)}, ${JSON.stringify(p.sizes)},
      ${p.sizeGuide}, ${JSON.stringify(p.tags)}, ${p.isNew ? 1 : 0}, ${p.isTrending ? 1 : 0},
      ${JSON.stringify(p.stock || {})}, ${p.active ? 1 : 0}, ${p.createdAt}, ${p.updatedAt})
    ON CONFLICT(slug) DO UPDATE SET
      name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
      description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
      images = EXCLUDED.images, colors = EXCLUDED.colors, sizes = EXCLUDED.sizes,
      size_guide = EXCLUDED.size_guide, tags = EXCLUDED.tags, is_new = EXCLUDED.is_new,
      is_trending = EXCLUDED.is_trending, stock = EXCLUDED.stock, active = EXCLUDED.active,
      updated_at = EXCLUDED.updated_at
  `)
  await sql.transaction(statements)
}

export async function getStoredProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  const row = await queryOne('SELECT * FROM products WHERE slug = $1', [slug])
  return row ? rowToStoredProduct(row) : undefined
}

export async function deleteStoredProduct(slug: string): Promise<boolean> {
  const result = await queryRun('DELETE FROM products WHERE slug = $1', [slug])
  return result.rowCount > 0
}

export async function upsertStoredProduct(product: StoredProduct): Promise<void> {
  await queryRun(`
    INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price,
      images, colors, sizes, size_guide, tags, is_new, is_trending, stock, active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    ON CONFLICT(slug) DO UPDATE SET
      name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
      description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
      images = EXCLUDED.images, colors = EXCLUDED.colors, sizes = EXCLUDED.sizes,
      size_guide = EXCLUDED.size_guide, tags = EXCLUDED.tags, is_new = EXCLUDED.is_new,
      is_trending = EXCLUDED.is_trending, stock = EXCLUDED.stock, active = EXCLUDED.active,
      updated_at = EXCLUDED.updated_at
  `, [
    product.id, product.name, product.slug, JSON.stringify(product.brand), JSON.stringify(product.category),
    product.description, product.price, product.compareAtPrice,
    JSON.stringify(product.images), JSON.stringify(product.colors), JSON.stringify(product.sizes),
    product.sizeGuide, JSON.stringify(product.tags), product.isNew ? 1 : 0, product.isTrending ? 1 : 0,
    JSON.stringify(product.stock || {}), product.active ? 1 : 0, product.createdAt, product.updatedAt,
  ])
}

function rowToStoredProduct(row: Record<string, unknown>): StoredProduct {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    brand: JSON.parse(row.brand as string),
    category: JSON.parse(row.category as string),
    description: row.description as string,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    images: JSON.parse(row.images as string),
    colors: JSON.parse(row.colors as string),
    sizes: JSON.parse(row.sizes as string),
    sizeGuide: row.size_guide as string,
    tags: JSON.parse(row.tags as string),
    isNew: (row.is_new as number) === 1,
    isTrending: (row.is_trending as number) === 1,
    stock: JSON.parse((row.stock as string) || '{}'),
    active: (row.active as number) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
