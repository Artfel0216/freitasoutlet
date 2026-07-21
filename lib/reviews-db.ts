import 'server-only'
import { queryOne, queryAll, queryRun } from './database'

export type Review = {
  id: string
  productId: string
  customerName: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: string
}

export async function initReviewsTable() {
  const { sql } = await import('./database')
  await sql`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      title TEXT NOT NULL DEFAULT '',
      comment TEXT NOT NULL DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `
  await sql`CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id)`
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  await initReviewsTable()
  const rows = await queryAll('SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC', [productId])
  return rows.map(row => ({
    id: row.id as string,
    productId: row.product_id as string,
    customerName: row.customer_name as string,
    rating: row.rating as number,
    title: row.title as string,
    comment: row.comment as string,
    verified: Boolean(row.verified),
    createdAt: row.created_at as string,
  }))
}

export async function getAverageRating(productId: string): Promise<{ average: number; count: number }> {
  await initReviewsTable()
  const row = await queryOne('SELECT AVG(rating) as average, COUNT(*) as count FROM reviews WHERE product_id = $1', [productId])
  return {
    average: Number(row?.average) || 0,
    count: Number(row?.count) || 0,
  }
}

export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  await initReviewsTable()
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await queryRun('INSERT INTO reviews (id, product_id, customer_name, rating, title, comment, verified, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [
    id, review.productId, review.customerName, review.rating, review.title, review.comment, review.verified ? 1 : 0, now
  ])
  return { ...review, id, createdAt: now }
}

export async function deleteReview(id: string): Promise<boolean> {
  await initReviewsTable()
  const result = await queryRun('DELETE FROM reviews WHERE id = $1', [id])
  return result.rowCount > 0
}
