import { motion } from 'framer-motion'
import { formatPrice, type ProductInfoProps } from './shared'

const tiers = [
  { min: '1 a 5 pares', price: null },
  { min: '6+ pares', price: 339.99 },
  { min: '10+ pares', price: 310 },
]

export function WholesalePricing({ product }: ProductInfoProps) {
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
            key={tier.min}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">{tier.min}</span>
            <span className="font-semibold">
              {tier.price === null ? formatPrice(product.price) : formatPrice(tier.price)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Compre acima de 6 pares e garanta o melhor preço.
      </p>
    </motion.div>
  )
}