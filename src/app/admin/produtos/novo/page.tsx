import type { Brand } from '@/types'
import { brands as staticBrands } from '@/data/brands'
import { readStoredBrands } from '@/lib/admin-brands'
import { NewProductForm } from './NewProductForm'

export default async function AdminNewProductPage() {
  const storedBrands = await readStoredBrands()
  const allBrands: Brand[] = [
    ...storedBrands.map((b) => ({ id: b.id, name: b.name, slug: b.slug, segment: b.segment as Brand['segment'] })),
    ...staticBrands.filter((b) => !storedBrands.some((s) => s.slug === b.slug)),
  ]

  return <NewProductForm brands={allBrands} />
}
