import { Product } from '@/types'

export const products: Product[] = [
  // ═══════════════════════════════════════════════════════════════
  // CHUTEIRAS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'chuteira-nike-mercurial-superfly-9',
    name: 'Chuteira Nike Mercurial Superfly 9',
    slug: 'chuteira-nike-mercurial-superfly-9',
    brand: { id: 'nike', name: 'Nike', slug: 'nike', segment: 'sportswear' },
    category: { id: 'chuteiras-campo', name: 'Chuteiras Campo', slug: 'chuteiras-campo', parentId: 'futebol-performance' },
    description: 'Chuteira Nike Mercurial Superfly 9 Campo. Cabedal em Flyknit com tecnologia Aerotrack. Travas de ataque e velocidade. Fôrma mais justa — considere comprar um número maior.',
    price: 899.90,
    compareAtPrice: 1199.90,
    images: [
      '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-verde.jpg',
    ],
    colors: [
      { name: 'Prata e Verde', hex: '#C0C0C0', image: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-verde.jpg' },
      { name: 'Creme e Vermelho', hex: '#F5E6CA', image: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-vermelho.jpg' },
      { name: 'Rosa e Laranja', hex: '#FF69B4', image: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/rosa-laranja.jpg' },
      { name: 'Amarelo e Azul', hex: '#FFD700', image: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/amarelo-azul.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['nike', 'mercurial', 'superfly', 'chuteira', 'campo', 'futebol'],
    isNew: true,
    isTrending: true,
    createdAt: '2026-07-13',
    stock: { '37': 5, '38': 8, '39': 12, '40': 15, '41': 14, '42': 10, '43': 6 },
  },
  {
    id: 'chuteira-adidas-adizero-adios-pro-3',
    name: 'Chuteira Adidas Adizero Adios Pro 3',
    slug: 'chuteira-adidas-adizero-adios-pro-3',
    brand: { id: 'adidas', name: 'Adidas', slug: 'adidas', segment: 'sportswear' },
    category: { id: 'chuteiras-campo', name: 'Chuteiras Campo', slug: 'chuteiras-campo', parentId: 'futebol-performance' },
    description: 'Chuteira Adidas Adizero Adios Pro 3 com tecnologia Lightstrike Pro. Design aerodinâmico para máxima velocidade.',
    price: 799.90,
    compareAtPrice: 999.90,
    images: [
      '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-preto.jpg',
    ],
    colors: [
      { name: 'Amarelo e Preto', hex: '#FFD700', image: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-preto.jpg' },
      { name: 'Vermelho e Preto', hex: '#FF2020', image: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/vermelho-preto.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['adidas', 'adizero', 'chuteira', 'campo', 'velocidade'],
    isNew: true,
    createdAt: '2026-07-13',
    stock: { '37': 4, '38': 7, '39': 10, '40': 12, '41': 11, '42': 8, '43': 5 },
  },
  {
    id: 'chuteira-lotto-air-400',
    name: 'Chuteira Lotto Air 400',
    slug: 'chuteira-lotto-air-400',
    brand: { id: 'lotto', name: 'Lotto', slug: 'lotto', segment: 'sportswear' },
    category: { id: 'chuteiras-campo', name: 'Chuteiras Campo', slug: 'chuteiras-campo', parentId: 'futebol-performance' },
    description: 'Chuteira Lotto Air 400 com design colorido e moderno. Cabedal em material leve com acabamento premium.',
    price: 349.90,
    compareAtPrice: 449.90,
    images: [
      '/images/products/catalogo/chuteiras/lotto/air-400/branco-colorido.jpg',
    ],
    colors: [
      { name: 'Branco Colorido', hex: '#F5F5F5', image: '/images/products/catalogo/chuteiras/lotto/air-400/branco-colorido.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['lotto', 'air 400', 'chuteira', 'campo', 'colorida'],
    createdAt: '2026-07-13',
    stock: { '37': 3, '38': 6, '39': 8, '40': 10, '41': 8, '42': 6, '43': 4 },
  },
  {
    id: 'chuteira-nike-phantom',
    name: 'Chuteira Nike Phantom',
    slug: 'chuteira-nike-phantom',
    brand: { id: 'nike', name: 'Nike', slug: 'nike', segment: 'sportswear' },
    category: { id: 'chuteiras-campo', name: 'Chuteiras Campo', slug: 'chuteiras-campo', parentId: 'futebol-performance' },
    description: 'Chuteira Nike Phantom com design agressivo e preciso. Controle de bola aprimorado com textura no cabedal.',
    price: 699.90,
    compareAtPrice: 899.90,
    images: [
      '/images/products/catalogo/chuteiras/nike/phantom/preto-branco.jpg',
    ],
    colors: [
      { name: 'Preto e Branco', hex: '#1a1a1a', image: '/images/products/catalogo/chuteiras/nike/phantom/preto-branco.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['nike', 'phantom', 'chuteira', 'campo', 'controle'],
    createdAt: '2026-07-13',
    stock: { '37': 4, '38': 7, '39': 10, '40': 12, '41': 10, '42': 8, '43': 5 },
  },

  // ═══════════════════════════════════════════════════════════════
  // TÊNIS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'tenis-nike-air-max-infinity',
    name: 'Tênis Nike Air Max Infinity',
    slug: 'tenis-nike-air-max-infinity',
    brand: { id: 'nike', name: 'Nike', slug: 'nike', segment: 'sportswear' },
    category: { id: 'tenis-esportivos-m', name: 'Esportivos', slug: 'esportivos-m', parentId: 'calcados-masculinos' },
    description: 'Tênis Nike Air Max Infinity com amortecimento Air Max visível. Design futurista com tecnologia Air Zoom. Conforto e estilo para o dia a dia.',
    price: 799.90,
    compareAtPrice: 999.90,
    images: [
      '/images/products/catalogo/tenis/nike/air-max-infinity/cinza.jpg',
    ],
    colors: [
      { name: 'Cinza', hex: '#808080', image: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza.jpg' },
      { name: 'Preto e Roxo', hex: '#2a1a3a', image: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-roxo.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['nike', 'air max', 'infinity', 'esportivo', 'casual'],
    isNew: true,
    isTrending: true,
    createdAt: '2026-07-13',
    stock: { '37': 6, '38': 10, '39': 14, '40': 16, '41': 14, '42': 10, '43': 6 },
  },
  {
    id: 'tenis-nike-force-1',
    name: 'Tênis Nike Force 1',
    slug: 'tenis-nike-force-1',
    brand: { id: 'nike', name: 'Nike', slug: 'nike', segment: 'sportswear' },
    category: { id: 'sneakers-hype-m', name: 'Sneakers Hype', slug: 'sneakers-hype-m', parentId: 'calcados-masculinos' },
    description: 'Tênis Nike Force 1 em couro premium. Silhueta clássica com design clean. Perfeito para looks casuais e streetwear.',
    price: 599.90,
    images: [
      '/images/products/catalogo/tenis/nike/force-1/azul-claro.jpg',
    ],
    colors: [
      { name: 'Azul Claro', hex: '#87CEEB', image: '/images/products/catalogo/tenis/nike/force-1/azul-claro.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['nike', 'force 1', 'sneaker', 'casual', 'streetwear'],
    isTrending: true,
    createdAt: '2026-07-13',
    stock: { '37': 5, '38': 8, '39': 12, '40': 14, '41': 12, '42': 8, '43': 5 },
  },
  {
    id: 'tenis-on-cloudmonster',
    name: 'Tênis On Cloudmonster',
    slug: 'tenis-on-cloudmonster',
    brand: { id: 'on', name: 'On', slug: 'on', segment: 'sportswear' },
    category: { id: 'tenis-esportivos-m', name: 'Esportivos', slug: 'esportivos-m', parentId: 'calcados-masculinos' },
    description: 'Tênis On Cloudmonster com tecnologia CloudTec de amortecimento máximo. Design multicolorido vibrante. Ideal para corrida e uso diário.',
    price: 1099.90,
    images: [
      '/images/products/catalogo/tenis/on/cloudmonster/branco-multicolor.jpg',
    ],
    colors: [
      { name: 'Branco Multicolor', hex: '#F5F5F5', image: '/images/products/catalogo/tenis/on/cloudmonster/branco-multicolor.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['on', 'cloudmonster', 'corrida', 'performance', 'premium'],
    isNew: true,
    createdAt: '2026-07-13',
    stock: { '37': 3, '38': 5, '39': 8, '40': 10, '41': 8, '42': 6, '43': 4 },
  },
  {
    id: 'tenis-adidas-adizero-adios-pro-3',
    name: 'Tênis Adidas Adizero Adios Pro 3',
    slug: 'tenis-adidas-adizero-adios-pro-3',
    brand: { id: 'adidas', name: 'Adidas', slug: 'adidas', segment: 'sportswear' },
    category: { id: 'tenis-corrida-m', name: 'Corrida', slug: 'corrida-m', parentId: 'calcados-masculinos' },
    description: 'Tênis Adidas Adizero Adios Pro 3 com tecnologia Lightstrike Pro. Design de alta performance para corrida de velocidade.',
    price: 899.90,
    compareAtPrice: 1199.90,
    images: [
      '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/preto-branco.jpg',
    ],
    colors: [
      { name: 'Preto e Branco', hex: '#1a1a1a', image: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/preto-branco.jpg' },
      { name: 'Vermelho', hex: '#FF2020', image: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/vermelho.jpg' },
    ],
    sizes: ['37', '38', '39', '40', '41', '42', '43'],
    sizeGuide: 'footwear',
    tags: ['adidas', 'adizero', 'corrida', 'performance', 'velocidade'],
    isNew: true,
    createdAt: '2026-07-13',
    stock: { '37': 4, '38': 7, '39': 10, '40': 12, '41': 10, '42': 8, '43': 5 },
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category.slug === categorySlug || p.category.parentId === categorySlug)
}

export function getProductsByBrand(brandSlug: string): Product[] {
  return products.filter((p) => p.brand.slug === brandSlug)
}

export function getFilteredProducts(filters: {
  categories?: string[]
  brands?: string[]
  sizes?: string[]
  colors?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: string
  search?: string
}): Product[] {
  let result = [...products]

  if (filters.search) {
    const q = filters.search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
    )
  }

  if (filters.categories?.length) {
    result = result.filter((p) => filters.categories!.includes(p.category.slug) || filters.categories!.includes(p.category.parentId!))
  }

  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand.slug))
  }

  if (filters.sizes?.length) {
    result = result.filter((p) => p.sizes.some((s) => filters.sizes!.includes(s)))
  }

  if (filters.colors?.length) {
    result = result.filter((p) => p.colors.some((c) => filters.colors!.includes(c.hex)))
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!)
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      break
  }

  return result
}
