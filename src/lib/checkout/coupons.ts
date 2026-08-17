import { queryOne, queryRun } from '@/lib/database'

export interface CouponValidation {
  valid: boolean
  discount: number
  error?: string
}

export async function validateCoupon(code: string, orderTotal: number): Promise<CouponValidation> {
  if (!code) return { valid: false, discount: 0, error: 'Cupom obrigatório' }
  try {
    const row = await queryOne('SELECT * FROM coupons WHERE code = $1', [code.toUpperCase()])
    if (!row) return { valid: false, discount: 0, error: 'Cupom inválido' }
    if (!row.active) return { valid: false, discount: 0, error: 'Cupom inativo' }
    if (row.expires_at && new Date(row.expires_at as string) < new Date()) {
      return { valid: false, discount: 0, error: 'Cupom expirado' }
    }
    if (row.max_uses && (row.used_count as number) >= (row.max_uses as number)) {
      return { valid: false, discount: 0, error: 'Cupom atingiu o limite de uso' }
    }
    if (row.min_order && orderTotal < Number(row.min_order)) {
      return {
        valid: false,
        discount: 0,
        error: `Pedido mínimo de R$ ${Number(row.min_order).toFixed(2).replace('.', ',')}`,
      }
    }

    let discount = 0
    if (row.discount_type === 'percent') {
      discount = (orderTotal * Number(row.discount_value)) / 100
    } else {
      discount = Math.min(Number(row.discount_value), orderTotal)
    }
    return { valid: true, discount }
  } catch {
    return { valid: false, discount: 0, error: 'Erro ao validar cupom' }
  }
}

export async function incrementCouponUsage(code: string): Promise<void> {
  await queryRun('UPDATE coupons SET used_count = used_count + 1 WHERE code = $1', [code.toUpperCase()])
}