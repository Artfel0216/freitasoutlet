import 'server-only'

type ShippingOption = {
  service: string
  description: string
  price: number
  deliveryDays: string
  error?: string
}

const baseRatesByState: Record<string, number> = {
  SP: 15.90, RJ: 19.90, MG: 19.90, ES: 19.90, PR: 22.90, SC: 22.90, RS: 22.90,
  BA: 25.90, SE: 25.90, AL: 25.90, PE: 25.90, PB: 25.90, RN: 25.90, CE: 25.90,
  PI: 25.90, MA: 25.90, GO: 22.90, DF: 22.90, MS: 22.90, MT: 24.90, PA: 27.90,
  AP: 29.90, RR: 35.90, AM: 35.90, AC: 35.90, RO: 35.90, TO: 27.90,
}

const deliveryDaysByState: Record<string, string> = {
  SP: '1-3', RJ: '2-4', MG: '2-4', ES: '2-4', PR: '2-4', SC: '2-4', RS: '2-4',
  BA: '4-7', SE: '4-7', AL: '4-7', PE: '4-7', PB: '4-7', RN: '4-7', CE: '4-7',
  PI: '5-8', MA: '5-8', GO: '2-5', DF: '2-5', MS: '3-6', MT: '4-7', PA: '5-10',
  AP: '6-12', RR: '7-14', AM: '7-14', AC: '7-14', RO: '7-14', TO: '5-10',
}

const FREE_SHIPPING_THRESHOLD = 299

export function calculateShipping(state: string, totalItems: number, subtotal?: number): ShippingOption[] {
  const uf = state.toUpperCase()
  const baseRate = baseRatesByState[uf] || 29.90
  const delivery = deliveryDaysByState[uf] || '5-10'

  const volumeSurcharge = totalItems > 3 ? (totalItems - 3) * 2.5 : 0

  const hasFreeShipping = subtotal !== undefined && subtotal >= FREE_SHIPPING_THRESHOLD

  const pacPrice = hasFreeShipping ? 0 : baseRate + volumeSurcharge
  const sedexPrice = hasFreeShipping ? Math.round((baseRate * 1.5) * 100) / 100 : Math.round((baseRate * 2.5 + volumeSurcharge * 1.5) * 100) / 100

  return [
    {
      service: 'PAC',
      description: hasFreeShipping ? 'Grátis (acima de R$ 299)' : 'Econômico',
      price: pacPrice,
      deliveryDays: delivery,
    },
    {
      service: 'SEDEX',
      description: 'Expresso',
      price: sedexPrice,
      deliveryDays: uf === 'SP' ? '1-2' : '2-4',
    },
  ]
}
