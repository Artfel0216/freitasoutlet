'use client'

import { useState, useEffect, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'

type SiteOffer = {
  id: string
  type: 'weekly' | 'monthly'
  title: string
  description: string
  discountPercent: number
  active: boolean
  startsAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<SiteOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<SiteOffer | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [type, setType] = useState<'weekly' | 'monthly'>('weekly')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')

  useEffect(() => {
    fetchOffers()
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

  function resetForm() {
    setType('weekly')
    setTitle('')
    setDescription('')
    setDiscountPercent('')
    setStartsAt('')
    setEndsAt('')
    setEditing(null)
    setError('')
  }

  function openNewForm() {
    resetForm()
    const now = new Date()
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    setStartsAt(now.toISOString().slice(0, 16))
    setEndsAt(weekLater.toISOString().slice(0, 16))
    setShowForm(true)
  }

  function openEditForm(offer: SiteOffer) {
    setEditing(offer)
    setType(offer.type)
    setTitle(offer.title)
    setDescription(offer.description)
    setDiscountPercent(String(offer.discountPercent))
    setStartsAt(offer.startsAt.slice(0, 16))
    setEndsAt(offer.endsAt.slice(0, 16))
    setShowForm(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const body = {
        ...(editing ? { id: editing.id } : {}),
        type,
        title,
        description,
        discountPercent: Number(discountPercent),
        active: editing ? editing.active : true,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
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

  const weeklyOffers = offers.filter((o) => o.type === 'weekly')
  const monthlyOffers = offers.filter((o) => o.type === 'monthly')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground animate-pulse">Carregando...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">Ofertas da Loja</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie ofertas semanais e mensais</p>
        </div>
        {!showForm && (
          <Button variant="primary" size="sm" onClick={openNewForm}>
            NOVA OFERTA
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            className="border border-border bg-white p-6 space-y-4 rounded-sm shadow-card mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="font-heading font-bold text-sm uppercase tracking-wider">
              {editing ? 'Editar Oferta' : 'Nova Oferta'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value as 'weekly' | 'monthly')}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background">
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Desconto (%)</label>
                <input type="number" min="0" max="100" required value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Título</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background"
                  placeholder="Ex: Oferta da Semana - Esportivos" />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Descrição</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background resize-vertical"
                  placeholder="Descrição da oferta..." />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Data de Início</label>
                <input type="datetime-local" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-1">Data de Término</label>
                <input type="datetime-local" required value={endsAt} onChange={(e) => setEndsAt(e.target.value)}
                  className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black bg-background" />
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex items-center gap-4 pt-2">
              <Button variant="primary" size="md" type="submit" disabled={saving}>
                {saving ? 'SALVANDO...' : editing ? 'ATUALIZAR OFERTA' : 'CRIAR OFERTA'}
              </Button>
              <button type="button" onClick={() => { setShowForm(false); resetForm() }}
                className="text-sm underline hover:no-underline">
                Cancelar
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {offers.length === 0 ? (
        <div className="text-center py-16 border border-border bg-white rounded-sm">
          <p className="text-muted-foreground">Nenhuma oferta cadastrada.</p>
          <button onClick={openNewForm} className="text-sm underline hover:no-underline mt-2 inline-block">
            Criar primeira oferta
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {weeklyOffers.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-base uppercase tracking-wider mb-4">Ofertas Semanais</h2>
              <div className="grid gap-4">
                {weeklyOffers.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i}
                    onEdit={openEditForm} onToggleActive={handleToggleActive} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {monthlyOffers.length > 0 && (
            <div>
              <h2 className="font-heading font-bold text-base uppercase tracking-wider mb-4">Ofertas Mensais</h2>
              <div className="grid gap-4">
                {monthlyOffers.map((offer, i) => (
                  <OfferCard key={offer.id} offer={offer} index={i}
                    onEdit={openEditForm} onToggleActive={handleToggleActive} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function OfferCard({
  offer, index, onEdit, onToggleActive, onDelete,
}: {
  offer: SiteOffer
  index: number
  onEdit: (o: SiteOffer) => void
  onToggleActive: (o: SiteOffer) => void
  onDelete: (id: string) => void
}) {
  const now = Date.now()
  const startTime = new Date(offer.startsAt).getTime()
  const endTime = new Date(offer.endsAt).getTime()
  const isActive = offer.active && now >= startTime && now <= endTime
  const isUpcoming = offer.active && now < startTime
  const isExpired = now > endTime

  return (
    <motion.div
      className={`border p-4 rounded-sm shadow-card flex items-center justify-between gap-4 ${
        !offer.active || isExpired ? 'border-border opacity-60' : 'border-border'
      }`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="font-heading font-bold text-sm uppercase tracking-tight truncate">{offer.title}</h3>
          <span className={`text-xs px-2 py-0.5 font-medium whitespace-nowrap ${
            isActive ? 'bg-green-100 text-green-700' :
            isUpcoming ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-500'
          }`}>
            {isActive ? 'Ativa' : isUpcoming ? 'Agendada' : 'Expirada'}
          </span>
        </div>
        {offer.description && (
          <p className="text-xs text-muted-foreground truncate">{offer.description}</p>
        )}
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span className="text-red-600 font-bold">-{offer.discountPercent}%</span>
          <span>{offer.type === 'weekly' ? 'Semanal' : 'Mensal'}</span>
          <span>{new Date(offer.startsAt).toLocaleDateString('pt-BR')} - {new Date(offer.endsAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button onClick={() => onToggleActive(offer)}
          className={`text-xs px-2 py-1 border transition-colors ${
            offer.active ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}>
          {offer.active ? 'Desativar' : 'Ativar'}
        </button>
        <button onClick={() => onEdit(offer)}
          className="text-xs underline hover:no-underline">
          Editar
        </button>
        <button onClick={() => onDelete(offer.id)}
          className="text-xs underline hover:no-underline text-red-500">
          Excluir
        </button>
      </div>
    </motion.div>
  )
}
