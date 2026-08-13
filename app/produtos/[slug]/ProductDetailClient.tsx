'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/types'
import { Button } from '@/components/ui/Button'
import { SizeGuide } from '@/components/product/SizeGuide'
import { SizeRecommendation } from '@/components/product/SizeRecommendation'
import { useCart } from '@/context/CartContext'
import { useRecentlyViewed } from '@/lib/recently-viewed'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'
import { stagger, staggerItem } from '@/components/animations'
import { WishlistButton } from '@/components/product/WishlistButton'
import { ProductReviews } from '@/components/product/ProductReviews'
import { SocialShare } from '@/components/product/SocialShare'
import { CompareButton } from '@/components/product/CompareButton'
import { NotifyWhenAvailable } from '@/components/product/NotifyWhenAvailable'
import { FlashSaleTimer } from '@/components/product/FlashSaleTimer'
import { getFlashSaleForProduct } from '@/lib/flash-sales'
import { UnboxingVideoPlayer } from '@/components/ui/UnboxingVideoPlayer'

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { add: addToRecentlyViewed } = useRecentlyViewed()

  useEffect(() => { addToRecentlyViewed(product) }, [addToRecentlyViewed, product])

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0

  const flashSale = getFlashSaleForProduct(product.slug)
  const flashSalePrice = flashSale ? product.price * (1 - flashSale.discountPercent / 100) : null

  const stock = product.stock?.[selectedSize] ?? 0
  const isOutOfStock = stock === 0
  const isLowStock = stock > 0 && stock <= 5

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addItem(product, selectedSize, selectedColor, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="aspect-square relative overflow-hidden bg-muted"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
          <motion.div
            className="grid grid-cols-4 gap-2"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {product.images.map((img, i) => (
              <motion.div
                key={i}
                className="aspect-square relative bg-muted overflow-hidden"
                variants={staggerItem}
              >
                <Image
                  src={img}
                  alt={`${product.name} - Foto ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, 10vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </motion.div>
          {product.video && (
            <motion.div
              className="aspect-video relative overflow-hidden bg-black"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <UnboxingVideoPlayer url={product.video} />
            </motion.div>
          )}
        </motion.div>

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
              {product.offerStatus && product.offerStatus !== 'none' && (
                <span className={`text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1 ${
                  product.offerStatus === 'sale' ? 'bg-blue-600 text-white' :
                  product.offerStatus === 'promotion' ? 'bg-purple-600 text-white' :
                  'bg-orange-600 text-white'
                }`}>
                  {product.offerStatus === 'sale' ? 'Em Oferta' :
                   product.offerStatus === 'promotion' ? 'Em Promoção' : 'Queima de Estoque'}
                </span>
              )}
              {product.offerType && product.offerType !== 'none' && (
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider px-2 py-1 bg-black text-white">
                  {product.offerType === 'weekly' ? 'Oferta Semanal' : 'Oferta Mensal'}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            className="flex items-baseline gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {flashSale && flashSalePrice ? (
              <>
                <span className="font-heading font-bold text-3xl text-red-600">
                  R$ {flashSalePrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                <motion.span
                  className="text-xs font-heading font-bold bg-red-600 text-white px-2 py-0.5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                >
                  -{flashSale.discountPercent}%
                </motion.span>
              </>
            ) : (
              <>
                <span className="font-heading font-bold text-3xl">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">
                      R$ {product.compareAtPrice!.toFixed(2).replace('.', ',')}
                    </span>
                    <motion.span
                      className="text-xs font-heading font-bold bg-black text-white px-2 py-0.5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                    >
                      -{discountPercent}%
                    </motion.span>
                  </>
                )}
              </>
            )}
          </motion.div>

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

          {product.colors.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-2">
                Cor: <span className="text-muted-foreground font-normal normal-case">{selectedColor.name}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.hex}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor.hex === color.hex ? 'border-black scale-110' : 'border-border hover:border-black'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {product.sizes[0] !== 'Único' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold uppercase tracking-wider">
                    Tamanho: <span className="text-muted-foreground font-normal normal-case">{selectedSize}</span>
                  </p>
                  <SizeRecommendation sizeGuide={product.sizeGuide} />
                </div>
                <SizeGuide type={product.sizeGuide} />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-sm font-medium border transition-all ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : 'border-border hover:border-black'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center border border-border">
              <motion.button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-sm hover:bg-muted transition-colors"
                aria-label="Diminuir quantidade"
                whileTap={{ scale: 0.9 }}
              >
                -
              </motion.button>
              <motion.span
                key={quantity}
                className="px-4 py-2 text-sm font-medium border-x border-border min-w-[3rem] text-center block"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {quantity}
              </motion.span>
              <motion.button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-sm hover:bg-muted transition-colors"
                aria-label="Aumentar quantidade"
                whileTap={{ scale: 0.9 }}
              >
                +
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={addedToCart ? 'added' : 'add'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={addedToCart ? '!bg-green-600 !text-white !border-green-600' : ''}
                  >
                    {isOutOfStock ? 'FORA DE ESTOQUE' : addedToCart ? 'ADICIONADO AO CARRINHO' : 'ADICIONAR AO CARRINHO'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>
            <WishlistButton productId={product.id} className="border border-border rounded-lg hover:border-black transition-colors" />
            <CompareButton product={product} />
          </motion.div>

          {isOutOfStock && (
            <NotifyWhenAvailable productId={product.id} selectedSize={selectedSize} />
          )}
          {isLowStock && !isOutOfStock && (
            <p className="text-xs text-orange-600 font-medium">Estoque baixo! Apenas {stock} {stock === 1 ? 'unidade' : 'unidades'} restante{stock === 1 ? '' : 's'}</p>
          )}

          <div className="pt-2">
            <SocialShare url={`${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/produtos/${product.slug}`} title={product.name} />
          </div>

          <motion.div
            className="border-t border-border pt-6 space-y-3 text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Produto 100% original com garantia de autenticidade
            </motion.div>
            <motion.div
              className="flex items-center gap-2"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Frete para todo Brasil
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
        <div className="max-w-3xl">
          <ProductReviews productId={product.id} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 lg:mt-24">
        <RecentlyViewed />
      </div>
    </div>
  )
}
