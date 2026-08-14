import 'server-only'

function looksLikeIp(value: string): boolean {
  const trimmed = value.trim()
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)
  if (ipv4) return trimmed.split('.').every((octet) => Number(octet) >= 0 && Number(octet) <= 255)
  return /^[0-9a-fA-F:]+$/.test(trimmed) && trimmed.includes(':')
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const candidates = forwarded.split(',').map((part) => part.trim()).filter(Boolean)
    for (let i = candidates.length - 1; i >= 0; i--) {
      const candidate = candidates[i].replace(/^::ffff:/, '')
      if (looksLikeIp(candidate)) return candidate
    }
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp && looksLikeIp(realIp)) return realIp.replace(/^::ffff:/, '')

  const clientIp = request.headers.get('x-client-ip')
  if (clientIp && looksLikeIp(clientIp)) return clientIp.replace(/^::ffff:/, '')

  return 'anonymous'
}
