import 'server-only'
import { queryAll } from './database'

const TIER_THRESHOLDS: Record<LoyaltyTier, number> = {
  bronze: 0,
  prata: 500,
  ouro: 2000,
  diamante: 5000,
}

const TIER_DISCOUNTS: Record<LoyaltyTier, number> = {
  bronze: 0,
  prata: 3,
  ouro: 5,
  diamante: 10,
}

export type LoyaltyTier = 'bronze' | 'prata' | 'ouro' | 'diamante'

export function getLoyaltyTier(totalSpent: number): LoyaltyTier {
  if (totalSpent >= TIER_THRESHOLDS.diamante) return 'diamante'
  if (totalSpent >= TIER_THRESHOLDS.ouro) return 'ouro'
  if (totalSpent >= TIER_THRESHOLDS.prata) return 'prata'
  return 'bronze'
}

export function getLoyaltyDiscountForTier(tier: LoyaltyTier): number {
  return TIER_DISCOUNTS[tier]
}

/**
 * Computes the loyalty discount percentage based on the customer's real
 * purchase history (approved/paid orders) in the database.
 * Returns 0 if the customer has no qualifying history.
 */
export async function getLoyaltyDiscount(email: string): Promise<number> {
  const normalized = (email || '').toLowerCase().trim()
  if (!normalized) return 0

  const rows = await queryAll(
    "SELECT total FROM orders WHERE customer_email = $1 AND status = 'approved'",
    [normalized]
  ) as { total: number }[]

  const totalSpent = rows.reduce((sum, row) => sum + Number(row.total), 0)
  const tier = getLoyaltyTier(totalSpent)
  return getLoyaltyDiscountForTier(tier)
}