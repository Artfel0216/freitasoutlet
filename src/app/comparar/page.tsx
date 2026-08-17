'use client'

import { useCompare } from '@/context/CompareContext'
import Image from 'next/image'
import Link from 'next/link'

export default function ComparePage() {
  const { items, removeItem } = useCompare()

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="font-heading font-black text-3xl uppercase tracking-tighter mb-4">Comparar Produtos</h1>
        <p className="text-muted-foreground mb-6">Nenhum produto selecionado para comparação.</p>
        <Link href="/produtos" className="text-sm font-medium uppercase tracking-wider border border-border px-6 py-3 inline-block hover:bg-muted transition-colors">
          VER PRODUTOS
        </Link>
      </div>
    )
  }

  const attributes = [
    { label: 'Marca', getValue: (p: typeof items[0]) => p.brand.name },
    { label: 'Categoria', getValue: (p: typeof items[0]) => p.category.name },
    { label: 'Preço', getValue: (p: typeof items[0]) => `R$ ${p.price.toFixed(2).replace('.', ',')}` },
    { label: 'Preço Original', getValue: (p: typeof items[0]) => p.compareAtPrice ? `R$ ${p.compareAtPrice.toFixed(2).replace('.', ',')}` : '-' },
    { label: 'Cores', getValue: (p: typeof items[0]) => p.colors.map(c => c.name).join(', ') },
    { label: 'Tamanhos', getValue: (p: typeof items[0]) => p.sizes.join(', ') },
    { label: 'Tipo de Fôrma', getValue: (p: typeof items[0]) => p.sizeGuide === 'oversized' ? 'Oversized' : p.sizeGuide === 'footwear' ? 'Calçado' : 'Regular' },
    { label: 'Novo', getValue: (p: typeof items[0]) => p.isNew ? 'Sim' : 'Não' },
    { label: 'Em Alta', getValue: (p: typeof items[0]) => p.isTrending ? 'Sim' : 'Não' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-heading font-black text-3xl lg:text-4xl uppercase tracking-tighter mb-8">
        Comparar Produtos ({items.length})
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-4 bg-muted text-xs font-medium uppercase tracking-wider w-40">Produto</th>
              {items.map((product) => (
                <th key={product.id} className="p-4 bg-muted text-center">
                  <div className="relative aspect-square bg-white mx-auto mb-3 w-24 h-24 overflow-hidden">
                    {product.images.length > 0 ? (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="96px" />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground uppercase tracking-wider px-2 text-center">Sem imagem</span>
                    )}
                  </div>
                  <Link href={`/produtos/${product.slug}`} className="text-sm font-semibold hover:underline block mb-1">
                    {product.name}
                  </Link>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-muted-foreground hover:text-red-500 mt-1"
                  >
                    Remover
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attributes.map((attr, i) => (
              <tr key={attr.label} className={i % 2 === 0 ? 'bg-white' : 'bg-muted/50'}>
                <td className="p-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">{attr.label}</td>
                {items.map((product) => (
                  <td key={product.id} className="p-4 text-sm text-center">
                    {attr.getValue(product)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 text-center">
        <Link href="/produtos" className="text-sm font-medium uppercase tracking-wider border border-border px-6 py-3 inline-block hover:bg-muted transition-colors">
          ADICIONAR MAIS PRODUTOS
        </Link>
      </div>
    </div>
  )
}
