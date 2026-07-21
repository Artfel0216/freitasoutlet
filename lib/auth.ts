import 'server-only'
import { cookies } from 'next/headers'
import { queryOne, queryRun, sql } from './database'

const SESSION_COOKIE = 'fo_admin_session'
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000

function generateToken(): string {
  return crypto.randomUUID()
}

function getTokenExpiry(): number {
  return Date.now() + SESSION_DURATION_MS
}

let bcryptMod: typeof import('bcryptjs') | null = null

async function getBcrypt() {
  if (!bcryptMod) {
    bcryptMod = await import('bcryptjs')
  }
  return bcryptMod
}

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD environment variable is not set')
  }

  await sql`
    CREATE TABLE IF NOT EXISTS admin_passwords (
      id TEXT PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `

  const row = await queryOne('SELECT hash FROM admin_passwords WHERE id = $1', ['admin']) as { hash: string } | undefined

  if (!row) {
    const bcrypt = await getBcrypt()
    const hash = await bcrypt.hash(adminPassword, 12)
    await queryRun('INSERT INTO admin_passwords (id, hash, created_at) VALUES ($1, $2, $3)', ['admin', hash, new Date().toISOString()])
    return bcrypt.compare(password, hash)
  }

  const bcrypt = await getBcrypt()
  return bcrypt.compare(password, row.hash)
}

async function ensureTokensTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      expires_at BIGINT NOT NULL,
      created_at TEXT NOT NULL
    )
  `
}

export async function setSession(): Promise<string> {
  await ensureTokensTable()
  const token = generateToken()
  const now = Date.now()

  await queryRun('INSERT INTO admin_sessions (token, expires_at, created_at) VALUES ($1, $2, $3)', [
    token, now + SESSION_DURATION_MS, new Date().toISOString()
  ])

  await queryRun('DELETE FROM admin_sessions WHERE expires_at < $1', [now])

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(getTokenExpiry()),
  })
  return token
}

export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    if (session?.value) {
      await ensureTokensTable()
      await queryRun('DELETE FROM admin_sessions WHERE token = $1', [session.value])
    }
    cookieStore.delete(SESSION_COOKIE)
  } catch {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
  }
}

export async function getSession(): Promise<{ authenticated: boolean }> {
  try {
    await ensureTokensTable()
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    if (!session?.value) return { authenticated: false }

    const row = await queryOne('SELECT token FROM admin_sessions WHERE token = $1 AND expires_at > $2', [
      session.value, Date.now()
    ]) as { token: string } | undefined

    if (!row) return { authenticated: false }
    return { authenticated: true }
  } catch {
    return { authenticated: false }
  }
}
