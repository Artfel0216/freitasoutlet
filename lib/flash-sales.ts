export interface FlashSale {
  productSlug: string
  discountPercent: number
  endsAt: string
  label: string
}

export const flashSales: FlashSale[] = [
  {
    productSlug: 'tenis-nike-air-max-infinity',
    discountPercent: 30,
    endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    label: 'OFERTA RELÂMPAGO',
  },
  {
    productSlug: 'tenis-nike-force-1',
    discountPercent: 25,
    endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    label: 'OFERTA RELÂMPAGO',
  },
]

export function getActiveFlashSales(): FlashSale[] {
  const now = new Date()
  return flashSales.filter((fs) => new Date(fs.endsAt) > now)
}

export function getFlashSaleForProduct(slug: string): FlashSale | undefined {
  return getActiveFlashSales().find((fs) => fs.productSlug === slug)
}
