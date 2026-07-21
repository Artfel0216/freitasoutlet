import { NextResponse } from 'next/server'
import type { Product } from '@/types'
import { products as staticProducts } from '@/data/products'
import { readStoredProducts, writeStoredProducts, type StoredProduct } from '@/lib/admin-products'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
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
  const all: (Product | StoredProduct)[] = [
    ...stored.filter((sp) => !staticProducts.some((p) => p.slug === sp.slug)),
    ...staticProducts,
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

    const imageFile = formData.get('image') as File | null
    let images: string[] = []

    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({
          error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.',
        }, { status: 400 })
      }
      const maxSize = 5 * 1024 * 1024 
      if (imageFile.size > maxSize) {
        return NextResponse.json({ error: 'Imagem deve ter no máximo 5MB.' }, { status: 400 })
      }
      const ext = imageFile.name.split('.').pop() || 'webp'
      const filename = `${slug}-${Date.now()}.${ext}`
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      images = [`/images/uploads/${filename}`]
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
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : null
    const sizes: string[] = JSON.parse((formData.get('sizes') as string) || '[]')
    const colors: { name: string; hex: string }[] = JSON.parse((formData.get('colors') as string) || '[]')
    const tags = (formData.get('tags') as string || '').split(',').map((t) => t.trim()).filter(Boolean)
    const isNew = formData.get('isNew') === 'true'
    const isTrending = formData.get('isTrending') === 'true'
    const active = formData.get('active') !== 'false'
    const sizeGuide = (formData.get('sizeGuide') as string) || 'shirt'

    const stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    const existing = stored[index]

    const imageFile = formData.get('image') as File | null
    let images = existing.images

    if (imageFile && imageFile.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(imageFile.type)) {
        return NextResponse.json({
          error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.',
        }, { status: 400 })
      }
      const maxSize = 5 * 1024 * 1024
      if (imageFile.size > maxSize) {
        return NextResponse.json({ error: 'Imagem deve ter no máximo 5MB.' }, { status: 400 })
      }
      const ext = imageFile.name.split('.').pop() || 'webp'
      const filename = `${slug}-${Date.now()}.${ext}`
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const filepath = path.join(uploadDir, filename)
      await writeFile(filepath, buffer)
      images = [`/images/uploads/${filename}`]
    }

    const updated: StoredProduct = {
      ...existing,
      name: name || existing.name,
      description: description || existing.description,
      price: price || existing.price,
      compareAtPrice: compareAtPrice !== null ? compareAtPrice : existing.compareAtPrice,
      sizes: sizes.length > 0 ? sizes : existing.sizes,
      colors: colors.length > 0 ? colors : existing.colors,
      tags: tags.length > 0 ? tags : existing.tags,
      isNew,
      isTrending,
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

    const stored = await readStoredProducts()
    const index = stored.findIndex((p) => p.slug === slug)
    if (index === -1) {
      return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    }

    stored.splice(index, 1)
    await writeStoredProducts(stored)

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('[ADMIN_PRODUTOS_DELETE]', { error: String(error) })
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
