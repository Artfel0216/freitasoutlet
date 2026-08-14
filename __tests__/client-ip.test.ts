import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { getClientIp } from '@/lib/client-ip'

const originalEnv = { ...process.env }

function makeRequest(headers: Record<string, string>): Request {
  return new Request('http://localhost:3000/api/health', { headers })
}

beforeEach(() => {
  process.env.NODE_ENV = 'test'
  process.env.TRUST_PROXY = ''
})

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('getClientIp', () => {
  it('dev: trusts x-forwarded-for first candidate', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(req)).toBe('1.2.3.4')
  })

  it('dev: falls back to anonymous without headers', () => {
    expect(getClientIp(makeRequest({}))).toBe('anonymous')
  })

  it('trustProxy=true: uses right-most valid IP', () => {
    process.env.TRUST_PROXY = 'true'
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(getClientIp(req)).toBe('5.6.7.8')
  })

  it('trustProxy=true: uses x-real-ip fallback', () => {
    process.env.TRUST_PROXY = 'true'
    const req = makeRequest({ 'x-real-ip': '10.1.1.1' })
    expect(getClientIp(req)).toBe('10.1.1.1')
  })

  it('production without TRUST_PROXY: ignores client-controlled headers', () => {
    process.env.NODE_ENV = 'production'
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8', 'x-real-ip': '10.0.0.99', 'x-client-ip': '198.51.100.1' })
    expect(getClientIp(req)).toBe('unknown')
  })

  it('production with TRUST_PROXY=true: trusts right-most IP', () => {
    process.env.NODE_ENV = 'production'
    process.env.TRUST_PROXY = 'true'
    const req = makeRequest({ 'x-forwarded-for': '9.9.9.9, 203.0.113.7' })
    expect(getClientIp(req)).toBe('203.0.113.7')
  })

  it('ignores malformed IPs and picks first valid', () => {
    const req = makeRequest({ 'x-forwarded-for': 'not-an-ip, 999.999.999.999, 8.8.8.8' })
    expect(getClientIp(req)).toBe('8.8.8.8')
  })
})