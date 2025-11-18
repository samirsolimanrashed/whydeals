import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const deal = await prisma.deal.findUnique({ where: { id } })
    if (!deal) return NextResponse.json({ error: 'Deal not found' }, { status: 404 })

    return NextResponse.json({
      id: deal.id,
      title: deal.title,
      description: deal.description,
      discountPrice: deal.discountPrice,
      originalPrice: deal.originalPrice,
      imageUrl: deal.imageUrl,
      inventory: deal.inventory,
      sold: deal.sold,
      startTime: deal.startTime,
      endTime: deal.endTime,
      providerId: deal.providerId,
    })
  } catch (err: any) {
    console.error('Get deal error', err)
    return NextResponse.json({ error: err.message || 'Failed to fetch deal' }, { status: 500 })
  }
}