import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { getClientIp } from '@/lib/client-ip'

function sanitize(str: string): string {
  return str.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }
    return map[c] || c
  })
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`contato:${ip}`, 5, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const body = await request.json()
    const name = typeof body.name === 'string' ? body.name : ''
    const email = typeof body.email === 'string' ? body.email : ''
    const phone = typeof body.phone === 'string' ? body.phone : ''
    const message = typeof body.message === 'string' ? body.message : ''

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nome, e-mail e mensagem são obrigatórios' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    try {
      const { getConfig, createTransport } = await import('@/lib/email-helpers')
      const config = getConfig()
      if (config) {
        const transport = createTransport(config)
        await transport.sendMail({
          from: config.from,
          to: process.env.CONTACT_EMAIL || config.from,
          subject: `Contato - ${sanitize(name)}`,
          html: `
            <h2>Novo contato via site</h2>
            <p><strong>Nome:</strong> ${sanitize(name)}</p>
            <p><strong>E-mail:</strong> ${sanitize(email)}</p>
            <p><strong>Telefone:</strong> ${sanitize(phone || '-')}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${sanitize(message)}</p>
          `,
        })
      }
    } catch {
      logger.warn('Contact email failed', { email, name })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Contact error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 })
  }
}
