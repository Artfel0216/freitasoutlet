import nodemailer from 'nodemailer'

export type EmailConfig = {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

export function getConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  return {
    host,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user,
    pass,
    from: process.env.EMAIL_FROM || 'noreply@freitasoutlet.com.br',
  }
}

export function createTransport(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  })
}

export function sanitizeHtml(str: string): string {
  return str.replace(/[<>&"']/g, (c) => {
    const map: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' }
    return map[c] || c
  })
}
