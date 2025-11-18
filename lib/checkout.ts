import { prisma } from './prisma'
import { stripe } from './stripe'

export async function createCheckoutSession({ dealId, quantity = 1, userId }: { dealId: string, quantity?: number, userId: string }) {
  const deal = await prisma.deal.findUnique({ where: { id: dealId } })
  if (!deal) throw new Error('Deal not found')

  const now = new Date()
  const isActive = (!deal.startTime || deal.startTime <= now) && (!deal.endTime || deal.endTime >= now)
  const available = (deal.inventory ?? 0) - (deal.sold ?? 0)
  if (!isActive) throw new Error('Deal not active')
  if (available <= 0) throw new Error('Sold out')
  if (quantity > available) throw new Error(`Only ${available} remaining`)

  const subtotal = (deal.discountPrice ?? 0) * quantity
  const platformFeePercent = deal.platformFeePercent || 10
  const platformFee = Number((subtotal * (platformFeePercent / 100)).toFixed(2))
  const total = Number((subtotal + platformFee).toFixed(2))

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      dealId,
      quantity,
      subtotal: subtotal,
      platformFee: platformFee,
      total: total,
      status: 'PENDING',
    },
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: deal.title,
            description: deal.description,
            images: deal.imageUrl ? [deal.imageUrl] : [],
          },
          unit_amount: Math.round((deal.discountPrice ?? 0) * 100),
        },
        quantity,
      },
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Platform Fee',
            description: 'Why Deals platform fee (5%)',
          },
          unit_amount: Math.round(platformFee * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/checkout?dealId=${dealId}`,
    metadata: {
      purchaseId: purchase.id,
      userId,
      dealId,
      quantity: String(quantity),
    },
  })

  return { session, purchase }
}
