'use client'

import { useEffect, useState, type FormEvent } from 'react'
import {
  emptyOfferForm,
  type OfferFormState,
  type SiteOffer,
} from './offers-types'

export interface OffersController {
  offers: SiteOffer[]
  loading: boolean
  showForm: boolean
  editing: SiteOffer | null
  saving: boolean
  error: string
  form: OfferFormState
  setShowForm: (value: boolean) => void
  updateField: (field: keyof OfferFormState, value: string) => void
  openNewForm: () => void
  openEditForm: (offer: SiteOffer) => void
  closeForm: () => void
  handleSubmit: (e: FormEvent) => Promise<void>
  handleToggleActive: (offer: SiteOffer) => Promise<void>
  handleDelete: (id: string) => Promise<void>
}

export function useOffers(): OffersController {
  const [offers, setOffers] = useState<SiteOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SiteOffer | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<OfferFormState>(emptyOfferForm)

  useEffect(() => {
    void fetchOffers()
  }, [])

  async function fetchOffers() {
    try {
      const res = await fetch('/api/admin/ofertas')
      if (res.ok) {
        const data = await res.json()
        setOffers(data)
      }
    } catch {
      setError('Erro ao carregar ofertas')
    } finally {
      setLoading(false)
    }
  }

  function updateField(field: keyof OfferFormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm(emptyOfferForm)
    setEditing(null)
    setError('')
  }

  function openNewForm() {
    resetForm()
    const now = new Date()
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    setForm({
      ...emptyOfferForm,
      startsAt: now.toISOString().slice(0, 16),
      endsAt: weekLater.toISOString().slice(0, 16),
    })
    setShowForm(true)
  }

  function openEditForm(offer: SiteOffer) {
    setEditing(offer)
    setForm({
      type: offer.type,
      title: offer.title,
      description: offer.description,
      discountPercent: String(offer.discountPercent),
      startsAt: offer.startsAt.slice(0, 16),
      endsAt: offer.endsAt.slice(0, 16),
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    resetForm()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const body = {
        ...(editing ? { id: editing.id } : {}),
        type: form.type,
        title: form.title,
        description: form.description,
        discountPercent: Number(form.discountPercent),
        active: editing ? editing.active : true,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: new Date(form.endsAt).toISOString(),
      }

      const res = await fetch('/api/admin/ofertas', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao salvar oferta')
      }

      await fetchOffers()
      setShowForm(false)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar oferta')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(offer: SiteOffer) {
    try {
      const res = await fetch('/api/admin/ofertas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: offer.id,
          type: offer.type,
          title: offer.title,
          description: offer.description,
          discountPercent: offer.discountPercent,
          active: !offer.active,
          startsAt: offer.startsAt,
          endsAt: offer.endsAt,
        }),
      })

      if (res.ok) await fetchOffers()
    } catch {
      setError('Erro ao atualizar oferta')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta oferta?')) return

    try {
      const res = await fetch('/api/admin/ofertas', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) await fetchOffers()
    } catch {
      setError('Erro ao excluir oferta')
    }
  }

  return {
    offers,
    loading,
    showForm,
    editing,
    saving,
    error,
    form,
    setShowForm,
    updateField,
    openNewForm,
    openEditForm,
    closeForm,
    handleSubmit,
    handleToggleActive,
    handleDelete,
  }
}