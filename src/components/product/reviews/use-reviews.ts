'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Review, ReviewStats } from './reviews-types'

export interface ReviewFormData {
  name: string
  rating: number
  title: string
  comment: string
}

export interface ReviewsController {
  reviews: Review[]
  stats: ReviewStats
  showForm: boolean
  setShowForm: (value: boolean) => void
  loading: boolean
  submitting: boolean
  form: ReviewFormData
  imageFiles: File[]
  imagePreviews: string[]
  updateField: (field: keyof ReviewFormData, value: string | number) => void
  handleImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

const emptyForm: ReviewFormData = { name: '', rating: 5, title: '', comment: '' }

export function useReviews(productId: string): ReviewsController {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats>({ average: 0, count: 0 })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState<ReviewFormData>(emptyForm)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews || [])
        setStats(data.stats || { average: 0, count: 0 })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [productId])

  function updateField(field: keyof ReviewFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 5 - imageFiles.length)
    setImageFiles((prev) => [...prev, ...files])
    for (const file of files) {
      setImagePreviews((prev) => [...prev, URL.createObjectURL(file)])
    }
  }

  function removeImage(index: number) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Digite seu nome')
      return
    }
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('productId', productId)
      formData.append('customerName', form.name)
      formData.append('rating', String(form.rating))
      formData.append('title', form.title)
      formData.append('comment', form.comment)
      for (const file of imageFiles) {
        formData.append('images', file)
      }

      const res = await fetch('/api/reviews', { method: 'POST', body: formData })
      if (res.ok) {
        const newReview = await res.json()
        setReviews((prev) => [newReview, ...prev])
        setStats((prev) => ({
          average: (prev.average * prev.count + form.rating) / (prev.count + 1),
          count: prev.count + 1,
        }))
        setForm(emptyForm)
        setImageFiles([])
        setImagePreviews([])
        setShowForm(false)
        toast.success('Avaliação enviada!')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erro ao enviar avaliação')
      }
    } catch {
      toast.error('Erro ao enviar avaliação')
    }
    setSubmitting(false)
  }

  return {
    reviews,
    stats,
    showForm,
    setShowForm,
    loading,
    submitting,
    form,
    imageFiles,
    imagePreviews,
    updateField,
    handleImagesChange,
    removeImage,
    handleSubmit,
  }
}