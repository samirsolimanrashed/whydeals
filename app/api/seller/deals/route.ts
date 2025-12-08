import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const role = (session.user as any).role
        if (role !== 'SELLER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get seller profile
        const sellerProfile = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (!sellerProfile) {
            return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
        }

        const deals = await prisma.deal.findMany({
            where: { sellerId: sellerProfile.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { purchases: true }
                }
            }
        })

        // Calculate revenue for each deal (simplified)
        const dealsWithStats = deals.map(deal => ({
            ...deal,
            sales: deal.sold || 0,
            revenue: (deal.sold || 0) * (deal.discountPrice || 0)
        }))

        return NextResponse.json({ deals: dealsWithStats })
    } catch (error: any) {
        console.error('Error fetching seller deals:', error)
        return NextResponse.json(
            { error: 'Failed to fetch deals' },
            { status: 500 }
        )
    }
}
