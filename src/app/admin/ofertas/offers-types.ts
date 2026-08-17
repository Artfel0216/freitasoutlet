export type SiteOffer = {
  id: string
  type: 'weekly' | 'monthly'
  title: string
  description: string
  discountPercent: number
  active: boolean
  startsAt: string
  endsAt: string
  createdAt: string
  updatedAt: string
}

export type OfferType = 'weekly' | 'monthly'

export interface OfferFormState {
  type: OfferType
  title: string
  description: string
  discountPercent: string
  startsAt: string
  endsAt: string
}

export const emptyOfferForm: OfferFormState = {
  type: 'weekly',
  title: '',
  description: '',
  discountPercent: '',
  startsAt: '',
  endsAt: '',
}