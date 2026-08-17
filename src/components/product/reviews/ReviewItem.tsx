'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Review } from './reviews-types'
import { StarRating } from './StarRating'

export function ReviewItem({ review }: { review: Review }) {
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border pb-6 last:border-0"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-bold uppercase">
            {review.customerName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium">{review.customerName}</p>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              {review.verified && (
                <span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                  Compra verificada
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </div>

      {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
      {review.comment && <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>}

      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img, i) => (
            <motion.div
              key={i}
              className="relative w-20 h-20 border border-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Image
                src={img}
                alt={`Foto do review ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}