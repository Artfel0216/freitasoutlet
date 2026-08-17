'use client'

import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useOffers } from './use-offers'
import { OfferForm } from './components/OfferForm'
import { OfferCard } from './components/OfferCard'
import type { SiteOffer } from './offers-types'

function OfferSection({
  title,
  offers,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  title: string
  offers: SiteOffer[]
  onEdit: (offer: SiteOffer) => void
  onToggleActive: (offer: SiteOffer) => void
  onDelete: (id: string) => void
}) {
  if (offers.length === 0) return null

  return (
    <div>
      <h2 className="font-heading font-bold text-base uppercase tracking-wider mb-4">{title}</h2>
      <div className="grid gap-4">
        {offers.map((offer, i) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            index={i}
            onEdit={onEdit}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default function AdminOffersPage() {
  const offers = useOffers()

  if (offers.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-muted-foreground animate-pulse">Carregando...</div>
      </div>
    )
  }

  const weeklyOffers = offers.offers.filter((o) => o.type === 'weekly')
  const monthlyOffers = offers.offers.filter((o) => o.type === 'monthly')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-black text-2xl uppercase tracking-tighter">Ofertas da Loja</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie ofertas semanais e mensais</p>
        </div>
        {!offers.showForm && (
          <Button variant="primary" size="sm" onClick={offers.openNewForm}>
            NOVA OFERTA
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {offers.showForm && (
          <OfferForm
            form={offers.form}
            editing={offers.editing}
            saving={offers.saving}
            error={offers.error}
            onChange={offers.updateField}
            onSubmit={offers.handleSubmit}
            onCancel={offers.closeForm}
          />
        )}
      </AnimatePresence>

      {offers.offers.length === 0 ? (
        <div className="text-center py-16 border border-border bg-white rounded-sm">
          <p className="text-muted-foreground">Nenhuma oferta cadastrada.</p>
          <button onClick={offers.openNewForm} className="text-sm underline hover:no-underline mt-2 inline-block">
            Criar primeira oferta
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <OfferSection
            title="Ofertas Semanais"
            offers={weeklyOffers}
            onEdit={offers.openEditForm}
            onToggleActive={offers.handleToggleActive}
            onDelete={offers.handleDelete}
          />
          <OfferSection
            title="Ofertas Mensais"
            offers={monthlyOffers}
            onEdit={offers.openEditForm}
            onToggleActive={offers.handleToggleActive}
            onDelete={offers.handleDelete}
          />
        </div>
      )}
    </div>
  )
}