import { getProductById } from '@/data/products'
import { queryOne } from '@/lib/database'
import { logger } from '@/lib/logger'
import type { CheckoutItem } from './idempotency'

export type { CheckoutItem } from './idempotency'

export type ItemsVerification =
  | { ok: true }
  | { ok: false; status: number; error: string }

export async function verifyItems(items: CheckoutItem[]): Promise<ItemsVerification> {
  for (const item of items) {
    let serverPrice: number | undefined
    let sizeStock: number | undefined

    const staticProduct = getProductById(item.productId)
    if (staticProduct) {
      serverPrice = staticProduct.price
      sizeStock = staticProduct.stock?.[item.size]
    } else {
      try {
        const row = (await queryOne('SELECT price, stock FROM products WHERE id = $1 AND active = 1', [
          item.productId,
        ])) as { price: number; stock: string } | undefined
        if (row) {
          serverPrice = Number(row.price)
          const stock = JSON.parse(row.stock || '{}') as Record<string, number>
          sizeStock = stock[item.size]
        }
      } catch {}
    }

    if (serverPrice === undefined) {
      return { ok: false, status: 400, error: `Produto ${item.productName} não encontrado` }
    }

    if (Math.abs(item.unitPrice - serverPrice) > 0.01) {
      logger.warn('Price mismatch detected', { productId: item.productId, clientPrice: item.unitPrice, serverPrice })
      return { ok: false, status: 400, error: `Preço inválido para ${item.productName}` }
    }

    if (sizeStock === undefined) continue
    if (sizeStock < item.quantity) {
      return {
        ok: false,
        status: 409,
        error: `Estoque insuficiente para ${item.productName} (tamanho ${item.size}). Disponível: ${sizeStock}`,
      }
    }
  }

  return { ok: true }
}

export function calculateSubtotal(items: CheckoutItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
}