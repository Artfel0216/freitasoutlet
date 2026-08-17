'use client'

import { categories } from '@/data/categories'
import { inputClass, fieldLabelClass } from './form-utils'

interface CategoryFieldProps {
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function CategoryField({ value, onChange, required = false }: CategoryFieldProps) {
  return (
    <div>
      <label className={fieldLabelClass}>Categoria {required && '*'}</label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((cat) => (
          <optgroup key={cat.id} label={cat.name}>
            <option value={cat.slug}>{cat.name} (Todas)</option>
            {cat.children?.map((child) => (
              <option key={child.slug} value={child.slug}>{child.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}