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

        // 1. Get the seller profile for the current user
        const seller = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
        })

        if (!seller) {
            return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
        }

        // 2. Fetch purchases for deals created by this seller
        const rawOrders = await prisma.purchase.findMany({
            where: {
                deal: {
                    sellerId: seller.id
                }
            },
            include: {
                deal: {
                    select: {
                        id: true,
                        title: true,
                        imageUrl: true,
                        image: true,
                    }
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Map avatar to image for frontend consistency
        const orders = rawOrders.map(order => ({
            ...order,
            user: {
                ...order.user,
                image: order.user.avatar
            }
        }))

        return NextResponse.json({ orders })
    } catch (error) {
        console.error('Error fetching seller orders:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
