import nodemailer from 'nodemailer'

type EmailConfig = {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

function getConfig(): EmailConfig | null {
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

function createTransport(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendOrderConfirmation(params: {
  to: string
  name: string
  orderNumber: string
  total: number
  paymentMethod: string
}) {
  const config = getConfig()
  if (!config) return

  const transport = createTransport(config)
  await transport.sendMail({
    from: config.from,
    to: params.to,
    subject: `Pedido #${params.orderNumber} confirmado - Freitas Outlet`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Pedido Confirmado!</h1>
        <p>Olá <strong>${escapeHtml(params.name)}</strong>,</p>
        <p>Seu pedido <strong>#${escapeHtml(params.orderNumber)}</strong> foi registrado com sucesso.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Pedido</td><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">#${escapeHtml(params.orderNumber)}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Total</td><td style="padding: 8px; border: 1px solid #ddd;">R$ ${params.total.toFixed(2).replace('.', ',')}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;">Pagamento</td><td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(params.paymentMethod)}</td></tr>
        </table>
        <p style="color: #666; font-size: 14px;">Acompanhe seu pedido em sua conta.</p>
        <p style="color: #666; font-size: 12px;">Freitas Outlet</p>
      </div>
    `,
  })
}

export async function sendShippingUpdate(params: {
  to: string
  name: string
  orderNumber: string
  status: string
}) {
  const config = getConfig()
  if (!config) return

  const transport = createTransport(config)
  await transport.sendMail({
    from: config.from,
    to: params.to,
    subject: `Pedido #${params.orderNumber} - Atualização de envio - Freitas Outlet`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Atualização do Pedido</h1>
        <p>Olá <strong>${escapeHtml(params.name)}</strong>,</p>
        <p>O status do seu pedido <strong>#${escapeHtml(params.orderNumber)}</strong> foi atualizado.</p>
        <p><strong>Novo status: ${escapeHtml(params.status)}</strong></p>
        <p style="color: #666; font-size: 12px;">Freitas Outlet</p>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(params: {
  to: string
  name: string
}) {
  const config = getConfig()
  if (!config) return

  const transport = createTransport(config)
  await transport.sendMail({
    from: config.from,
    to: params.to,
    subject: 'Bem-vindo à Freitas Outlet!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Bem-vindo!</h1>
        <p>Olá <strong>${escapeHtml(params.name)}</strong>,</p>
        <p>Sua conta foi criada com sucesso na Freitas Outlet.</p>
        <p>Agora você pode acompanhar seus pedidos, salvar endereços e muito mais.</p>
        <p style="color: #666; font-size: 12px;">Freitas Outlet</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(params: {
  to: string
  name: string
  resetUrl: string
}) {
  const config = getConfig()
  if (!config) return

  const transport = createTransport(config)
  await transport.sendMail({
    from: config.from,
    to: params.to,
    subject: 'Recuperação de senha - Freitas Outlet',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Recuperação de Senha</h1>
        <p>Olá <strong>${escapeHtml(params.name)}</strong>,</p>
        <p>Recebemos uma solicitação de recuperação de senha para sua conta.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="${escapeHtml(params.resetUrl)}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none;">REDEFINIR SENHA</a></p>
        <p style="color: #666; font-size: 12px;">Se você não solicitou esta alteração, ignore este e-mail.</p>
        <p style="color: #666; font-size: 12px;">Freitas Outlet</p>
      </div>
    `,
  })
}

export async function sendEmailVerification(params: {
  to: string
  name: string
  verifyUrl: string
}) {
  const config = getConfig()
  if (!config) return

  const transport = createTransport(config)
  await transport.sendMail({
    from: config.from,
    to: params.to,
    subject: 'Confirme seu e-mail - Freitas Outlet',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; margin-bottom: 16px;">Confirme seu E-mail</h1>
        <p>Olá <strong>${escapeHtml(params.name)}</strong>,</p>
        <p>Clique no link abaixo para confirmar seu endereço de e-mail:</p>
        <p><a href="${escapeHtml(params.verifyUrl)}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none;">CONFIRMAR E-MAIL</a></p>
        <p style="color: #666; font-size: 12px;">Freitas Outlet</p>
      </div>
    `,
  })
}
