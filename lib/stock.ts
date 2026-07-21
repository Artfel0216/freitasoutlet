import 'server-only'
import { queryOne, queryRun } from './database'
import { getProductById } from '@/data/products'

export async function decrementStock(items: { productId: string; size: string; quantity: number }[]) {
  for (const item of items) {
    const row = await queryOne('SELECT stock FROM products WHERE id = $1', [item.productId]) as { stock: string } | undefined
    if (row) {
      const stock = JSON.parse(row.stock || '{}') as Record<string, number>
      const current = stock[item.size] ?? 0
      stock[item.size] = Math.max(0, current - item.quantity)
      await queryRun('UPDATE products SET stock = $1, updated_at = $2 WHERE id = $3', [
        JSON.stringify(stock), new Date().toISOString(), item.productId
      ])
      continue
    }

    const staticProduct = getProductById(item.productId)
    if (staticProduct && staticProduct.stock) {
      const existing = await queryOne('SELECT id FROM products WHERE id = $1', [item.productId]) as { id: string } | undefined
      if (!existing) {
        await queryRun(`
          INSERT INTO products (id, name, slug, brand, category, description, price, compare_at_price, images, colors, sizes, size_guide, tags, is_new, is_trending, stock, active, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 1, $17, $18)
        `, [
          staticProduct.id, staticProduct.name, staticProduct.slug,
          staticProduct.brand.name, staticProduct.category.slug, staticProduct.description,
          staticProduct.price, staticProduct.compareAtPrice || null,
          JSON.stringify(staticProduct.images), JSON.stringify(staticProduct.colors),
          JSON.stringify(staticProduct.sizes), staticProduct.sizeGuide,
          JSON.stringify(staticProduct.tags), staticProduct.isNew ? 1 : 0, staticProduct.isTrending ? 1 : 0,
          JSON.stringify(staticProduct.stock), staticProduct.createdAt, new Date().toISOString()
        ])
      }

      const stock = { ...staticProduct.stock }
      const current = stock[item.size] ?? 0
      stock[item.size] = Math.max(0, current - item.quantity)
      await queryRun('UPDATE products SET stock = $1, updated_at = $2 WHERE id = $3', [
        JSON.stringify(stock), new Date().toISOString(), item.productId
      ])
    }
  }
}

export async function getProductStock(productId: string): Promise<Record<string, number>> {
  const row = await queryOne('SELECT stock FROM products WHERE id = $1', [productId]) as { stock: string } | undefined
  if (row) return JSON.parse(row.stock || '{}')

  const staticProduct = getProductById(productId)
  return staticProduct?.stock || {}
}

export async function setProductStock(productId: string, stock: Record<string, number>) {
  await queryRun('UPDATE products SET stock = $1, updated_at = $2 WHERE id = $3', [
    JSON.stringify(stock), new Date().toISOString(), productId
  ])
}
