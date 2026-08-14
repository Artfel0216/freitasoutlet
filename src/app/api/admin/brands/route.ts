import { NextResponse } from 'next/server'
import type { Brand } from '@/types'
import { brands as staticBrands } from '@/data/brands'
import { readStoredBrands, upsertStoredBrand, deleteStoredBrand, getStoredBrandBySlug, type StoredBrand } from '@/lib/admin-brands'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()

  const stored = await readStoredBrands()
  const storedSlugs = new Set(stored.map((b) => b.slug))
  const all: (Brand | StoredBrand)[] = [
    ...stored,
    ...staticBrands.filter((b) => !storedSlugs.has(b.slug)),
  ]

  if (search) {
    return NextResponse.json(all.filter((b) => b.name.toLowerCase().includes(search) || b.slug.includes(search)))
  }

  return NextResponse.json(all)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { name, segment, logo } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Nome da marca é obrigatório' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    if (!slug) {
      return NextResponse.json({ error: 'Nome da marca inválido' }, { status: 400 })
    }

    await upsertStoredBrand({
      id: slug,
      name: name.trim(),
      slug,
      segment: segment || 'premium',
      logo: logo || '',
    })

    const created = await getStoredBrandBySlug(slug)
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    logger.error('[ADMIN_BRANDS_POST]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao criar marca' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { slug } = await request.json()
    if (!slug) return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })

    const staticBrand = staticBrands.find((b) => b.slug === slug)
    if (staticBrand) {
      return NextResponse.json({ error: 'Marcas padrão do catálogo não podem ser excluídas' }, { status: 400 })
    }

    await deleteStoredBrand(slug)
    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[ADMIN_BRANDS_DELETE]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao excluir marca' }, { status: 500 })
  }
}
