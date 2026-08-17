import { NextResponse } from 'next/server'
import { products as staticProducts } from '@/data/products'
import {
  readStoredProducts,
  writeStoredProducts,
  deleteStoredProduct,
  type StoredProduct,
} from '@/lib/admin-products'
import { requireAdmin } from '@/lib/admin/require-auth'
import { parseProductFormData } from '@/lib/admin/product-form-data'
import { processImageUploads } from '@/lib/admin/product-images'
import { createInactiveCopy } from '@/lib/admin/static-product-copy'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const brand = searchParams.get('brand')
  const category = searchParams.get('category')

  const stored = await readStoredProducts()
  const hiddenSlugs = new Set(stored.filter((s) => s.active === false).map((s) => s.slug))
  const all: (typeof staticProducts[number] | StoredProduct)[] = [
    ...stored.filter((sp) => !staticProducts.some((p) => p.slug === sp.slug) && sp.active !== false),
    ...staticProducts.filter((p) => !hiddenSlugs.has(p.slug)),
  ]

  if (search) {
    return NextResponse.json(
      all.filter((p) => p.name.toLowerCase().includes(search) || p.slug.includes(search)),
    )
  }
  if (brand) {
    return NextResponse.json(all.filter((p) => p.brand.slug === brand))
  }
  if (category) {
    return NextResponse.json(all.filter((p) => p.category.slug === category))
  }

  return NextResponse.json(all)
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const data = parseProductFormData(formData)

    if (!data.name || !data.price) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 })
    }

    const imagesResult = await processImageUploads(formData.getAll('images') as File[])
    if (!imagesResult.ok) return imagesResult.response

    const newProduct: StoredProduct = {
      id: data.slug,
      name: data.name,
      slug: data.slug,
      brand: data.brand,
      category: data.category,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      images: imagesResult.images,
      video: data.video,
      colors: data.colors,
      sizes: data.sizes,
      sizeGuide: data.sizeGuide,
      tags: data.tags,
      isNew: data.isNew,
      isTrending: data.isTrending,
      offerStatus: data.offerStatus,
      offerType: data.offerType,
      offerDiscount: data.offerDiscount,
      featured: data.featured,
      stock: {},
      active: data.active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const stored = await readStoredProducts()
    stored.push(newProduct)
    await writeStoredProducts(stored)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    logger.error('[ADMIN_PRODUTOS_POST]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const formData = await request.formData()
    const data = parseProductFormData(formData, { deriveSlug: false })
    if (!data.slug) return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })

    const stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === data.slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const existing = stored[index]

    const existingImagesStr = formData.get('existingImages') as string
    const keepExisting = formData.get('keepExistingImages') === 'true'
    const images = keepExisting && existingImagesStr ? JSON.parse(existingImagesStr) : existing.images

    const imagesResult = await processImageUploads(formData.getAll('images') as File[])
    if (!imagesResult.ok) return imagesResult.response

    const brand =
      data.brand.name && data.brand.slug
        ? { id: data.brand.slug, name: data.brand.name, slug: data.brand.slug, segment: 'premium' as const }
        : existing.brand
    const category =
      data.category.name && data.category.slug
        ? { id: data.category.slug, name: data.category.name, slug: data.category.slug, parentId: existing.category.parentId }
        : existing.category

    const updated: StoredProduct = {
      ...existing,
      brand,
      category,
      name: data.name || existing.name,
      description: data.description || existing.description,
      price: data.price || existing.price,
      compareAtPrice: data.compareAtPrice !== null ? data.compareAtPrice : existing.compareAtPrice,
      video: data.video,
      sizes: data.sizes.length > 0 ? data.sizes : existing.sizes,
      colors: data.colors.length > 0 ? data.colors : existing.colors,
      tags: data.tags.length > 0 ? data.tags : existing.tags,
      isNew: data.isNew,
      isTrending: data.isTrending,
      offerStatus: data.offerStatus,
      offerType: data.offerType,
      offerDiscount: data.offerDiscount,
      featured: data.featured,
      active: data.active,
      sizeGuide: data.sizeGuide,
      images,
      updatedAt: new Date().toISOString(),
    }

    stored[index] = updated
    await writeStoredProducts(stored)

    return NextResponse.json(updated)
  } catch (error) {
    logger.error('[ADMIN_PRODUTOS_PUT]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { slug } = await request.json()
    if (!slug) return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })

    const stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === slug)
    const staticProduct = staticProducts.find((p) => p.slug === slug)

    if (staticProduct) {
      const copy = index !== -1 ? { ...stored[index] } : createInactiveCopy(staticProduct)
      copy.active = false
      copy.updatedAt = new Date().toISOString()

      if (index !== -1) stored[index] = copy
      else stored.push(copy)
      await writeStoredProducts(stored)

      return NextResponse.json({ success: true })
    }

    if (index !== -1) {
      await deleteStoredProduct(slug)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
  } catch (error) {
    logger.error('[ADMIN_PRODUTOS_DELETE]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}