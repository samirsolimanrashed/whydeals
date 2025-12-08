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
        if (role !== 'SUPERADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { role: newRole } = body

        if (!['CUSTOMER', 'SELLER', 'SUPERADMIN'].includes(newRole)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role: newRole },
        })

        // If promoting to SELLER, ensure SellerProfile exists
        if (newRole === 'SELLER') {
            const existingProfile = await prisma.sellerProfile.findUnique({
                where: { userId: params.id },
            })

            if (!existingProfile) {
                await prisma.sellerProfile.create({
                    data: {
                        userId: params.id,
                        businessName: updatedUser.name || 'New Store',
                        bio: 'New seller store',
                    },
                })
            }
        }

        return NextResponse.json({ user: updatedUser })
    } catch (error: any) {
        console.error('Error updating user role:', error)
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        )
    }
}
