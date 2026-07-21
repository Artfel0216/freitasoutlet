import { NextRequest, NextResponse } from 'next/server'
import { getReviewsByProduct, getAverageRating, createReview } from '@/lib/reviews-db'
import { rateLimit } from '@/lib/rate-limit'

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

  return NextResponse.json({ reviews, stats })
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous'
    const rl = await rateLimit(`reviews:${ip}`, 10, 60_000)
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Muitas requisições. Tente novamente em instantes.' }, { status: 429 })
    }

    const body = await request.json()
    const { productId, customerName, rating, title, comment } = body

    if (!productId || !customerName || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const review = await createReview({
      productId,
      customerName,
      rating,
      title: title || '',
      comment: comment || '',
      verified: false,
    })

    return NextResponse.json(review, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
