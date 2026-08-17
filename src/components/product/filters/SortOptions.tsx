'use client'

import { sortOptions } from './filter-data'

export function SortOptions({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Ordenar por</h3>
      <div className="space-y-2">
        {sortOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              name="sort"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="accent-black"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  )
}