
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const sellerEmail = 'seller@example.com'
    const customerEmail = 'customer@example.com'

    // 1. Find Seller
    const sellerUser = await prisma.user.findUnique({ where: { email: sellerEmail } })
    if (!sellerUser) throw new Error('Seller not found')

    const sellerProfile = await prisma.sellerProfile.findUnique({ where: { userId: sellerUser.id } })
    if (!sellerProfile) throw new Error('Seller Profile not found')

    // 2. Find Customer
    const customerUser = await prisma.user.findUnique({ where: { email: customerEmail } })
    if (!customerUser) throw new Error('Customer not found')

    // 3. Find a Deal
    const deal = await prisma.deal.findFirst({ where: { sellerId: sellerProfile.id } })
    if (!deal) throw new Error('No deals found for seller')

    // 4. Create Purchase
    const purchase = await prisma.purchase.create({
        data: {
            userId: customerUser.id,
            dealId: deal.id,
            quantity: 1,
            subtotal: deal.discountPrice,
            platformFee: deal.discountPrice * 0.05,
            total: deal.discountPrice * 1.05,
            status: 'PAID',
            transactionId: `TEST_${Date.now()}`,
            paymentProvider: 'STRIPE'
        }
    })

    console.log(`✅ Created test order for seller ${sellerEmail}`)
    console.log(`Order ID: ${purchase.id}`)
    console.log(`Amount: $${purchase.total}`)
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
