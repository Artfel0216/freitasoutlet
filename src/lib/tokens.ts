import { queryOne, queryRun, sql } from './database'

async function initTokensTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
}

export async function generateToken(email: string, type: 'email-verification' | 'password-reset'): Promise<string> {
  await initTokensTable()
  const token = crypto.randomUUID()
  const now = new Date().toISOString()
  const expiresAt = Date.now() + 60 * 60 * 1000

  await queryRun('DELETE FROM tokens WHERE email = $1 AND type = $2', [email.toLowerCase(), type])
  await queryRun('INSERT INTO tokens (id, email, type, expires_at, created_at) VALUES ($1, $2, $3, $4, $5)', [
    token, email.toLowerCase(), type, expiresAt, now
  ])
  return token
}

export async function consumeToken(token: string, type: 'email-verification' | 'password-reset'): Promise<string | null> {
  await initTokensTable()
  const row = await queryOne('SELECT * FROM tokens WHERE id = $1 AND type = $2', [token, type])
  if (!row) return null

  if (Date.now() > Number(row.expires_at)) {
    await queryRun('DELETE FROM tokens WHERE id = $1', [token])
    return null
  }

  const email = row.email as string
  await queryRun('DELETE FROM tokens WHERE id = $1', [token])
  return email
}
