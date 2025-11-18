import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/providers/[id]/deals - Get provider's deals
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const deals = await prisma.deal.findMany({
      where: { providerId: id },
      include: {
        purchases: true,
        reviews: true,
        provider: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(deals)
  } catch (error) {
    console.error('Error fetching provider deals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
