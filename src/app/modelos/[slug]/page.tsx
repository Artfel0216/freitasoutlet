import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { FadeUp, StaggerGrid } from '@/components/animations'
import Link from 'next/link'

const modelos = {
  oversized: {
    name: 'Oversized',
    description: 'Cortes amplos e soltos para um visual streetwear descontraído. Peças que priorizam conforto e atitude. Ideal para quem gosta de looks despojados e modernos.',
    tips: ['Compre seu tamanho habitual para caimento solto', 'Combine com peças mais ajustadas no equilíbrio', 'Funciona bem com tênis chunky ou sneakers icônicos'],
  },
  regular: {
    name: 'Regular Fit',
    description: 'Corte clássico e reto, ideal para o dia a dia. Equilíbrio perfeito entre conforto e sofisticação. Versátil para looks casuais e formais.',
    tips: ['Corte que acompanha o formato natural do corpo', 'Perfeito para uso diário no trabalho ou lazer', 'Combine com calça jeans ou bermuda'],
  },
  classic: {
    name: 'Classic',
    description: 'Atemporal e elegante. Peças que nunca saem de moda e funcionam em diversas ocasiões. Do escritório ao happy hour.',
    tips: ['Invista em cores neutras: preto, branco, azul marinho', 'Camisas polo são versáteis o ano todo', 'Combine com calça chino para um look impecável'],
  },
  performance: {
    name: 'Performance',
    description: 'Tecnologia e funcionalidade para quem não abre mão de performance esportiva. Do campo à academia, com estilo.',
    tips: ['Tecidos Dri-FIT e HEAT.RDY mantêm você seco', 'Chuteiras e tênis de corrida com tecnologia de ponta', 'Ideal para treinos e competições'],
  },
  luxo: {
    name: 'Alta Costura',
    description: 'Peças de designer com acabamento premium. Exclusividade para quem busca o melhor. Marcas como Gucci, McQueen e Louis Vuitton.',
    tips: ['Peças statement que definem o look', 'Invista em itens atemporais de luxo', 'Cuide bem: follow as instruções de conservação'],
  },
}

function getProductsBySlug(slug: string) {
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const modelo = modelos[slug as keyof typeof modelos]
  if (!modelo) return { title: 'Modelo não encontrado' }
  return {
    title: `${modelo.name} | Freitas Outlet`,
    description: modelo.description,
  }
}

export default async function ModeloDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const modelo = modelos[slug as keyof typeof modelos]
  if (!modelo) notFound()

  const modeloProducts = getProductsBySlug(slug)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <FadeUp>
        <nav className="text-sm text-muted-foreground mb-8">
          <Link href="/modelos" className="hover:text-black transition-colors">Modelos</Link>
          <span className="mx-2">/</span>
          <span className="text-black font-medium">{modelo.name}</span>
        </nav>

        <h1 className="font-heading font-black text-3xl lg:text-5xl uppercase tracking-tighter mb-4">
          {modelo.name}
        </h1>
        <p className="text-muted-foreground max-w-2xl mb-8">{modelo.description}</p>

        <div className="bg-muted p-6 mb-12">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-3">Dicas de Estilo</h3>
          <ul className="space-y-2">
            {modelo.tips.map((tip, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-black mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </FadeUp>

      {modeloProducts.length > 0 ? (
        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {modeloProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </StaggerGrid>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Nenhum produto encontrado para este modelo.</p>
          <Link href="/produtos" className="text-sm font-medium underline mt-2 inline-block">Ver todos os produtos</Link>
        </div>
      )}
    </div>
  )
}
