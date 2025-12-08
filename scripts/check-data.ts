
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const sellerCount = await prisma.sellerProfile.count()
    const purchaseCount = await prisma.purchase.count()
    const userCount = await prisma.user.count()

    console.log(`Sellers: ${sellerCount}`)
    console.log(`Purchases: ${purchaseCount}`)
    console.log(`Users: ${userCount}`)

    if (sellerCount > 0) {
        const seller = await prisma.sellerProfile.findFirst({
            include: { user: true }
        })
        console.log(`First Seller: ${seller?.user.email}`)
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
