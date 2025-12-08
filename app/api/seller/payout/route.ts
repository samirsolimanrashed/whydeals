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
            include: {
                payoutAccount: true
            }
        })

        if (!seller) {
            return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
        }

        return NextResponse.json({ payoutAccount: seller.payoutAccount })
    } catch (error) {
        console.error('Error fetching payout account:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const seller = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id }
        })

        if (!seller) {
            return NextResponse.json({ error: 'Seller profile not found' }, { status: 404 })
        }

        const body = await request.json()
        const { accountHolder, bankName, accountNumber, routingNumber, accountType, country } = body

        // Basic validation
        if (!accountHolder || !accountNumber || !accountType || !country) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Upsert payout account
        const payoutAccount = await prisma.payoutAccount.upsert({
            where: { sellerId: seller.id },
            create: {
                sellerId: seller.id,
                accountHolder,
                bankName: bankName || null,
                accountNumber,
                routingNumber: routingNumber || null,
                accountType,
                country,
                verified: false // Admin will verify manually
            },
            update: {
                accountHolder,
                bankName: bankName || null,
                accountNumber,
                routingNumber: routingNumber || null,
                accountType,
                country
            }
        })

        return NextResponse.json({ payoutAccount })
    } catch (error) {
        console.error('Error saving payout account:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
