export interface CatalogImage {
  src: string
  category: string
  brand: string
  model: string
  label: string
}

export interface CatalogGroup {
  category: string
  brand: string
  model: string
  images: CatalogImage[]
}

export const catalogImages: CatalogImage[] = [
  // ══════════════════════════════════════════════
  // CHUTEIRAS
  // ══════════════════════════════════════════════
  { src: '/images/products/catalogo/chuteiras/nike/phantom/preto-branco.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Phantom', label: 'Preto e Branco' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-cima.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme (cima)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-sola.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme (sola)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-lateral.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme (lateral)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-detalhe.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme (detalhe)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-traseira.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme (traseira)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/creme-vermelho.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Creme e Vermelho' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/amarelo-lateral.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Amarelo (lateral)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/amarelo-cima.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Amarelo (cima)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/amarelo-azul.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Amarelo e Azul' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-lateral.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Prata (lateral)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-detalhe.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Prata (detalhe)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-cima.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Prata (cima)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-verde.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Prata e Verde' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/prata-sola.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Prata (sola)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/rosa-cima.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Rosa (cima)' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/rosa-laranja.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Rosa e Laranja' },
  { src: '/images/products/catalogo/chuteiras/nike/mercurial-superfly-9/rosa-lateral.jpg', category: 'Chuteiras', brand: 'Nike', model: 'Mercurial Superfly 9', label: 'Rosa (lateral)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/vermelho-preto.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Vermelho e Preto' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/vermelho-preto-2.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Vermelho e Preto (2)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/vermelho-lateral.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Vermelho (lateral)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-traseira.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Amarelo (traseira)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-preto.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Amarelo e Preto' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-lateral.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Amarelo (lateral)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-detalhe.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Amarelo (detalhe)' },
  { src: '/images/products/catalogo/chuteiras/adidas/adizero-adios-pro-3/amarelo-cima.jpg', category: 'Chuteiras', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Amarelo (cima)' },
  { src: '/images/products/catalogo/chuteiras/lotto/air-400/branco-colorido.jpg', category: 'Chuteiras', brand: 'Lotto', model: 'Air 400', label: 'Branco Colorido' },

  // ══════════════════════════════════════════════
  // TÊNIS
  // ══════════════════════════════════════════════
  { src: '/images/products/catalogo/tenis/on/cloudmonster/branco-multicolor.jpg', category: 'Tênis', brand: 'On', model: 'Cloudmonster', label: 'Branco Multicolor' },
  { src: '/images/products/catalogo/tenis/on/cloudmonster/branco-lateral.jpg', category: 'Tênis', brand: 'On', model: 'Cloudmonster', label: 'Branco (lateral)' },
  { src: '/images/products/catalogo/tenis/on/cloudmonster/branco-cima.jpg', category: 'Tênis', brand: 'On', model: 'Cloudmonster', label: 'Branco (cima)' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-traseira.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul (traseira)' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-sola.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul (sola)' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-lateral.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul (lateral)' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-detalhe.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul (detalhe)' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-claro.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul Claro' },
  { src: '/images/products/catalogo/tenis/nike/force-1/azul-cima.jpg', category: 'Tênis', brand: 'Nike', model: 'Force 1', label: 'Azul (cima)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-sola.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Preto (sola)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-roxo.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Preto e Roxo' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-lateral.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Preto (lateral)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-detalhe.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Preto (detalhe)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/preto-cima.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Preto (cima)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-traseira.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza (traseira)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-sola.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza (sola)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-lateral.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza (lateral)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-detalhe.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza (detalhe)' },
  { src: '/images/products/catalogo/tenis/nike/air-max-infinity/cinza-cima.jpg', category: 'Tênis', brand: 'Nike', model: 'Air Max Infinity', label: 'Cinza (cima)' },
  { src: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/vermelho.jpg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Vermelho' },
  { src: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/vermelho-lateral.jpg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Vermelho (lateral)' },
  { src: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/preto-lateral.jpg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Preto (lateral)' },
  { src: '/images/products/catalogo/tenis/adidas/adizero-adios-pro-3/preto-branco.jpg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Adios Pro 3', label: 'Preto e Branco' },

]

export function getCatalogGroups(): CatalogGroup[] {
  const groups = new Map<string, CatalogGroup>()

  for (const img of catalogImages) {
    const key = `${img.category}|${img.brand}|${img.model}`
    if (!groups.has(key)) {
      groups.set(key, { category: img.category, brand: img.brand, model: img.model, images: [] })
    }
    groups.get(key)!.images.push(img)
  }

  const order: Record<string, number> = { Chuteiras: 1, Tênis: 2 }

  return Array.from(groups.values()).sort((a, b) => {
    const catDiff = (order[a.category] ?? 99) - (order[b.category] ?? 99)
    if (catDiff !== 0) return catDiff
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand)
    return a.model.localeCompare(b.model)
  })
}
