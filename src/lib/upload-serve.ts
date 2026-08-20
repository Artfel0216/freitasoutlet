import { NextResponse } from 'next/server'
import path from 'path'
import { readFile } from 'fs/promises'
import { uploadsRoot } from './upload'

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

const PLACEHOLDER_PATH = path.join(process.cwd(), 'public', 'images', 'placeholder.png')

async function readFileIfExists(filePath: string): Promise<Buffer | null> {
  try {
    return await readFile(filePath)
  } catch {
    return null
  }
}

function mimeTypeFor(filename: string): string {
  return MIME_TYPES[path.extname(filename).slice(1).toLowerCase()] ?? 'application/octet-stream'
}

export async function serveUpload(subDir: string, filename: string): Promise<NextResponse> {
  const name = path.basename(filename)
  if (name !== filename) {
    return new NextResponse(null, { status: 404 })
  }

  const stored = await readFileIfExists(path.join(uploadsRoot(), subDir, name))
  if (stored) {
    return new NextResponse(new Uint8Array(stored), {
      headers: {
        'Content-Type': mimeTypeFor(name),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const legacy = await readFileIfExists(path.join(process.cwd(), 'public', 'images', subDir, name))
  if (legacy) {
    return new NextResponse(new Uint8Array(legacy), {
      headers: {
        'Content-Type': mimeTypeFor(name),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const placeholder = await readFileIfExists(PLACEHOLDER_PATH)
  if (placeholder) {
    return new NextResponse(new Uint8Array(placeholder), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  return new NextResponse(null, { status: 404 })
}