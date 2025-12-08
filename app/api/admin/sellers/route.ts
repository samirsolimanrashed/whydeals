import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/admin/sellers - Get all sellers (admin only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || '' },
    })

    if (user?.role !== 'SUPERADMIN' && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sellers = await prisma.sellerProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            verified: true,
          },
        },
        analytics: true,
        payoutAccount: true,
        deals: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(sellers)
  } catch (error) {
    console.error('Error fetching sellers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/sellers - Approve/reject seller
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || '' },
    })

    if (user?.role !== 'SUPERADMIN' && user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { sellerId, approved, rejectionReason } = await req.json()

    const updated = await prisma.sellerProfile.update({
      where: { id: sellerId },
      data: {
        approved,
        rejectionReason: approved ? null : rejectionReason,
        verifiedAt: approved ? new Date() : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating seller:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
