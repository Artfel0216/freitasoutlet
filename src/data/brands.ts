import { Brand } from '@/types'

export const brands: Brand[] = [
  { id: 'nike', name: 'Nike', slug: 'nike', segment: 'sportswear' },
  { id: 'adidas', name: 'Adidas', slug: 'adidas', segment: 'sportswear' },
  { id: 'puma', name: 'Puma', slug: 'puma', segment: 'sportswear' },
  { id: 'new-balance', name: 'New Balance', slug: 'new-balance', segment: 'sportswear' },
  { id: 'on', name: 'On', slug: 'on', segment: 'sportswear' },
  { id: 'reserva', name: 'Reserva', slug: 'reserva', segment: 'premium' },
  { id: 'lacoste', name: 'Lacoste', slug: 'lacoste', segment: 'premium' },
  { id: 'polo-ralph-lauren', name: 'Polo Ralph Lauren', slug: 'polo-ralph-lauren', segment: 'premium' },
  { id: 'calvin-klein', name: 'Calvin Klein', slug: 'calvin-klein', segment: 'premium' },
  { id: 'vans', name: 'Vans', slug: 'vans', segment: 'streetwear' },
  { id: 'hugo-boss', name: 'Hugo Boss', slug: 'hugo-boss', segment: 'high-end' },
  { id: 'ricardo-almeida', name: 'Ricardo Almeida', slug: 'ricardo-almeida', segment: 'high-end' },
  { id: 'alexander-mcqueen', name: 'Alexander McQueen', slug: 'alexander-mcqueen', segment: 'high-end' },
  { id: 'gucci', name: 'Gucci', slug: 'gucci', segment: 'high-end' },
  { id: 'louis-vuitton', name: 'Louis Vuitton', slug: 'louis-vuitton', segment: 'high-end' },
]

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}
