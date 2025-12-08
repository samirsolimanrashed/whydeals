import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const seller = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (!seller) {
            return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
        }

        // 1. Total Sales (Sum of total from PAID/COMPLETED purchases)
        const salesAgg = await prisma.purchase.aggregate({
            _sum: {
                total: true
            },
            where: {
                deal: { sellerId: seller.id },
                status: { in: ['PAID', 'COMPLETED'] }
            }
        })
        const totalSales = salesAgg._sum.total || 0

        // 2. Active Deals Count
        const activeDealsCount = await prisma.deal.count({
            where: {
                sellerId: seller.id,
                status: 'ACTIVE',
                endTime: { gte: new Date() }
            }
        })

        // 3. Total Views
        const viewsAgg = await prisma.deal.aggregate({
            _sum: {
                views: true
            },
            where: {
                sellerId: seller.id
            }
        })
        const totalViews = viewsAgg._sum.views || 0

        // 4. Average Rating
        // We need to aggregate reviews for all deals by this seller
        const reviewsAgg = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                deal: { sellerId: seller.id }
            }
        })
        const avgRating = reviewsAgg._avg.rating || 0

        // 5. Recent Sales
        const recentSales = await prisma.purchase.findMany({
            where: {
                deal: { sellerId: seller.id },
                status: { in: ['PAID', 'COMPLETED', 'PENDING'] } // Show pending too so they see activity
            },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                deal: { select: { title: true } },
                user: { select: { name: true, email: true } }
            }
        })

        return NextResponse.json({
            stats: {
                totalSales,
                activeDeals: activeDealsCount,
                totalViews,
                avgRating
            },
            recentSales: recentSales.map(sale => ({
                id: sale.id,
                deal: sale.deal.title,
                customer: sale.user.name || sale.user.email,
                amount: sale.total,
                date: sale.createdAt,
                status: sale.status
            }))
        })

    } catch (error) {
        console.error('Error fetching seller stats:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
