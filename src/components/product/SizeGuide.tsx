'use client'

import { useState } from 'react'
import type { SizeGuide as SizeGuideType } from '@/types'

const sizeGuides: Record<string, SizeGuideType> = {
  footwear: {
    type: 'footwear',
    label: 'Calçados',
    note: 'Chuteiras costumam ter fôrma mais justa. Recomendamos comprar um número maior que o habitual.',
    measurements: [
      { size: '38', measurements: { 'BR': '38', 'EU': '38', 'CM': '24.5' } },
      { size: '39', measurements: { 'BR': '39', 'EU': '39', 'CM': '25.0' } },
      { size: '40', measurements: { 'BR': '40', 'EU': '40', 'CM': '25.5' } },
      { size: '41', measurements: { 'BR': '41', 'EU': '41', 'CM': '26.0' } },
      { size: '42', measurements: { 'BR': '42', 'EU': '42', 'CM': '26.5' } },
      { size: '43', measurements: { 'BR': '43', 'EU': '43', 'CM': '27.0' } },
      { size: '44', measurements: { 'BR': '44', 'EU': '44', 'CM': '27.5' } },
    ],
  },
  shirt: {
    type: 'shirt',
    label: 'Camisas',
    measurements: [
      { size: 'P', measurements: { 'Peito': '96 cm', 'Cintura': '80 cm', 'Comprimento': '70 cm' } },
      { size: 'M', measurements: { 'Peito': '102 cm', 'Cintura': '86 cm', 'Comprimento': '72 cm' } },
      { size: 'G', measurements: { 'Peito': '108 cm', 'Cintura': '92 cm', 'Comprimento': '74 cm' } },
      { size: 'GG', measurements: { 'Peito': '114 cm', 'Cintura': '98 cm', 'Comprimento': '76 cm' } },
      { size: 'XGG', measurements: { 'Peito': '120 cm', 'Cintura': '104 cm', 'Comprimento': '78 cm' } },
    ],
  },
  oversized: {
    type: 'oversized',
    label: 'Camisas Oversized (Streetwear)',
    note: 'Modelagem ampla e intencionalmente mais larga. Compre seu tamanho habitual para caimento solto.',
    measurements: [
      { size: 'P', measurements: { 'Peito': '110 cm', 'Cintura': '104 cm', 'Comprimento': '74 cm' } },
      { size: 'M', measurements: { 'Peito': '116 cm', 'Cintura': '110 cm', 'Comprimento': '76 cm' } },
      { size: 'G', measurements: { 'Peito': '122 cm', 'Cintura': '116 cm', 'Comprimento': '78 cm' } },
      { size: 'GG', measurements: { 'Peito': '128 cm', 'Cintura': '122 cm', 'Comprimento': '80 cm' } },
    ],
  },
}

interface SizeGuideProps {
  type: string
}

export function SizeGuide({ type }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const guide = sizeGuides[type] || sizeGuides.shirt

  const columns = Object.keys(guide.measurements[0].measurements)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs underline hover:no-underline"
        type="button"
      >
        Guia de Medidas
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative bg-white w-full max-w-lg p-6 lg:p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1"
              aria-label="Fechar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-heading font-bold text-lg uppercase tracking-wider mb-1">{guide.label}</h3>

            {guide.note && (
              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted">{guide.note}</p>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-heading font-bold text-xs uppercase tracking-wider">Tam.</th>
                    {columns.map((col) => (
                      <th key={col} className="text-left py-2 px-2 font-heading font-bold text-xs uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.measurements.map((row) => (
                    <tr key={row.size} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-bold">{row.size}</td>
                      {columns.map((col) => (
                        <td key={col} className="py-2 px-2 text-muted-foreground">
                          {row.measurements[col]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
