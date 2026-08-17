export type Review = {
  id: string
  productId: string
  customerName: string
  rating: number
  title: string
  comment: string
  images: string[]
  verified: boolean
  createdAt: string
}

export type ReviewStats = {
  average: number
  count: number
}