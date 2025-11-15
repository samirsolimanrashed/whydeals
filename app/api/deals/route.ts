import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getMockDeals } from '@/lib/mockData'

// GET /api/deals - Get all deals
export async function GET(request: NextRequest) {
  try {
    // For MVP, return mock data. Replace with actual Prisma query later:
    // const deals = await prisma.deal.findMany({
    //   where: { isActive: true },
    //   include: { provider: { include: { user: true } } },
    //   orderBy: { createdAt: 'desc' },
    // })

    const deals = getMockDeals()
    return NextResponse.json({ deals }, { status: 200 })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

// POST /api/deals - Create a new deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      providerId,
      title,
      description,
      originalPrice,
      discountPrice,
      discountPercent,
      imageUrl,
      category,
      startDate,
      endDate,
      maxPurchases,
    } = body

    // Validate required fields
    if (!providerId || !title || !description || !originalPrice || !discountPrice || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate discount percent if not provided
    const calculatedDiscount = discountPercent || 
      Math.round(((originalPrice - discountPrice) / originalPrice) * 100)

    // For MVP, return success. Replace with actual Prisma create later:
    // const deal = await prisma.deal.create({
    //   data: {
    //     providerId,
    //     title,
    //     description,
    //     originalPrice: parseFloat(originalPrice),
    //     discountPrice: parseFloat(discountPrice),
    //     discountPercent: calculatedDiscount,
    //     imageUrl,
    //     category,
    //     startDate: new Date(startDate),
    //     endDate: new Date(endDate),
    //     maxPurchases: maxPurchases ? parseInt(maxPurchases) : null,
    //     currentPurchases: 0,
    //     isActive: true,
    //   },
    //   include: { provider: true },
    // })

    const deal = {
      id: `deal-${Date.now()}`,
      providerId,
      title,
      description,
      originalPrice: parseFloat(originalPrice),
      discountPrice: parseFloat(discountPrice),
      discountPercent: calculatedDiscount,
      imageUrl,
      category,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxPurchases: maxPurchases ? parseInt(maxPurchases) : null,
      currentPurchases: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}

