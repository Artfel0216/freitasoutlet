import { Suspense } from 'react'
import { getPublicProducts } from '@/lib/public-products'
import { ProductGrid } from '@/components/product/ProductGrid'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Busca | Freitas Outlet',
}

function SearchForm({ query }: { query: string }) {
  return (
    <form action="/busca" method="GET" className="flex gap-2 mb-8">
      <input
        type="text"
        name="q"
        defaultValue={query}
        placeholder="Buscar produtos..."
        className="flex-1 border border-border px-4 py-3 text-sm focus:outline-none focus:border-black"
        autoFocus
      />
      <button type="submit" className="bg-black text-white px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
        Buscar
      </button>
    </form>
  )
}

async function SearchContent({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = (q || '').trim().toLowerCase()
  const products = await getPublicProducts()

  const results = query
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
      )
    : []

  return (
    <div>
      <h1 className="font-heading font-black text-2xl lg:text-3xl uppercase tracking-tighter mb-2">
        {query ? `Resultados para &ldquo;${query}&rdquo;` : 'Buscar Produtos'}
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        {query ? `${results.length} ${results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}` : 'Digite o que procura no campo acima.'}
      </p>

      {query && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">Nenhum produto encontrado para &ldquo;{query}&rdquo;.</p>
          <p className="text-sm text-muted-foreground mb-6">Tente termos diferentes ou navegue por categorias.</p>
          <Link href="/produtos" className="text-sm underline hover:no-underline">VER TODOS OS PRODUTOS</Link>
        </div>
      )}

      {results.length > 0 && <ProductGrid products={results} />}
    </div>
  )
}

export default async function BuscaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <SearchForm query={q} />
      <Suspense fallback={<div className="text-center py-12 text-muted-foreground">Buscando...</div>}>
        <SearchContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
