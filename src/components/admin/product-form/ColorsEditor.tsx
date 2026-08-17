'use client'

import { inputClass } from './form-utils'
import type { ColorInput } from './form-utils'

interface ColorsEditorProps {
  colors: ColorInput[]
  updateColor: (index: number, field: keyof ColorInput, value: string) => void
  removeColor: (index: number) => void
}

export function ColorsEditor({ colors, updateColor, removeColor }: ColorsEditorProps) {
  return (
    <>
      {colors.map((color, i) => (
        <div key={i} className="flex items-center gap-3">
          <input
            type="color"
            value={color.hex}
            onChange={(e) => updateColor(i, 'hex', e.target.value)}
            className="w-10 h-10 border border-border cursor-pointer"
          />
          <input
            type="text"
            placeholder="Nome da cor"
            value={color.name}
            onChange={(e) => updateColor(i, 'name', e.target.value)}
            className={`${inputClass} flex-1`}
          />
          {colors.length > 1 && (
            <button type="button" onClick={() => removeColor(i)} className="text-xs text-red-500 hover:underline">
              Remover
            </button>
          )}
        </div>
      ))}
    </>
  )
}