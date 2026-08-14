import type { Metadata } from 'next'
import Link from 'next/link'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { FadeUp, StaggerGrid } from '@/components/animations'

export const metadata: Metadata = {
  title: 'Modelos | Freitas Outlet',
  description: 'Encontre o estilo perfeito para você. Navegue por modelagens oversized, regular, slim, classic e mais.',
}

const modelos = [
  {
    slug: 'oversized',
    name: 'Oversized',
    description: 'Cortes amplos e soltos para um visual streetwear descontraído. Peças que priorizam conforto e atitude.',
    icon: 'oversized',
  },
  {
    slug: 'regular',
    name: 'Regular Fit',
    description: 'Corte clássico e reto, ideal para o dia a dia. Equilíbrio perfeito entre conforto e sofisticação.',
    icon: 'regular',
  },
  {
    slug: 'classic',
    name: 'Classic',
    description: 'Atemporal e elegante. Peças que nunca saem de moda e funcionam em diversas ocasiões.',
    icon: 'classic',
  },
  {
    slug: 'performance',
    name: 'Performance',
    description: 'Tecnologia e functionalidade para quem não abre mão de performance esportiva.',
    icon: 'performance',
  },
  {
    slug: 'luxo',
    name: 'Alta Costura',
    description: 'Peças de designer com acabamento premium. Exclusividade para quem busca o melhor.',
    icon: 'luxo',
  },
]

function getProductsByModelo(slug: string) {
  switch (slug) {
    case 'oversized':
      return products.filter(p => p.tags.some(t => t.includes('oversized')) || p.sizeGuide === 'oversized')
    case 'regular':
      return products.filter(p => p.tags.some(t => t.includes('casual') || t.includes('classico')) && p.sizeGuide !== 'oversized')
    case 'classic':
      return products.filter(p => p.tags.some(t => t.includes('classico') || t.includes('polo')))
    case 'performance':
      return products.filter(p => p.tags.some(t => t.includes('performance') || t.includes('corrida') || t.includes('esportivo') || t.includes('futebol')))
    case 'luxo':
      return products.filter(p => p.brand.segment === 'high-end')
    default:
      return []
  }
}

export default function ModelosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <h1 className="font-heading font-black text-3xl lg:text-5xl uppercase tracking-tighter mb-4">
            Modelos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre o estilo perfeito para você. Navegue por diferentes modelagens e descubra peças que combinam com seu jeito.
          </p>
        </div>
      </FadeUp>

      <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {modelos.map((modelo) => {
          const modeloProducts = getProductsByModelo(modelo.slug)
          if (modeloProducts.length === 0) return null
          return (
            <Link
              key={modelo.slug}
              href={`/modelos/${modelo.slug}`}
              className="group block bg-muted p-6 hover:bg-black hover:text-white transition-all duration-300"
            >
              <div className="mb-4">
                <span className="text-3xl">
                  {modelo.slug === 'oversized' && '🔥'}
                  {modelo.slug === 'regular' && '👔'}
                  {modelo.slug === 'classic' && '✨'}
                  {modelo.slug === 'performance' && '⚡'}
                  {modelo.slug === 'luxo' && '💎'}
                </span>
              </div>
              <h2 className="font-heading font-bold text-xl uppercase tracking-tight mb-2">{modelo.name}</h2>
              <p className="text-sm text-muted-foreground group-hover:text-white/70 transition-colors mb-4">{modelo.description}</p>
              <span className="text-xs font-medium uppercase tracking-wider group-hover:text-white/90 transition-colors">
                {modeloProducts.length} {modeloProducts.length === 1 ? 'produto' : 'produtos'} →
              </span>
            </Link>
          )
        })}
      </StaggerGrid>

      <FadeUp>
        <div className="text-center mb-8">
          <h2 className="font-heading font-bold text-2xl uppercase tracking-tight mb-2">
            Todos os Modelos
          </h2>
          <p className="text-sm text-muted-foreground">Explore todos os estilos disponíveis</p>
        </div>
      </FadeUp>

      <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </StaggerGrid>
    </div>
  )
}
