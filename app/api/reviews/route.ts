import { NextRequest, NextResponse } from 'next/server'
import { getReviewsByProduct, getAverageRating, createReview, hasCustomerPurchasedProduct } from '@/lib/reviews-db'
import { getCustomerSession } from '@/lib/customer-auth'
import { rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'
import { saveImage, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/lib/upload'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 })
  }

  const [reviews, stats] = await Promise.all([
    getReviewsByProduct(productId),
    getAverageRating(productId),
  ])

  const safe = reviews.map(({ customerEmail, ...rest }) => rest)

  return NextResponse.json({ reviews: safe, stats })
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`reviews:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const session = await getCustomerSession()

    const formData = await request.formData()
    const productId = formData.get('productId') as string
    const customerName = formData.get('customerName') as string
    const rating = Number(formData.get('rating'))
    const title = (formData.get('title') as string) || ''
    const comment = (formData.get('comment') as string) || ''
    const imageFiles = formData.getAll('images') as File[]

    if (!productId || !customerName || !rating) {
      return NextResponse.json({ error: 'Campos obrigatórios: productId, customerName, rating' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Nota deve estar entre 1 e 5' }, { status: 400 })
    }

    let verified = false
    const customerEmail = session?.email || ''

    if (session?.email) {
      const purchased = await hasCustomerPurchasedProduct(session.email, productId)
      if (purchased) verified = true
    }

    let images: string[] = []

    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size === 0) continue
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) continue
        if (file.size > MAX_IMAGE_SIZE) continue
        const url = await saveImage(file, 'review-uploads')
        if (url) images.push(url)
      }
    }

    const review = await createReview({
      productId,
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      images,
      verified,
    })

    const { customerEmail: _, ...safe } = review

    return NextResponse.json(safe, { status: 201 })
  } catch (err) {
    logger.error('[REVIEWS_POST]', { error: String(err) })
    return NextResponse.json({ error: 'Erro ao enviar avaliação' }, { status: 500 })
  }
}
