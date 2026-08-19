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
  // TÊNIS
  // ══════════════════════════════════════════════
  // ── Adidas Adizero Evo SL (17 cores) ────────────────
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLAPretoEBranco.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Preto e Branco' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLAzul.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Azul' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLAzulEPrata.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Azul e Prata' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoEAzul.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Azul' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoEAzulBebe.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Azul Bebê' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoEDourado.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Dourado' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoEPreto.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Preto' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoEPretoFosco.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Preto Fosco' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLBrancoERosa.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Branco e Rosa' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLLaranja.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Laranja' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLLaranjaERosa.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Laranja e Rosa' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLMarromEDourado.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Marrom e Dourado' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLPretoEPrata.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Preto e Prata' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLPretoEVerde.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Preto e Verde' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLVerde.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Verde' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLVerdeEPreto.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Verde e Preto' },
  { src: '/images/products/catalogo/tenis/adidas/AdizeroEvoSLVermelho.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Adizero Evo SL', label: 'Vermelho' },

  // ── Adidas Ultra Boost 5 (4 cores) ──────────────────
  { src: '/images/products/catalogo/tenis/adidas/AdidasUltraBoost5Branco.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Ultra Boost 5', label: 'Branco' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasUltraBoost5Preto.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Ultra Boost 5', label: 'Preto' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasUltraBoost5Verde.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Ultra Boost 5', label: 'Verde' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasUltraBoost5Vermelho.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Ultra Boost 5', label: 'Vermelho' },

  // ── Adidas Drop Set (cores) ──────────────────────────
  { src: '/images/products/catalogo/tenis/adidas/AdidasDropSetBrancoEAzul.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Drop Set', label: 'Branco e Azul' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasDropSetBrancoEAzul2.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Drop Set', label: 'Branco e Azul (2)' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasDropSetBrancoEVermelho.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Drop Set', label: 'Branco e Vermelho' },
  { src: '/images/products/catalogo/tenis/adidas/AdidasDropSetBrancoEVermelho2.jpeg', category: 'Tênis', brand: 'Adidas', model: 'Drop Set', label: 'Branco e Vermelho (2)' },
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

  return Array.from(groups.values()).sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand)
    return a.model.localeCompare(b.model)
  })
}