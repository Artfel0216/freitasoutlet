'use client'

import { AnimatePresence } from 'framer-motion'
import { useReviews } from './reviews/use-reviews'
import { StarRating } from './reviews/StarRating'
import { ReviewForm } from './reviews/ReviewForm'
import { ReviewItem } from './reviews/ReviewItem'

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const reviews = useReviews(productId)

  if (reviews.loading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        Carregando avaliações...
      </div>
    )
  }

  return (
    <div className="border-t border-border pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl uppercase tracking-tight">Avaliações</h2>
          <div className="flex items-center gap-3 mt-1">
            {reviews.stats.count > 0 ? (
              <>
                <StarRating rating={Math.round(reviews.stats.average)} size="md" />
                <span className="text-sm font-medium">{reviews.stats.average.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({reviews.stats.count} {reviews.stats.count === 1 ? 'avaliação' : 'avaliações'})
                </span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Nenhuma avaliação ainda</span>
            )}
          </div>
        </div>
        <button
          onClick={() => reviews.setShowForm(!reviews.showForm)}
          className="text-sm font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted transition-colors"
        >
          {reviews.showForm ? 'Cancelar' : 'Avaliar'}
        </button>
      </div>

      <AnimatePresence>
        {reviews.showForm && (
          <ReviewForm
            form={reviews.form}
            imageFiles={reviews.imageFiles}
            imagePreviews={reviews.imagePreviews}
            submitting={reviews.submitting}
            onChangeField={reviews.updateField}
            onImagesChange={reviews.handleImagesChange}
            onRemoveImage={reviews.removeImage}
            onSubmit={reviews.handleSubmit}
          />
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Seja o primeiro a avaliar este produto!
          </p>
        ) : (
          reviews.reviews.map((review) => <ReviewItem key={review.id} review={review} />)
        )}
      </div>
    </div>
  )
}