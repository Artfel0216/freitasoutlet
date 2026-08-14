import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'
import { saveImage, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload'
import { getClientIp } from '@/lib/client-ip'

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ip = getClientIp(request)
    const rl = await rateLimit(`upload:${ip}`, 20, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.' }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 })
    }

    const url = await saveImage(file, 'uploads')

    if (!url) {
      return NextResponse.json({ error: 'Erro ao salvar arquivo' }, { status: 500 })
    }

    logger.info('File uploaded', { url, size: file.size, type: file.type })

    return NextResponse.json({
      success: true,
      url,
    })
  } catch (error) {
    logger.error('Upload error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
