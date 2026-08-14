import { describe, it, expect } from 'vitest'
import { slugExists } from '@/lib/valid-slugs'

describe('slugExists', () => {
  it('accepts a static product slug', () => {
    expect(slugExists('produtos', 'chuteira-nike-mercurial-superfly-9')).toBe(true)
  })

  it('accepts a DB-active product slug', () => {
    expect(slugExists('produtos', 'chuteira-lotto-air-400')).toBe(true)
  })

  it('rejects a nonexistent product slug', () => {
    expect(slugExists('produtos', 'produto-inexistente')).toBe(false)
  })

  it('accepts a static blog slug', () => {
    expect(slugExists('blog', 'como-saber-se-tenis-e-original')).toBe(true)
  })

  it('rejects a nonexistent blog slug', () => {
    expect(slugExists('blog', 'post-inexistente')).toBe(false)
  })

  it('accepts fixed modelo slugs', () => {
    expect(slugExists('modelos', 'oversized')).toBe(true)
    expect(slugExists('modelos', 'classic')).toBe(true)
    expect(slugExists('modelos', 'luxo')).toBe(true)
  })

  it('rejects unknown modelo slugs', () => {
    expect(slugExists('modelos', 'nao-existe')).toBe(false)
  })
})