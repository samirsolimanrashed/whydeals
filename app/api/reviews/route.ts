import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { dealId, rating, comment } = body

        if (!dealId || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Check if user has already reviewed this deal
        const existingReview = await prisma.review.findUnique({
            where: {
                dealId_userId: {
                    dealId,
                    userId: session.user.id,
                },
            },
        })

        if (existingReview) {
            return NextResponse.json({ error: 'You have already reviewed this deal' }, { status: 400 })
        }

        // Check if user has purchased the deal (Verified Buyer)
        const purchase = await prisma.purchase.findFirst({
            where: {
                userId: session.user.id,
                dealId: dealId,
                status: 'PAID', // Assuming 'PAID' is the status for completed purchases
            },
        })

        // Create the review
        const review = await prisma.review.create({
            data: {
                dealId,
                userId: session.user.id,
                rating: Number(rating),
                comment,
                verified: !!purchase, // True if purchase exists
            },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true,
                    },
                },
            },
        })

        // Update Seller Rating (Async)
        // We can do this here or in a background job. For simplicity, let's do it here.
        // 1. Get deal to find seller
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            select: { sellerId: true },
        })

        if (deal) {
            // 2. Calculate new average for seller
            const sellerReviews = await prisma.review.findMany({
                where: {
                    deal: {
                        sellerId: deal.sellerId,
                    },
                },
                select: { rating: true },
            })

            const totalRating = sellerReviews.reduce((acc, r) => acc + r.rating, 0)
            const averageRating = totalRating / sellerReviews.length

            // 3. Update Seller Profile
            await prisma.sellerProfile.update({
                where: { id: deal.sellerId },
                data: { rating: averageRating },
            })
        }

        return NextResponse.json({ review })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
