import { describe, it, expect, vi } from 'vitest'
import * as checkout from '../lib/checkout'
import { prisma } from '../lib/prisma'

vi.mock('../lib/prisma', () => ({
  prisma: {
    deal: { findUnique: vi.fn() },
    purchase: { create: vi.fn() },
  },
}))

describe('createCheckoutSession', () => {
  it('throws when deal not found', async () => {
    ;(prisma.deal.findUnique as any).mockResolvedValue(null)
    await expect(checkout.createCheckoutSession({ dealId: 'x', userId: 'u' })).rejects.toThrow('Deal not found')
  })
})
