import { describe, it, expect } from 'vitest'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload'

describe('upload constants', () => {
  it('ALLOWED_IMAGE_TYPES contains common web image formats', () => {
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/webp')
    expect(ALLOWED_IMAGE_TYPES).toContain('image/gif')
  })

  it('rejects non-image types', () => {
    const nonImages = ['application/pdf', 'text/plain', 'image/svg+xml', 'video/mp4']
    for (const t of nonImages) {
      expect(ALLOWED_IMAGE_TYPES).not.toContain(t)
    }
  })

  it('MAX_IMAGE_SIZE is exactly 5MB', () => {
    expect(MAX_IMAGE_SIZE).toBe(5 * 1024 * 1024)
  })

  it('validates file size against MAX_IMAGE_SIZE', () => {
    const smallFile = new File(['x'.repeat(1024)], 'small.jpg', { type: 'image/jpeg' })
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

    expect(ALLOWED_IMAGE_TYPES.includes(smallFile.type)).toBe(true)
    expect(smallFile.size).toBeLessThanOrEqual(MAX_IMAGE_SIZE)

    expect(ALLOWED_IMAGE_TYPES.includes(largeFile.type)).toBe(true)
    expect(largeFile.size).toBeGreaterThan(MAX_IMAGE_SIZE)
  })
})
