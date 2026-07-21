'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type Review = {
  id: string
  productId: string
  customerName: string
  rating: number
  title: string
  comment: string
  verified: boolean
  createdAt: string
}

type ReviewStats = {
  average: number
  count: number
}

interface ProductReviewsProps {
  productId: string
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${star <= rating ? 'fill-black text-black' : 'fill-none text-muted-foreground'}`}
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  )
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0 })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 5, title: '', comment: '' })

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data.reviews || [])
        setStats(data.stats || { average: 0, count: 0 })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Digite seu nome')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, customerName: form.name, rating: form.rating, title: form.title, comment: form.comment }),
      })
      if (res.ok) {
        const newReview = await res.json()
        setReviews(prev => [newReview, ...prev])
        setStats(prev => ({
          average: (prev.average * prev.count + form.rating) / (prev.count + 1),
          count: prev.count + 1,
        }))
        setForm({ name: '', rating: 5, title: '', comment: '' })
        setShowForm(false)
        toast.success('Avaliação enviada!')
      }
    } catch {
      toast.error('Erro ao enviar avaliação')
    }
    setSubmitting(false)
  }

  if (loading) {
    return <div className="py-8 text-center text-sm text-muted-foreground">Carregando avaliações...</div>
  }

  return (
    <div className="border-t border-border pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-heading font-bold text-xl uppercase tracking-tight">Avaliações</h2>
          <div className="flex items-center gap-3 mt-1">
            {stats.count > 0 ? (
              <>
                <StarRating rating={Math.round(stats.average)} size="md" />
                <span className="text-sm font-medium">{stats.average.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({stats.count} {stats.count === 1 ? 'avaliação' : 'avaliações'})</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Nenhuma avaliação ainda</span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium uppercase tracking-wider border border-border px-4 py-2 hover:bg-muted transition-colors"
        >
          {showForm ? 'Cancelar' : 'Avaliar'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="bg-muted p-6 mb-6 overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Seu nome</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="Como você se chama?"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Nota</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, rating: star }))}
                      className="p-0.5"
                    >
                      <svg className={`w-6 h-6 ${star <= form.rating ? 'fill-black text-black' : 'fill-none text-muted-foreground hover:text-black'} transition-colors`} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Título (opcional)</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black"
                  placeholder="Resumo da sua avaliação"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Comentário (opcional)</label>
                <textarea
                  value={form.comment}
                  onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                  className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                  rows={3}
                  placeholder="Conte sua experiência com o produto..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-black text-white text-sm font-medium uppercase tracking-wider px-6 py-2.5 hover:bg-black/80 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Seja o primeiro a avaliar este produto!</p>
        ) : (
          reviews.map((review) => (
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
                        <span className="text-[10px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Compra verificada</span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
