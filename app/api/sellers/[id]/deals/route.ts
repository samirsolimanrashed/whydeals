import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/sellers/[id]/deals - Get seller's deals
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const deals = await prisma.deal.findMany({
      where: { sellerId: id },
      include: {
        purchases: true,
        reviews: true,
        seller: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching seller deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
