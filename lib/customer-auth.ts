import 'server-only'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'

const SESSION_COOKIE = 'fo_customer_session'
const DEFAULT_SESSION_DURATION_MS = 24 * 60 * 60 * 1000
const SIGNING_SECRET = process.env.SESSION_SECRET
if (!SIGNING_SECRET) {
  logger.error('[customer-auth] CRITICAL: SESSION_SECRET env variable not set. Customer sessions will fail.')
}

function getSessionDurationMs(): number {
  const hours = Number(process.env.SESSION_DURATION_HOURS)
  if (!Number.isFinite(hours) || hours <= 0) return DEFAULT_SESSION_DURATION_MS
  return hours * 60 * 60 * 1000
}

export type CustomerData = {
  id: string
  name: string
  email: string
  phone: string
}

async function getKey(): Promise<CryptoKey | null> {
  if (!SIGNING_SECRET) return null
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(SIGNING_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

async function sign(data: string): Promise<string | null> {
  const key = await getKey()
  if (!key) return null
  const encoder = new TextEncoder()
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verify(signedData: string): Promise<string | null> {
  const lastDot = signedData.lastIndexOf('.')
  if (lastDot === -1) return null
  const data = signedData.slice(0, lastDot)
  const signature = signedData.slice(lastDot + 1)
  const key = await getKey()
  if (!key) return null
  const encoder = new TextEncoder()
  const sigBytes = new Uint8Array(signature.match(/.{2}/g)!.map(h => parseInt(h, 16)))
  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(data))
  if (!isValid) return null
  return data
}

export async function createCustomerSession(customer: CustomerData): Promise<void> {
  const exp = Date.now() + getSessionDurationMs()
  const payload = JSON.stringify({ ...customer, exp })
  const signature = await sign(payload)
  const signedValue = `${payload}.${signature}`

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, signedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(exp),
  })
}

export async function getCustomerSession(): Promise<CustomerData | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE)
    if (!session?.value) return null

    const data = await verify(session.value)
    if (!data) return null

    const parsed = JSON.parse(data)
    if (typeof parsed.exp !== 'number' || parsed.exp <= Date.now()) {
      await clearCustomerSession()
      return null
    }

    return { id: parsed.id, name: parsed.name, email: parsed.email, phone: parsed.phone }
  } catch {
    return null
  }
}

export async function clearCustomerSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
