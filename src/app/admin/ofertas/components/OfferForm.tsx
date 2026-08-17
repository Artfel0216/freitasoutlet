'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { inputClass, fieldLabelClass } from '@/components/admin/product-form/form-utils'
import type { OfferFormState, SiteOffer } from '../offers-types'

interface OfferFormProps {
  form: OfferFormState
  editing: SiteOffer | null
  saving: boolean
  error: string
  onChange: (field: keyof OfferFormState, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function OfferForm({ form, editing, saving, error, onChange, onSubmit, onCancel }: OfferFormProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
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
          <label className={fieldLabelClass}>Tipo</label>
          <select
            value={form.type}
            onChange={(e) => onChange('type', e.target.value)}
            className={inputClass}
          >
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>

        <div>
          <label className={fieldLabelClass}>Desconto (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            required
            value={form.discountPercent}
            onChange={(e) => onChange('discountPercent', e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="col-span-2">
          <label className={fieldLabelClass}>Título</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => onChange('title', e.target.value)}
            className={inputClass}
            placeholder="Ex: Oferta da Semana - Esportivos"
          />
        </div>

        <div className="col-span-2">
          <label className={fieldLabelClass}>Descrição</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            className={`${inputClass} resize-vertical`}
            placeholder="Descrição da oferta..."
          />
        </div>

        <div>
          <label className={fieldLabelClass}>Data de Início</label>
          <input
            type="datetime-local"
            required
            value={form.startsAt}
            onChange={(e) => onChange('startsAt', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={fieldLabelClass}>Data de Término</label>
          <input
            type="datetime-local"
            required
            value={form.endsAt}
            onChange={(e) => onChange('endsAt', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <Button variant="primary" size="md" type="submit" disabled={saving}>
          {saving ? 'SALVANDO...' : editing ? 'ATUALIZAR OFERTA' : 'CRIAR OFERTA'}
        </Button>
        <button type="button" onClick={onCancel} className="text-sm underline hover:no-underline">
          Cancelar
        </button>
      </div>
    </motion.form>
  )
}