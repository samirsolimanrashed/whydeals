import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { dealId, quantity } = body

        if (!dealId || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
        })

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
        }

        // Calculate totals
        const price = deal.discountPrice || deal.originalPrice
        const subtotal = price * quantity
        const platformFee = subtotal * 0.05 // 5% fee
        const total = subtotal + platformFee

        // Create purchase record
        const purchase = await prisma.purchase.create({
            data: {
                userId: session.user.id,
                dealId: deal.id,
                quantity: quantity,
                subtotal: subtotal,
                platformFee: platformFee,
                total: total,
                status: 'COMPLETED', // Directly completed for mock
                transactionId: `mock_${Date.now()}`,
                paymentProvider: 'STRIPE', // Mocking Stripe
                paymentMethod: 'CARD',
            },
        })

        // Update deal stats
        await prisma.deal.update({
            where: { id: deal.id },
            data: {
                sold: { increment: quantity },
            },
        })

        // Return success URL
        return NextResponse.json({
            url: `/customer/checkout/success?session_id=mock_${purchase.id}`
        })

    } catch (error) {
        console.error('Mock checkout error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
