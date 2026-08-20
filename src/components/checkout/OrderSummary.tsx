'use client'

import { motion } from 'framer-motion'
import type { CartItem } from '@/types'
import type { ShippingOption } from '@/components/checkout/checkout-utils'
import { formatBRL } from '@/components/checkout/checkout-utils'
import { getEffectivePrice } from '@/lib/pricing'

interface OrderSummaryProps {
  items: CartItem[]
  totalPrice: number
  selectedShipping: string
  shippingOptions: ShippingOption[]
  getDiscount: () => number
  tier: string
  points: number
  couponDiscount: number
}

export function OrderSummary({ items, totalPrice, selectedShipping, shippingOptions, getDiscount, tier, points, couponDiscount }: OrderSummaryProps) {
  const selectedOption = shippingOptions.find((o) => o.service === selectedShipping)
  const shippingPrice = selectedOption?.price || 0
  const loyaltyDiscount = totalPrice * getDiscount() / 100
  const couponDiscountValue = totalPrice * couponDiscount
  const total = totalPrice + shippingPrice - loyaltyDiscount - couponDiscountValue

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
    >
      <div className="border border-border p-6 lg:sticky lg:top-24">
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">
          Resumo do Pedido ({items.length} {items.length === 1 ? 'item' : 'itens'})
        </h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <motion.div
              key={`${item.product.id}-${item.selectedSize}`}
              className="flex gap-3 text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="w-12 h-12 bg-muted shrink-0 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-[8px] text-muted-foreground text-center">{item.product.brand.name}</span>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{item.product.name}</p>
                <p className="text-[11px] text-muted-foreground">{item.selectedSize} / Qtd: {item.quantity}</p>
                <p className="text-xs font-bold mt-0.5">{formatBRL(getEffectivePrice(item.product, item.quantity) * item.quantity)}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatBRL(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span className="font-medium">
              {selectedShipping && shippingOptions.length > 0
                ? formatBRL(shippingPrice)
                : 'Calcular após o CEP'}
            </span>
          </div>
          {getDiscount() > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Desconto Fidelidade ({tier} — {getDiscount()}%)</span>
              <span className="font-medium">- {formatBRL(loyaltyDiscount)}</span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex justify-between text-green-700">
              <span>Cupom de Desconto</span>
              <span className="font-medium">- {formatBRL(couponDiscountValue)}</span>
            </div>
          )}
          {totalPrice > 0 && getDiscount() === 0 && couponDiscount === 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desconto</span>
              <span className="font-medium">{formatBRL(0)}</span>
            </div>
          )}
          {points > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Seus pontos</span>
              <span>{points} pts</span>
            </div>
          )}
          <motion.div
            className="flex justify-between font-heading font-bold text-lg border-t border-border pt-4"
            key={total}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span>Total</span>
            <span>{formatBRL(total)}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}