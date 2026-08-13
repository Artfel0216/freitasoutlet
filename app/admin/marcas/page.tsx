import type { Brand } from '@/types'
import { brands as staticBrands } from '@/data/brands'
import { readStoredBrands, type StoredBrand } from '@/lib/admin-brands'
import { AdminBrandsManager } from './AdminBrandsManager'

export default async function AdminBrandsPage() {
  const storedBrands = await readStoredBrands()
  const allBrands: (Brand | StoredBrand)[] = [
    ...storedBrands,
    ...staticBrands.filter((b) => !storedBrands.some((s) => s.slug === b.slug)),
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">Marcas</h1>
          <p className="text-sm text-muted-foreground mt-1">{allBrands.length} marcas no catálogo</p>
        </div>
      </div>

      <AdminBrandsManager brands={allBrands} />
    </div>
  )
}
