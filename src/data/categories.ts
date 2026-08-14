import { ProductCategory } from '@/types'

export const categories: ProductCategory[] = [
  {
    id: 'calcados-masculinos',
    name: 'Calçados Masculinos',
    slug: 'calcados-masculinos',
    parentId: null,
    children: [
      { id: 'tenis-esportivos-m', name: 'Esportivos', slug: 'esportivos-m', parentId: 'calcados-masculinos' },
      { id: 'tenis-casuais-m', name: 'Casual', slug: 'casuais-m', parentId: 'calcados-masculinos' },
      { id: 'chuteiras-m', name: 'Chuteiras', slug: 'chuteiras-m', parentId: 'calcados-masculinos' },
      { id: 'sneakers-hype-m', name: 'Sneakers Hype', slug: 'sneakers-hype-m', parentId: 'calcados-masculinos' },
    ],
  },
  {
    id: 'calcados-femininos',
    name: 'Calçados Femininos',
    slug: 'calcados-femininos',
    parentId: null,
    children: [
      { id: 'tenis-esportivos-f', name: 'Esportivos', slug: 'esportivos-f', parentId: 'calcados-femininos' },
      { id: 'tenis-casuais-f', name: 'Casual', slug: 'casuais-f', parentId: 'calcados-femininos' },
    ],
  },
  {
    id: 'vestuario-premium',
    name: 'Vestuário Premium',
    slug: 'vestuario-premium',
    parentId: null,
    children: [
      { id: 'camisas-polo', name: 'Camisas Polo', slug: 'camisas-polo', parentId: 'vestuario-premium' },
      { id: 'camisas-peruanas', name: 'Camisas Peruanas', slug: 'camisas-peruanas', parentId: 'vestuario-premium' },
      { id: 'camisas-oversized', name: 'Camisas Oversized', slug: 'camisas-oversized', parentId: 'vestuario-premium' },
    ],
  },
  {
    id: 'futebol-performance',
    name: 'Futebol & Performance',
    slug: 'futebol-performance',
    parentId: null,
    children: [
      { id: 'camisas-time', name: 'Camisas de Time', slug: 'camisas-time', parentId: 'futebol-performance' },
      { id: 'chuteiras-campo', name: 'Chuteiras Campo', slug: 'chuteiras-campo', parentId: 'futebol-performance' },
    ],
  },
  {
    id: 'acessorios',
    name: 'Acessórios',
    slug: 'acessorios',
    parentId: null,
    children: [
      { id: 'bones', name: 'Bonés', slug: 'bones', parentId: 'acessorios' },
      { id: 'carteiras', name: 'Carteiras em Couro', slug: 'carteiras', parentId: 'acessorios' },
    ],
  },
]

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  for (const cat of categories) {
    if (cat.slug === slug) return cat
    if (cat.children) {
      const child = cat.children.find((c) => c.slug === slug)
      if (child) return child
    }
  }
}

export function getAllChildSlugs(parentSlug: string): string[] {
  const parent = categories.find((c) => c.slug === parentSlug)
  if (!parent?.children) return [parentSlug]
  return [parentSlug, ...parent.children.map((c) => c.slug)]
}
