import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/deals - Get all active deals
export async function GET(request: NextRequest) {
  try {
    const deals = await prisma.deal.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        discountPrice: true,
        imageUrl: true,
        category: true,
        inventory: true,
        sold: true,
        startTime: true,
        endTime: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(deals, { status: 200 })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json([], { status: 200 })
  }
}
