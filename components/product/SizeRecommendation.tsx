'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SizeRecommendationProps {
  sizeGuide: string
}

const sizeRecommendations: Record<string, Record<string, { height: string; weight: string; recommendation: string }>> = {
  footwear: {
    '36': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 23cm' },
    '37': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 23.5cm' },
    '38': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 24cm' },
    '39': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 24.5cm' },
    '40': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 25cm' },
    '41': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 25.5cm' },
    '42': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 26cm' },
    '43': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 26.5cm' },
    '44': { height: '-', weight: '-', recommendation: 'Para pés com comprimento de 27cm' },
  },
  shirt: {
    'P': { height: '1.65-1.72m', weight: '55-70kg', recommendation: 'Para quem busca um caimento mais justo' },
    'M': { height: '1.70-1.78m', weight: '70-85kg', recommendation: 'Caimento regular, ideal para a maioria' },
    'G': { height: '1.75-1.85m', weight: '85-100kg', recommendation: 'Caimimento confortável e solto' },
    'GG': { height: '1.80-1.90m', weight: '100-115kg', recommendation: 'Para quem prefere mais folga' },
    'XGG': { height: '1.85m+', weight: '115kg+', recommendation: 'Máximo conforto e folga' },
  },
  oversized: {
    'P': { height: '1.65-1.75m', weight: '55-70kg', recommendation: 'Oversized já vem amplo, compre P para caimento solto' },
    'M': { height: '1.70-1.80m', weight: '70-85kg', recommendation: 'Oversized já vem amplo, compre M para caimento solto' },
    'G': { height: '1.75-1.85m', weight: '85-100kg', recommendation: 'Oversized já vem amplo, compre G para caimento solto' },
    'GG': { height: '1.80m+', weight: '100kg+', recommendation: 'Oversized já vem amplo, compre GG para caimento solto' },
  },
}

export function SizeRecommendation({ sizeGuide }: SizeRecommendationProps) {
  const [showModal, setShowModal] = useState(false)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const recommendedSize = useState<string | null>(null)

  const getSizeFromMeasurements = () => {
    const h = parseFloat(height.replace(',', '.'))
    const w = parseFloat(weight)

    if (isNaN(h) || isNaN(w)) return null

    if (sizeGuide === 'footwear') {
      if (h < 1.60) return '36'
      if (h < 1.65) return '37'
      if (h < 1.70) return '38'
      if (h < 1.73) return '39'
      if (h < 1.77) return '40'
      if (h < 1.80) return '41'
      if (h < 1.83) return '42'
      if (h < 1.87) return '43'
      return '44'
    }

    if (sizeGuide === 'oversized') {
      if (h < 1.70 && w < 70) return 'P'
      if (h < 1.78 && w < 85) return 'M'
      if (h < 1.85 && w < 100) return 'G'
      return 'GG'
    }

    
    if (h < 1.70 && w < 70) return 'P'
    if (h < 1.78 && w < 85) return 'M'
    if (h < 1.85 && w < 100) return 'G'
    if (h < 1.90 && w < 115) return 'GG'
    return 'XGG'
  }

  const handleRecommend = () => {
    const size = getSizeFromMeasurements()
    recommendedSize[1](size)
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-xs font-medium underline text-muted-foreground hover:text-black transition-colors"
      >
        Não sabe seu tamanho? Recomende
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white max-w-md w-full p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-bold text-lg uppercase tracking-tight">Recomendação de Tamanho</h2>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-black">✕</button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Informe suas medidas para receber uma recomendação personalizada.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Altura (m)</label>
                  <input
                    type="text"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="Ex: 1.75"
                    className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider mb-1 block">Peso (kg)</label>
                  <input
                    type="text"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="Ex: 75"
                    className="w-full border border-border px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  onClick={handleRecommend}
                  className="w-full bg-black text-white text-sm font-medium uppercase tracking-wider py-3 hover:bg-black/80 transition-colors"
                >
                  RECOMENDAR TAMANHO
                </button>

                {recommendedSize[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-muted p-4 text-center"
                  >
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tamanho recomendado</p>
                    <p className="font-heading font-black text-3xl">{recommendedSize[0]}</p>
                    {sizeRecommendations[sizeGuide]?.[recommendedSize[0]] && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {sizeRecommendations[sizeGuide][recommendedSize[0]].recommendation}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              <p className="text-[10px] text-muted-foreground mt-4 text-center">
                Esta é apenas uma sugestão. Para uma experiência ideal, consulte também nosso Guia de Medidas.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
