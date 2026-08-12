import { NextResponse } from 'next/server'
import type { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { readStoredProducts, writeStoredProducts, type StoredProduct } from '@/lib/admin-products'
import { saveImage, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload'
import { getSession } from '@/lib/auth'
import { logger } from '@/lib/logger'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.toLowerCase()
  const brand = searchParams.get('brand')
  const category = searchParams.get('category')

  const stored = await readStoredProducts()
  const hiddenSlugs = new Set(stored.filter((s) => s.active === false).map((s) => s.slug))
  const all: (Product | StoredProduct)[] = [
    ...stored.filter((sp) => !staticProducts.some((p) => p.slug === sp.slug) && sp.active !== false),
    ...staticProducts.filter((p) => !hiddenSlugs.has(p.slug)),
  ]

  if (search) {
    return NextResponse.json(all.filter((p) => p.name.toLowerCase().includes(search) || p.slug.includes(search)))
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
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const brandId = formData.get('brandId') as string
    const brandName = formData.get('brandName') as string
    const brandSlug = formData.get('brandSlug') as string
    const brandSegment = formData.get('brandSegment') as string
    const categoryId = formData.get('categoryId') as string
    const categoryName = formData.get('categoryName') as string
    const categorySlug = formData.get('categorySlug') as string
    const categoryParentSlug = formData.get('categoryParentSlug') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null
    const sizes: string[] = JSON.parse((formData.get('sizes') as string) || '[]')
    const colors: { name: string; hex: string }[] = JSON.parse((formData.get('colors') as string) || '[]')
    const tags = (formData.get('tags') as string || '').split(',').map((t) => t.trim()).filter(Boolean)
    const isNew = formData.get('isNew') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const offerStatus = (formData.get('offerStatus') as string) || 'none'
    const offerType = (formData.get('offerType') as string) || 'none'
    const offerDiscount = Number(formData.get('offerDiscount') || 0)
    const featured = formData.get('featured') === 'true'
    const active = formData.get('active') !== 'false'
    const sizeGuide = (formData.get('sizeGuide') as string) || 'shirt'

    if (!name || !price) {
      return NextResponse.json({ error: 'Nome e preço são obrigatórios' }, { status: 400 })
    }

    const slug = name.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const imageFiles = formData.getAll('images') as File[]
    let images: string[] = []

    for (const file of imageFiles) {
      if (file.size === 0) continue
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({
          error: `Tipo de arquivo não permitido: ${file.name}. Use JPEG, PNG, WebP ou GIF.`,
        }, { status: 400 })
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: `${file.name} deve ter no máximo 5MB.` }, { status: 400 })
      }
      const url = await saveImage(file, 'uploads')
      if (url) images.push(url)
    }

    const newProduct: StoredProduct = {
      id: slug,
      name,
      slug,
      brand: { id: brandId || brandSlug, name: brandName, slug: brandSlug, segment: brandSegment || 'premium' },
      category: { id: categoryId || categorySlug, name: categoryName, slug: categorySlug, parentId: categoryParentSlug || null },
      description,
      price,
      compareAtPrice,
      images,
      colors,
      sizes,
      sizeGuide,
      tags,
      isNew,
      isTrending,
      offerStatus: offerStatus as StoredProduct['offerStatus'],
      offerType: offerType as StoredProduct['offerType'],
      offerDiscount,
      featured,
      stock: {},
      active,
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
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const slug = formData.get('slug') as string
    if (!slug) return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })

    const name = formData.get('name') as string
    const brandName = formData.get('brandName') as string
    const brandSlug = formData.get('brandSlug') as string
    const categoryName = formData.get('categoryName') as string
    const categorySlug = formData.get('categorySlug') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null
    const sizes: string[] = JSON.parse((formData.get('sizes') as string) || '[]')
    const colors: { name: string; hex: string }[] = JSON.parse((formData.get('colors') as string) || '[]')
    const tags = (formData.get('tags') as string || '').split(',').map((t) => t.trim()).filter(Boolean)
    const isNew = formData.get('isNew') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const offerStatus = (formData.get('offerStatus') as string) || 'none'
    const offerType = (formData.get('offerType') as string) || 'none'
    const offerDiscount = Number(formData.get('offerDiscount') || 0)
    const featured = formData.get('featured') === 'true'
    const active = formData.get('active') !== 'false'
    const sizeGuide = (formData.get('sizeGuide') as string) || 'shirt'

    const stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const existing = stored[index]

    const existingImagesStr = formData.get('existingImages') as string
    const keepExisting = formData.get('keepExistingImages') === 'true'
    let images = keepExisting && existingImagesStr ? JSON.parse(existingImagesStr) : existing.images

    const imageFiles = formData.getAll('images') as File[]

    for (const file of imageFiles) {
      if (file.size === 0) continue
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({
          error: `Tipo de arquivo não permitido: ${file.name}. Use JPEG, PNG, WebP ou GIF.`,
        }, { status: 400 })
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: `${file.name} deve ter no máximo 5MB.` }, { status: 400 })
      }
      const url = await saveImage(file, 'uploads')
      if (url) images.push(url)
    }

    const brand = brandName && brandSlug
      ? { id: brandSlug, name: brandName, slug: brandSlug, segment: 'premium' as const }
      : existing.brand
    const category = categoryName && categorySlug
      ? { id: categorySlug, name: categoryName, slug: categorySlug, parentId: existing.category.parentId }
      : existing.category

    const updated: StoredProduct = {
      ...existing,
      brand,
      category,
      name: name || existing.name,
      description: description || existing.description,
      price: price || existing.price,
      compareAtPrice: compareAtPrice !== null ? compareAtPrice : existing.compareAtPrice,
      sizes: sizes.length > 0 ? sizes : existing.sizes,
      colors: colors.length > 0 ? colors : existing.colors,
      tags: tags.length > 0 ? tags : existing.tags,
      isNew,
      isTrending,
      offerStatus: offerStatus as StoredProduct['offerStatus'],
      offerType: offerType as StoredProduct['offerType'],
      offerDiscount,
      featured,
      active,
      sizeGuide,
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
  const session = await getSession()
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { slug } = await request.json()
    if (!slug) return NextResponse.json({ error: 'Slug é obrigatório' }, { status: 400 })

    let stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === slug)

    if (index !== -1) {
      stored.splice(index, 1)
      await writeStoredProducts(stored)
      return NextResponse.json({ success: true })
    }

    const staticProduct = staticProducts.find((p) => p.slug === slug)
    if (!staticProduct) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const now = new Date().toISOString()
    stored.push({
      id: staticProduct.id,
      name: staticProduct.name,
      slug: staticProduct.slug,
      brand: { id: staticProduct.brand.slug, name: staticProduct.brand.name, slug: staticProduct.brand.slug, segment: staticProduct.brand.segment },
      category: { id: staticProduct.category.slug, name: staticProduct.category.name, slug: staticProduct.category.slug, parentId: staticProduct.category.parentId },
      description: staticProduct.description,
      price: staticProduct.price,
      compareAtPrice: staticProduct.compareAtPrice ?? null,
      images: staticProduct.images,
      colors: staticProduct.colors,
      sizes: staticProduct.sizes,
      sizeGuide: staticProduct.sizeGuide,
      tags: staticProduct.tags,
      isNew: staticProduct.isNew ?? false,
      isTrending: staticProduct.isTrending ?? false,
      offerStatus: staticProduct.offerStatus || 'none',
      offerType: staticProduct.offerType || 'none',
      offerDiscount: staticProduct.offerDiscount || 0,
      featured: staticProduct.featured || false,
      stock: staticProduct.stock ?? {},
      active: false,
      createdAt: now,
      updatedAt: now,
    })
    await writeStoredProducts(stored)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[ADMIN_PRODUTOS_DELETE]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
