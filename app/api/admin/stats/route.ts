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
    if (role !== 'SUPERADMIN' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch stats in parallel
    const [
      totalRevenueResult,
      activeUsers,
      activeDeals,
      pendingPayoutsResult // Mocking this for now as Payouts logic isn't fully defined
    ] = await Promise.all([
      prisma.purchase.aggregate({
        _sum: { total: true },
        where: { status: 'PAID' }
      }),
      prisma.user.count({ where: { active: true } }),
      prisma.deal.count({ where: { status: 'ACTIVE' } }),
      // Placeholder for payouts
      Promise.resolve(4500)
    ])

    const totalRevenue = totalRevenueResult._sum.total || 0

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true
      }
    })

    // Get pending deals for approval
    const pendingDeals = await prisma.deal.findMany({
      where: { status: 'DRAFT' }, // Or 'PENDING_APPROVAL' if we had that status, using DRAFT for now as "needs review" context
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        seller: {
          select: { businessName: true }
        }
      }
    })

    return NextResponse.json({
      stats: [
        { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+0%', color: 'text-success-green' },
        { label: 'Active Users', value: activeUsers.toLocaleString(), change: '+0%', color: 'text-primary-blue' },
        { label: 'Active Deals', value: activeDeals.toLocaleString(), change: '+0%', color: 'text-violet-accent' },
        { label: 'Pending Payouts', value: '$4,500', change: '3 req', color: 'text-warning-orange' },
      ],
      recentUsers,
      pendingDeals
    })
  } catch (error: any) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
