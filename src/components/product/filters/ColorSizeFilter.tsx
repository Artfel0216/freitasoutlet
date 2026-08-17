'use client'

import { allColors, allSizes } from './filter-data'

export function ColorFilter({
  active,
  onToggle,
}: {
  active: string[]
  onToggle: (hex: string) => void
}) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Cor</h3>
      <div className="flex flex-wrap gap-2">
        {allColors.map((color) => {
          const isActive = active.includes(color.hex)
          const isWhite = color.hex.toUpperCase() === '#FFFFFF'
          return (
            <button
              key={color.hex}
              onClick={() => onToggle(color.hex)}
              title={color.name}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                isActive ? 'border-black scale-110' : 'border-border hover:border-black'
              } ${isWhite ? 'shadow-inner' : ''}`}
              style={{ backgroundColor: color.hex }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function SizeFilter({
  active,
  onToggle,
}: {
  active: string[]
  onToggle: (size: string) => void
}) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xs uppercase tracking-wider mb-3">Tamanho</h3>
      <div className="grid grid-cols-4 gap-1">
        {allSizes.map((size) => (
          <button
            key={size}
            onClick={() => onToggle(size)}
            className={`text-xs py-1 border transition-colors ${
              active.includes(size) ? 'bg-black text-white border-black' : 'border-border hover:border-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}