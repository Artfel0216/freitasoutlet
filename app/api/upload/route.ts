import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'
import { rateLimit } from '@/lib/rate-limit'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session.authenticated) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`upload:${ip}`, 20, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições' }, { status: 429 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Arquivo não enviado' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Arquivo muito grande. Máximo 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads')

    await mkdir(uploadDir, { recursive: true })

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, filename), buffer)

    logger.info('File uploaded', { filename, size: file.size, type: file.type })

    return NextResponse.json({
      success: true,
      url: `/images/uploads/${filename}`,
    })
  } catch (error) {
    logger.error('Upload error', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao fazer upload' }, { status: 500 })
  }
}
