import 'server-only'

function looksLikeIp(value: string): boolean {
  const trimmed = value.trim()
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)
  if (ipv4) return trimmed.split('.').every((octet) => Number(octet) >= 0 && Number(octet) <= 255)
  return /^[0-9a-fA-F:]+$/.test(trimmed) && trimmed.includes(':')
}

function fromForwardedFor(value: string, fromRight: boolean): string | undefined {
  const candidates = value.split(',').map((part) => part.trim()).filter(Boolean)
  const order = fromRight ? candidates.slice().reverse() : candidates
  for (const candidate of order) {
    const cleaned = candidate.replace(/^::ffff:/, '')
    if (looksLikeIp(cleaned)) return cleaned
  }
  return undefined
}

export function getClientIp(request: Request): string {
  const trustProxy = process.env.TRUST_PROXY === 'true'
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-client-ip')

  if (trustProxy) {
    if (forwarded) {
      const ip = fromForwardedFor(forwarded, true)
      if (ip) return ip
    }
    if (realIp && looksLikeIp(realIp)) return realIp.replace(/^::ffff:/, '')
    if (clientIp && looksLikeIp(clientIp)) return clientIp.replace(/^::ffff:/, '')
    return 'unknown'
  }

  if (process.env.NODE_ENV === 'production') {
    return 'unknown'
  }

  if (forwarded) {
    const ip = fromForwardedFor(forwarded, false)
    if (ip) return ip
  }
  if (realIp && looksLikeIp(realIp)) return realIp.replace(/^::ffff:/, '')
  if (clientIp && looksLikeIp(clientIp)) return clientIp.replace(/^::ffff:/, '')

  return 'anonymous'
}