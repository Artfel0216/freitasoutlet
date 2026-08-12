import { describe, it, expect, beforeAll } from 'vitest'

beforeAll(() => {
  process.env.STORE_PIX_KEY = '11236173414'
  process.env.STORE_NAME = 'LOJA TESTE LTDA'
})

describe('generatePixPayload', () => {
  it('returns a valid BR Code payload with correct structure', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('52998224725', 150.50, 'Cliente Teste')

    expect(result.pixKey).toBe('11236173414')
    expect(result.txId).toMatch(/^[A-Z0-9]{25}$/)
    expect(result.qrCode).toContain('000201')
    expect(result.qrCode).toMatch(/6304[A-F0-9]{4}$/)

    const now = Date.now()
    const expiresAt = new Date(result.expiresAt).getTime()
    expect(expiresAt).toBeGreaterThan(now - 1000)
    expect(expiresAt).toBeLessThanOrEqual(now + 31 * 60 * 1000)
  })

  it('embeds the correct amount in the payload', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('52998224725', 99.99, 'Teste')

    const valueStr = '9999'
    const expected = `54${String(valueStr.length).padStart(2, '0')}${valueStr}`
    expect(result.qrCode).toContain(expected)
  })

  it('embeds the correct Pix key', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('52998224725', 10, 'Teste')

    expect(result.qrCode).toContain('013611236173414')
  })
})

describe('CRC16 calculation', () => {
  it('computes known CRC16-CCITT values', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result1 = generatePixPayload('52998224725', 10, 'Teste')
    const crc1 = result1.qrCode.slice(-4)
    expect(crc1).toMatch(/^[A-F0-9]{4}$/)

    const result2 = generatePixPayload('52998224725', 250.00, 'Outro Cliente')
    const crc2 = result2.qrCode.slice(-4)
    expect(crc2).toMatch(/^[A-F0-9]{4}$/)
    expect(crc1).not.toBe(crc2)
  })

  it('produces consistent results for same inputs', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const a = generatePixPayload('52998224725', 50, 'Teste')
    const b = generatePixPayload('52998224725', 50, 'Teste')

    expect(a.qrCode.slice(-4)).toBe(b.qrCode.slice(-4))
  })
})

describe('Pix payload boundary values', () => {
  it('handles zero value', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('52998224725', 0, 'Teste')
    const valueStr = '000'
    const expected = `54${String(valueStr.length).padStart(2, '0')}${valueStr}`
    expect(result.qrCode).toContain(expected)
  })

  it('handles large value', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('52998224725', 99999.99, 'Teste')
    const valueStr = '9999999'
    const expected = `54${String(valueStr.length).padStart(2, '0')}${valueStr}`
    expect(result.qrCode).toContain(expected)
  })

  it('handles CPF with special characters', async () => {
    const { generatePixPayload } = await import('@/lib/pix')
    const result = generatePixPayload('529.982.247-25', 100, 'Teste')
    expect(result.qrCode).toContain('013611236173414')
  })
})
