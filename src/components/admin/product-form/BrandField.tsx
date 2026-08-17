'use client'

import { Button } from '@/components/ui/Button'
import { brandSegments, inputClass, fieldLabelClass } from './form-utils'
import type { BrandManager } from './use-product-form'

interface BrandFieldProps {
  manager: BrandManager
  required?: boolean
}

export function BrandField({ manager, required = false }: BrandFieldProps) {
  return (
    <div>
      <label className={fieldLabelClass}>Marca {required && '*'}</label>
      <select
        required={required}
        value={manager.brandSlug}
        onChange={(e) => manager.setBrandSlug(e.target.value)}
        className={inputClass}
      >
        <option value="">Selecione uma marca</option>
        {manager.brandOptions.map((b) => (
          <option key={b.slug} value={b.slug}>{b.name}</option>
        ))}
      </select>

      {manager.showNewBrand ? (
        <form onSubmit={manager.createBrand} className="mt-2 space-y-2 border border-border p-3">
          <input
            type="text"
            placeholder="Nome da nova marca"
            value={manager.newBrandName}
            onChange={(e) => manager.setNewBrandName(e.target.value)}
            className={inputClass}
          />
          <select
            value={manager.newBrandSegment}
            onChange={(e) => manager.setNewBrandSegment(e.target.value)}
            className={inputClass}
          >
            {brandSegments.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Button variant="primary" size="sm" type="submit" disabled={manager.savingBrand}>
              {manager.savingBrand ? 'SALVANDO...' : 'CADASTRAR'}
            </Button>
            <button type="button" onClick={manager.toggleNewBrand} className="text-xs underline hover:no-underline">
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={manager.toggleNewBrand} className="mt-2 text-xs underline hover:no-underline">
          + Cadastrar nova marca
        </button>
      )}
    </div>
  )
}