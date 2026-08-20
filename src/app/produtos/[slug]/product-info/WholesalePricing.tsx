import { motion } from 'framer-motion'
import { formatPrice, type ProductInfoProps } from './shared'
import { getUnitPrice, WHOLESALE_MIN_QUANTITY, WHOLESALE_DISCOUNT_PERCENT } from '@/lib/wholesale'

export function WholesalePricing({ product, purchase }: ProductInfoProps) {
  const { quantity } = purchase
  const isWholesale = quantity >= WHOLESALE_MIN_QUANTITY

  const tiers = [
    { label: `1 a ${WHOLESALE_MIN_QUANTITY - 1} pares`, price: product.price, active: !isWholesale },
    { label: `${WHOLESALE_MIN_QUANTITY}+ pares`, price: getUnitPrice(product.price, WHOLESALE_MIN_QUANTITY), active: isWholesale },
  ]

  return (
    <motion.div
      className="border border-border rounded-lg p-4 bg-muted/40"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <p className="text-xs font-bold uppercase tracking-wider mb-3">Preço no Atacado</p>
      <div className="space-y-1.5">
        {tiers.map((tier) => (
          <div
            key={tier.label}
            className={`flex items-center justify-between text-sm rounded px-2 py-1 ${
              tier.active ? 'bg-green-700 text-white font-semibold' : 'text-muted-foreground'
            }`}
          >
            <span>{tier.label}</span>
            <span>{formatPrice(tier.price)}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        A partir de {WHOLESALE_MIN_QUANTITY} pares você ganha {WHOLESALE_DISCOUNT_PERCENT}% de desconto.
      </p>
    </motion.div>
  )
}