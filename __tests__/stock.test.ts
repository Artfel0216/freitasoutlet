import { describe, it, expect } from 'vitest'

describe('Stock manipulation logic', () => {
  it('decrements stock correctly', () => {
    const stock: Record<string, number> = { M: 10, G: 5, GG: 0 }
    const quantity = 3

    stock.M = Math.max(0, stock.M - quantity)
    expect(stock.M).toBe(7)
  })

  it('never goes below zero', () => {
    const stock: Record<string, number> = { M: 2 }
    const quantity = 5

    stock.M = Math.max(0, stock.M - quantity)
    expect(stock.M).toBe(0)
  })

  it('handles missing size gracefully', () => {
    const stock: Record<string, number> = { M: 10 }
    const sizeStock = stock['G'] ?? 0
    expect(sizeStock).toBe(0)
  })

  it('preserves other sizes when decrementing one', () => {
    const stock: Record<string, number> = { M: 10, G: 5, GG: 3 }
    const original = { ...stock }

    stock.M = Math.max(0, stock.M - 7)
    expect(stock.M).toBe(3)
    expect(stock.G).toBe(original.G)
    expect(stock.GG).toBe(original.GG)
  })

  it('handles bulk decrement across multiple sizes', () => {
    const stock: Record<string, number> = { M: 10, G: 5 }
    const items = [
      { size: 'M', qty: 3 },
      { size: 'G', qty: 2 },
    ]

    for (const item of items) {
      stock[item.size] = Math.max(0, (stock[item.size] || 0) - item.qty)
    }

    expect(stock.M).toBe(7)
    expect(stock.G).toBe(3)
  })

  it('handles zero stock correctly', () => {
    const stock: Record<string, number> = { M: 0 }
    expect(stock.M).toBe(0)
    stock.M = Math.max(0, stock.M - 1)
    expect(stock.M).toBe(0)
  })
})
