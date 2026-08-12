import 'server-only'
import { queryOne, queryAll, queryRun } from './database'

async function migrateProductsTable() {
  try { await queryRun("ALTER TABLE products ADD COLUMN offer_status TEXT NOT NULL DEFAULT 'none'") } catch { /* */ }
  try { await queryRun("ALTER TABLE products ADD COLUMN offer_type TEXT NOT NULL DEFAULT 'none'") } catch { /* */ }
  try { await queryRun("ALTER TABLE products ADD COLUMN offer_discount REAL NOT NULL DEFAULT 0") } catch { /* */ }
  try { await queryRun("ALTER TABLE products ADD COLUMN featured INTEGER NOT NULL DEFAULT 0") } catch { /* */ }
}

export type OfferStatus = 'none' | 'sale' | 'promotion' | 'clearance'
export type OfferType = 'none' | 'weekly' | 'monthly'

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
  offerStatus: OfferStatus
  offerType: OfferType
  offerDiscount: number
  featured: boolean
  stock: Record<string, number>
  active: boolean
  createdAt: string
  updatedAt: string
}

export async function readStoredProducts(): Promise<StoredProduct[]> {
  await migrateProductsTable()
  const rows = await queryAll('SELECT * FROM products ORDER BY created_at DESC')
  return rows.map(rowToStoredProduct)
}

async function upsertProductQuery(p: StoredProduct): Promise<void> {
  await queryRun(`
    INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price,
      images, colors, sizes, size_guide, tags, is_new, is_trending, offer_status, offer_type, offer_discount, featured, stock, active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    ON CONFLICT(slug) DO UPDATE SET
      name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
      description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
      images = EXCLUDED.images, colors = EXCLUDED.colors, sizes = EXCLUDED.sizes,
      size_guide = EXCLUDED.size_guide, tags = EXCLUDED.tags, is_new = EXCLUDED.is_new,
      is_trending = EXCLUDED.is_trending, offer_status = EXCLUDED.offer_status, offer_type = EXCLUDED.offer_type,
      offer_discount = EXCLUDED.offer_discount, featured = EXCLUDED.featured, stock = EXCLUDED.stock, active = EXCLUDED.active,
      updated_at = EXCLUDED.updated_at
  `, [
    p.id, p.name, p.slug, JSON.stringify(p.brand), JSON.stringify(p.category),
    p.description, p.price, p.compareAtPrice,
    JSON.stringify(p.images), JSON.stringify(p.colors), JSON.stringify(p.sizes),
    p.sizeGuide, JSON.stringify(p.tags), p.isNew ? 1 : 0, p.isTrending ? 1 : 0,
    p.offerStatus || 'none', p.offerType || 'none', p.offerDiscount || 0, p.featured ? 1 : 0,
    JSON.stringify(p.stock || {}), p.active ? 1 : 0, p.createdAt, p.updatedAt,
  ])
}

export async function writeStoredProducts(products: StoredProduct[]): Promise<void> {
  await migrateProductsTable()
  const isPostgres = !!process.env.DATABASE_URL

  if (isPostgres) {
    for (const p of products) {
      await upsertProductQuery(p)
    }
    return
  }

  try {
    await queryRun('BEGIN')
    for (const p of products) {
      await upsertProductQuery(p)
    }
    await queryRun('COMMIT')
  } catch (e) {
    try { await queryRun('ROLLBACK') } catch { /* no active transaction */ }
    throw e
  }
}

export async function getStoredProductBySlug(slug: string): Promise<StoredProduct | undefined> {
  await migrateProductsTable()
  const row = await queryOne('SELECT * FROM products WHERE slug = $1', [slug])
  return row ? rowToStoredProduct(row) : undefined
}

export async function deleteStoredProduct(slug: string): Promise<boolean> {
  await migrateProductsTable()
  const result = await queryRun('DELETE FROM products WHERE slug = $1', [slug])
  return result.rowCount > 0
}

export async function upsertStoredProduct(product: StoredProduct): Promise<void> {
  await migrateProductsTable()
  await queryRun(`
    INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price,
      images, colors, sizes, size_guide, tags, is_new, is_trending, offer_status, offer_type, offer_discount, featured, stock, active, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
    ON CONFLICT(slug) DO UPDATE SET
      name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
      description = EXCLUDED.description, price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price,
      images = EXCLUDED.images, colors = EXCLUDED.colors, sizes = EXCLUDED.sizes,
      size_guide = EXCLUDED.size_guide, tags = EXCLUDED.tags, is_new = EXCLUDED.is_new,
      is_trending = EXCLUDED.is_trending, offer_status = EXCLUDED.offer_status, offer_type = EXCLUDED.offer_type,
      offer_discount = EXCLUDED.offer_discount, featured = EXCLUDED.featured, stock = EXCLUDED.stock, active = EXCLUDED.active,
      updated_at = EXCLUDED.updated_at
  `, [
    product.id, product.name, product.slug, JSON.stringify(product.brand), JSON.stringify(product.category),
    product.description, product.price, product.compareAtPrice,
    JSON.stringify(product.images), JSON.stringify(product.colors), JSON.stringify(product.sizes),
    product.sizeGuide, JSON.stringify(product.tags), product.isNew ? 1 : 0, product.isTrending ? 1 : 0,
    product.offerStatus || 'none', product.offerType || 'none', product.offerDiscount || 0, product.featured ? 1 : 0,
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
    offerStatus: (row.offer_status as string || 'none') as OfferStatus,
    offerType: (row.offer_type as string || 'none') as OfferType,
    offerDiscount: Number(row.offer_discount || 0),
    featured: (row.featured as number) === 1,
    stock: JSON.parse((row.stock as string) || '{}'),
    active: (row.active as number) === 1,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}
