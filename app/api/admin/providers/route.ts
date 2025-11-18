import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/admin/providers - Get all providers (admin only)
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

    const providers = await prisma.providerProfile.findMany({
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

    return NextResponse.json(providers)
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/providers - Approve/reject provider
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

    const { providerId, approved, rejectionReason } = await req.json()

    const updated = await prisma.providerProfile.update({
      where: { id: providerId },
      data: {
        approved,
        rejectionReason: approved ? null : rejectionReason,
        verifiedAt: approved ? new Date() : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
