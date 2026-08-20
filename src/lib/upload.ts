import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export function uploadsRoot(): string {
  return path.join(process.cwd(), 'data', 'uploads')
}

export async function saveImage(file: File, subDir: string): Promise<string | null> {
  if (file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null
  if (file.size > MAX_IMAGE_SIZE) return null
  const ext = file.name.split('.').pop() || 'webp'
  const filename = `${subDir}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const uploadDir = path.join(uploadsRoot(), subDir)
  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/images/${subDir}/${filename}`
}

export async function readUpload(subDir: string, filename: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const name = path.basename(filename)
  if (name !== filename) return null
  const filePath = path.join(uploadsRoot(), subDir, name)
  try {
    const buffer = await readFile(filePath)
    const ext = path.extname(name).slice(1).toLowerCase()
    return { buffer, mimeType: MIME_TYPES[ext] ?? 'application/octet-stream' }
  } catch {
    return null
  }
}