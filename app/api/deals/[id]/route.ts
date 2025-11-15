import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMockDeals } from '@/lib/mockData'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/deals/[id] - Get a specific deal
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // For MVP, return mock data. Replace with actual Prisma query later:
    // const deal = await prisma.deal.findUnique({
    //   where: { id: params.id },
    //   include: { provider: { include: { user: true } } },
    // })

    const deals = getMockDeals()
    const deal = deals.find(d => d.id === params.id)

    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ deal }, { status: 200 })
  } catch (error) {
    console.error('Error fetching deal:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deal' },
      { status: 500 }
    )
  }
}

// PATCH /api/deals/[id] - Update a deal
export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const body = await request.json()

    // For MVP, return success. Replace with actual Prisma update later:
    // const deal = await prisma.deal.update({
    //   where: { id: params.id },
    //   data: {
    //     ...body,
    //     updatedAt: new Date(),
    //   },
    //   include: { provider: true },
    // })

    const deal = {
      id: params.id,
      ...body,
      updatedAt: new Date(),
    }

    return NextResponse.json({ deal }, { status: 200 })
  } catch (error) {
    console.error('Error updating deal:', error)
    return NextResponse.json(
      { error: 'Failed to update deal' },
      { status: 500 }
    )
  }
}

// DELETE /api/deals/[id] - Delete a deal
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // For MVP, return success. Replace with actual Prisma delete later:
    // await prisma.deal.delete({
    //   where: { id: params.id },
    // })

    return NextResponse.json(
      { message: 'Deal deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting deal:', error)
    return NextResponse.json(
      { error: 'Failed to delete deal' },
      { status: 500 }
    )
  }
}

