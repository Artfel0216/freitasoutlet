import 'server-only'
import { queryOne, queryAll, queryRun } from './database'

export type StoredBrand = {
  id: string
  name: string
  slug: string
  segment: string
  logo?: string
  createdAt: string
}

async function migrateBrandsTable() {
  try { await queryRun("CREATE TABLE IF NOT EXISTS brands (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, segment TEXT NOT NULL DEFAULT 'premium', logo TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL)") } catch { /* */ }
}

export async function readStoredBrands(): Promise<StoredBrand[]> {
  await migrateBrandsTable()
  const rows = await queryAll('SELECT * FROM brands ORDER BY name ASC')
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    segment: (row.segment as string) || 'premium',
    logo: (row.logo as string) || '',
    createdAt: row.created_at as string,
  }))
}

export async function getStoredBrandBySlug(slug: string): Promise<StoredBrand | undefined> {
  await migrateBrandsTable()
  const row = await queryOne('SELECT * FROM brands WHERE slug = $1', [slug])
  if (!row) return undefined
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    segment: (row.segment as string) || 'premium',
    logo: (row.logo as string) || '',
    createdAt: row.created_at as string,
  }
}

export async function upsertStoredBrand(brand: Omit<StoredBrand, 'createdAt'> & { createdAt?: string }): Promise<void> {
  await migrateBrandsTable()
  await queryRun(`
    INSERT INTO brands (id, name, slug, segment, logo, created_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT(slug) DO UPDATE SET
      name = EXCLUDED.name, segment = EXCLUDED.segment, logo = EXCLUDED.logo
  `, [
    brand.id, brand.name, brand.slug, brand.segment || 'premium', brand.logo || '',
    brand.createdAt || new Date().toISOString(),
  ])
}

export async function deleteStoredBrand(slug: string): Promise<boolean> {
  await migrateBrandsTable()
  const result = await queryRun('DELETE FROM brands WHERE slug = $1', [slug])
  return result.rowCount > 0
}
