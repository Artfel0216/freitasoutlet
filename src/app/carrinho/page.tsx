'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CouponInput } from '@/components/CouponInput'
import { stagger, staggerItem, fadeUp } from '@/components/animations'
import { getEffectivePrice } from '@/lib/pricing'
import { isWholesaleQuantity } from '@/lib/wholesale'

function getStoredCoupon(): { code: string; discount: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('fo_coupon')
    if (stored) return JSON.parse(stored)
  } catch {}
  return null
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(getStoredCoupon)

  const discountedTotal = coupon ? totalPrice * (1 - coupon.discount) : totalPrice

  function handleCouponApply(discount: number, code: string) {
    const newCoupon = discount > 0 ? { code, discount } : null
    setCoupon(newCoupon)
    if (newCoupon) {
      try { localStorage.setItem('fo_coupon', JSON.stringify(newCoupon)) } catch {}
    } else {
      try { localStorage.removeItem('fo_coupon') } catch {}
    }
  }

  if (items.length === 0) {
    return (
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-4">
          Carrinho Vazio
        </h1>
        <p className="text-muted-foreground mb-8">Seu carrinho está vazio. Explore nossos produtos.</p>
        <Link href="/produtos">
          <Button variant="primary" size="lg">
            VER PRODUTOS
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Breadcrumbs items={[{ label: 'Carrinho' }]} />

      <motion.h1
        className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-8"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        Carrinho
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <motion.div
          className="lg:col-span-2 space-y-4"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                layout
                variants={staggerItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.3 }}
                className="flex gap-4 p-4 border border-border"
              >
                <motion.div
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-muted shrink-0 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-[10px] text-muted-foreground text-center px-1">
                    {item.product.brand.name}
                  </span>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <Link href={`/produtos/${item.product.slug}`} className="hover:underline">
                    <h3 className="text-sm font-semibold">{item.product.name}</h3>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.selectedSize} / {item.selectedColor.name}
                  </p>
                  <p className="text-sm font-heading font-bold mt-1">
                    R$ {getEffectivePrice(item.product, item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                  {isWholesaleQuantity(item.quantity) && (
                    <p className="text-[11px] text-green-700 font-medium mt-0.5">Preço de atacado aplicado</p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border">
                      <motion.button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.name, item.quantity - 1)}
                        className="px-2 py-1 text-xs hover:bg-muted"
                        aria-label="Diminuir"
                        whileTap={{ scale: 0.9 }}
                      >
                        -
                      </motion.button>
                      <motion.span
                        key={item.quantity}
                        className="px-3 py-1 text-xs font-medium border-x border-border block"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.quantity}
                      </motion.span>
                      <motion.button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor.name, item.quantity + 1)}
                        className="px-2 py-1 text-xs hover:bg-muted"
                        aria-label="Aumentar"
                        whileTap={{ scale: 0.9 }}
                      >
                        +
                      </motion.button>
                    </div>

                    <motion.button
                      onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor.name)}
                      className="text-xs text-muted-foreground hover:text-black underline"
                      whileTap={{ scale: 0.9 }}
                    >
                      Remover
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  className="text-right shrink-0"
                  layout
                >
                  <motion.p
                    className="text-sm font-heading font-bold"
                    key={`total-${item.quantity}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.15 }}
                  >
                    R$ {(getEffectivePrice(item.product, item.quantity) * item.quantity).toFixed(2).replace('.', ',')}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="lg:sticky lg:top-24 lg:self-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="border border-border p-6 space-y-4">
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Resumo do Pedido</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <motion.span
                  className="font-medium"
                  key={totalPrice}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </motion.span>
              </div>
              <CouponInput onApply={handleCouponApply} applied={coupon} />
              {coupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Desconto ({coupon.code})</span>
                  <span className="text-green-600">-{((totalPrice * coupon.discount)).toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground">Calculado no checkout</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between font-heading font-bold text-lg">
                <span>Total</span>
                <motion.span
                  key={discountedTotal}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  R$ {discountedTotal.toFixed(2).replace('.', ',')}
                </motion.span>
              </div>
            </div>

            <Link href="/checkout">
              <Button variant="primary" size="lg" fullWidth>
                SEGUIR PARA O CHECKOUT
              </Button>
            </Link>

            <Link href="/produtos" className="block text-center text-xs underline hover:no-underline">
              Continuar Comprando
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
