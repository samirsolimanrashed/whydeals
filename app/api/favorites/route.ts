import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

/**
 * GET /api/favorites
 * Fetch all favorite deals for the authenticated user
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const favorites = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                deal: {
                    include: {
                        seller: {
                            select: {
                                businessName: true,
                                logo: true,
                                rating: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ favorites })
    } catch (error: any) {
        console.error('Error fetching favorites:', error)
        return NextResponse.json(
            { error: 'Failed to fetch favorites' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/favorites
 * Add a deal to user's favorites
 * Body: { dealId: string }
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { dealId } = body

        if (!dealId) {
            return NextResponse.json(
                { error: 'Deal ID is required' },
                { status: 400 }
            )
        }

        // Check if deal exists
        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
        })

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
        }

        // Check if already favorited
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_dealId: {
                    userId: session.user.id,
                    dealId,
                },
            },
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Deal already in favorites' },
                { status: 400 }
            )
        }

        // Create favorite
        const favorite = await prisma.favorite.create({
            data: {
                userId: session.user.id,
                dealId,
            },
            include: {
                deal: true,
            },
        })

        return NextResponse.json({ favorite }, { status: 201 })
    } catch (error: any) {
        console.error('Error adding favorite:', error)
        return NextResponse.json(
            { error: 'Failed to add favorite' },
            { status: 500 }
        )
    }
}
