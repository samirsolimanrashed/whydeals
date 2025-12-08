import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const role = (session.user as any).role
        if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { status, rejectionReason } = body

        if (['FEATURE', 'UNFEATURE'].includes(status)) {
            const deal = await prisma.deal.update({
                where: { id: params.id },
                data: {
                    isFeatured: status === 'FEATURE',
                },
            })
            return NextResponse.json({ deal })
        }

        if (!['ACTIVE', 'REJECTED', 'DRAFT'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const deal = await prisma.deal.update({
            where: { id: params.id },
            data: {
                status,
            },
            include: {
                seller: true,
            },
        })

        // Create a notification for the seller
        if (deal.seller && deal.seller.userId) {
            let title = ''
            let content = ''

            if (status === 'ACTIVE') {
                title = 'Deal Approved'
                content = `Your deal "${deal.title}" has been approved and is now live.`
            } else if (status === 'REJECTED') {
                title = 'Deal Rejected'
                content = `Your deal "${deal.title}" was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`
            }

            if (title) {
                await prisma.notification.create({
                    data: {
                        userId: deal.seller.userId,
                        type: 'DEAL_UPDATE',
                        title,
                        content,
                        link: `/seller/deals/${deal.id}`,
                    },
                })
            }
        }

        return NextResponse.json({ deal })
    } catch (error: any) {
        console.error('Error updating deal status:', error)
        return NextResponse.json(
            { error: 'Failed to update deal status' },
            { status: 500 }
        )
    }
}
