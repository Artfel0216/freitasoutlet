import { NextResponse } from 'next/server'
import { saveImage, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload'

export type ImagesResult = { ok: true; images: string[] } | { ok: false; response: NextResponse }

export async function processImageUploads(files: File[]): Promise<ImagesResult> {
  const images: string[] = []

  for (const file of files) {
    if (file.size === 0) continue
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: `Tipo de arquivo não permitido: ${file.name}. Use JPEG, PNG, WebP ou GIF.` },
          { status: 400 },
        ),
      }
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        ok: false,
        response: NextResponse.json({ error: `${file.name} deve ter no máximo 5MB.` }, { status: 400 }),
      }
    }
    const url = await saveImage(file, 'uploads')
    if (url) images.push(url)
  }

  return { ok: true, images }
}