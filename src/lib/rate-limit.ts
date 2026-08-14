import { queryOne, queryRun } from './database'

async function initRateLimitTable() {
  await queryRun("CREATE TABLE IF NOT EXISTS rate_limits (id TEXT PRIMARY KEY, key TEXT NOT NULL, count INTEGER NOT NULL DEFAULT 1, reset_at BIGINT NOT NULL)")
}

let cleanupCounter = 0

async function cleanupExpired() {
  await queryRun('DELETE FROM rate_limits WHERE reset_at < $1', [Date.now()])
}

export async function rateLimit(key: string, maxRequests: number, windowMs: number): Promise<{
  allowed: boolean
  remaining: number
  resetAt: number
}> {
  await initRateLimitTable()
  cleanupCounter++
  if (cleanupCounter % 100 === 0) {
    cleanupExpired().catch(() => {})
  }
  const now = Date.now()

  const row = await queryOne('SELECT * FROM rate_limits WHERE key = $1', [key])

  if (!row || now > Number(row.reset_at)) {
    if (row) {
      await queryRun('UPDATE rate_limits SET count = 1, reset_at = $1 WHERE key = $2', [now + windowMs, key])
    } else {
      const id = crypto.randomUUID()
      await queryRun('INSERT INTO rate_limits (id, key, count, reset_at) VALUES ($1, $2, 1, $3)', [id, key, now + windowMs])
    }
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  const newCount = (row.count as number) + 1
  await queryRun('UPDATE rate_limits SET count = $1 WHERE key = $2', [newCount, key])

  if (newCount > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: Number(row.reset_at) }
  }

  return { allowed: true, remaining: maxRequests - newCount, resetAt: Number(row.reset_at) }
}
