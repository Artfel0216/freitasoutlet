import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { queryOne, queryRun } from '@/lib/database'
import { getClientIp } from '@/lib/client-ip'
import { readJsonBody } from '@/lib/read-json'

async function initTable() {
  await queryRun("CREATE TABLE IF NOT EXISTS newsletter_subscribers (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL)")
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const rl = await rateLimit(`newsletter:${ip}`, 5, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const body = await readJsonBody<{ email?: string }>(request)
    if (!body) {
      return NextResponse.json({ error: 'Corpo da requisição inválido' }, { status: 400 })
    }

    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-mail é obrigatório' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    await initTable()

    const existing = await queryOne('SELECT id FROM newsletter_subscribers WHERE email = $1', [email.toLowerCase()]) as { id: string } | undefined
    if (existing) {
      return NextResponse.json({ success: true, message: 'Já inscrito' })
    }

    await queryRun('INSERT INTO newsletter_subscribers (id, email, active, created_at) VALUES ($1, $2, 1, $3)', [
      crypto.randomUUID(), email.toLowerCase(), new Date().toISOString()
    ])

    try {
      const { getConfig, createTransport } = await import('@/lib/email-helpers')
      const config = getConfig()
      if (config) {
        const transport = createTransport(config)
        await transport.sendMail({
          from: config.from,
          to: process.env.CONTACT_EMAIL || config.from,
          subject: 'Novo inscrito na newsletter',
          html: `<p><strong>E-mail:</strong> ${email.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }[c] || c))}</p>`,
        })
      }
    } catch {
      logger.warn('Newsletter email failed, but subscriber recorded', { email })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('Newsletter error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao cadastrar' }, { status: 500 })
  }
}
