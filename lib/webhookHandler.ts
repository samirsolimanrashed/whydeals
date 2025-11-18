import { prisma } from './prisma'

export async function handleStripeEvent(event: any) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      if (session.metadata?.purchaseId) {
        const purchaseId = String(session.metadata.purchaseId)
        const paymentIdentifier = session.payment_intent || session.id

        const purchase = await prisma.purchase.findUnique({ where: { id: purchaseId } })

        await prisma.purchase.update({
          where: { id: purchaseId },
          data: {
            status: 'PAID',
            stripeId: paymentIdentifier,
          },
        })

        if (purchase && purchase.dealId && typeof purchase.quantity === 'number') {
          await prisma.deal.update({
            where: { id: purchase.dealId },
            data: { sold: { increment: purchase.quantity } },
          })
        }
      }
      break
    }

    case 'payment_intent.succeeded': {
      // no-op or log
      break
    }

    default:
      // unhandled
      break
  }
}
