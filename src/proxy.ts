import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { slugExists } from '@/lib/valid-slugs'

const ADMIN_LOGIN_PATH = '/admin/login'
const ADMIN_API_PATH = '/api/admin'

const PUBLIC_API_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password', '/api/auth/reset-password', '/api/shipping', '/api/cep', '/api/contato', '/api/newsletter', '/api/webhook']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const requestHeaders = new Headers(request.headers)
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLoginPage = pathname === ADMIN_LOGIN_PATH
  const isAdminApiRoute = pathname.startsWith(ADMIN_API_PATH)
  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname === '/favicon.ico'

  if (pathname.startsWith('/api/') && request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const isPublic = PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))
    if (!isPublic) {
      const origin = request.headers.get('origin')
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_SITE_URL,
        'http://localhost:3000',
      ].filter(Boolean)

      if (!origin) {
        return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 })
      }
      if (!allowedOrigins.some((o) => origin.startsWith(o || ''))) {
        return NextResponse.json({ error: 'Origem não autorizada' }, { status: 403 })
      }
    }
  }

  const slugMatch = pathname.match(/^\/(produtos|blog|modelos)\/([^/]+)$/)
  if (slugMatch && request.method === 'GET') {
    const [, route, slug] = slugMatch
    if (!slugExists(route as 'produtos' | 'blog' | 'modelos', slug)) {
      return NextResponse.rewrite(new URL('/_slug-nao-encontrado/', request.url))
    }
  }

  if (isAdminRoute && !isAdminLoginPage && !isAdminApiRoute && !isStaticAsset) {
    const sessionToken = request.cookies.get('fo_admin_session')
    if (!sessionToken?.value) {
      const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.stripe.com https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://*.stripe.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-src 'self' https://*.stripe.com",
    "connect-src 'self' https://*.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sw.js|images/).*)',
  ],
}
