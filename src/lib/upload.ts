import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export async function saveImage(file: File, subDir: string): Promise<string | null> {
  if (file.size === 0) return null
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return null
  if (file.size > MAX_IMAGE_SIZE) return null
  const ext = file.name.split('.').pop() || 'webp'
  const filename = `${subDir}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'images', subDir)
  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buffer)
  return `/images/${subDir}/${filename}`
}
