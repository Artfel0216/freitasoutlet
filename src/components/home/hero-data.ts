import type { Variants } from 'framer-motion'

export const heroProduct = {
  name: 'Nike Air Max Infinity',
  slug: 'tenis-nike-air-max-infinity',
  price: 'R$ 799,90',
  compareAtPrice: 'R$ 999,90',
  image: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-lateral.jpg',
}

export const brands = [
  'Nike',
  'Adidas',
  'Gucci',
  'Alexander McQueen',
  'Louis Vuitton',
  'Hugo Boss',
  'On',
  'Puma',
]

export const heroTags = [
  { label: 'Frete Grátis +R$ 299' },
  { label: '12x sem juros' },
  { label: '100% original' },
]

export const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export const lineGrow: Variants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { scaleX: 1, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } },
}