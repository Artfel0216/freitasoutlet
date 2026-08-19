'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { OfferBadge } from '@/components/product/OfferBadge'
import { FlashSaleTimer } from '@/components/product/FlashSaleTimer'
import type { ProductInfoProps } from './product-info/shared'
import { PriceBlock } from './product-info/PriceBlock'
import { WholesalePricing } from './product-info/WholesalePricing'
import { ColorPicker } from './product-info/ColorPicker'
import { SizePicker } from './product-info/SizePicker'
import { QuantityStepper } from './product-info/QuantityStepper'
import { AddToCartActions } from './product-info/AddToCartActions'
import { ProductTrustBadges } from './product-info/ProductTrustBadges'

const SocialShare = dynamic(() => import('@/components/product/SocialShare').then((mod) => mod.SocialShare), {
  ssr: false,
  loading: () => null,
})

export function ProductInfo({ product, purchase }: ProductInfoProps) {
  const { flashSale } = purchase

  return (
    <motion.div
      className="lg:sticky lg:top-24 lg:self-start space-y-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15, duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
          {product.brand.name}
        </p>
        <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <OfferBadge offerStatus={product.offerStatus} offerType={product.offerType} detailed />
        </div>
      </motion.div>

      <PriceBlock product={product} purchase={purchase} />

      <WholesalePricing product={product} purchase={purchase} />

      {flashSale && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <FlashSaleTimer endsAt={flashSale.endsAt} label={flashSale.label} />
        </motion.div>
      )}

      <motion.p
        className="text-sm text-muted-foreground leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: flashSale ? 0.4 : 0.35 }}
      >
        {product.description}
      </motion.p>

      <ColorPicker product={product} purchase={purchase} />
      <SizePicker product={product} purchase={purchase} />
      <QuantityStepper purchase={purchase} />
      <AddToCartActions product={product} purchase={purchase} />

      <div className="pt-2">
        <SocialShare
          url={`${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/produtos/${product.slug}`}
          title={product.name}
        />
      </div>

      <ProductTrustBadges />
    </motion.div>
  )
}