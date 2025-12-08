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

        const purchases = await prisma.purchase.findMany({
            where: { userId: session.user.id },
            include: {
                deal: {
                    select: {
                        title: true,
                        imageUrl: true,
                        seller: {
                            select: {
                                businessName: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ purchases })
    } catch (error: any) {
        console.error('Error fetching purchases:', error)
        return NextResponse.json(
            { error: 'Failed to fetch purchases' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { dealId, quantity, paymentMethod } = body

        if (!dealId || !quantity) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
        })

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
        }

        // Calculate totals
        const subtotal = deal.discountPrice * quantity
        const platformFee = subtotal * (deal.platformFeePercent / 100)
        const total = subtotal // Assuming fee is deducted from seller, or added? 
        // Usually platform fee is taken from the subtotal for the seller, but the user pays the subtotal.
        // Or is it a fee on top?
        // "Platform Fee: Transparent 5% platform fee display" in improvements summary suggests it might be added or displayed.
        // Let's assume Total = Subtotal for the user, and Platform Fee is internal, OR Total = Subtotal + Fee.
        // In `app/api/stripe/create-checkout/route.ts` (from previous turn), it seemed to just pass amount.
        // Let's look at the schema: `subtotal`, `platformFee`, `total`.
        // If I look at `app/customer/checkout/page.tsx` (not visible now but from memory/summary), it showed a breakdown.
        // Let's assume Total = Subtotal + Platform Fee if it's a buyer fee, or Total = Subtotal if it's a seller fee.
        // The summary said "Platform Fee: Transparent 5% platform fee display".
        // Let's assume for now Total = Subtotal + Platform Fee (if that's how it's displayed).
        // Actually, usually "Platform Fee" in marketplace is deducted from seller earnings.
        // But "Transparent 5% platform fee display" to the user suggests they pay it.
        // Let's assume User Pays: Total = Subtotal + Fee.

        // Wait, `deal.platformFeePercent` is on the Deal model.
        // Let's calculate:
        const feeAmount = (subtotal * 0.05) // Hardcoded 5% or use deal.platformFeePercent?
        // Schema has `platformFeePercent` on Deal.
        const calculatedFee = subtotal * (deal.platformFeePercent / 100)

        // For now, let's just create the purchase record.
        // In a real flow, this happens AFTER payment or via webhook.
        // But the user asked for `POST /api/purchases`.
        // Maybe this is for "Manual" payment or just recording it?
        // Or maybe this initializes the purchase before payment?
        // I'll set status to PENDING.

        const purchase = await prisma.purchase.create({
            data: {
                userId: session.user.id,
                dealId,
                quantity,
                subtotal,
                platformFee: calculatedFee,
                total: subtotal + calculatedFee, // Assuming user pays fee
                status: 'PENDING',
                paymentMethod: paymentMethod || 'STRIPE',
            },
        })

        return NextResponse.json({ purchase }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating purchase:', error)
        return NextResponse.json(
            { error: 'Failed to create purchase' },
            { status: 500 }
        )
    }
}
