import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      status: 'ACTIVE',
      endTime: {
        gte: new Date(), // Only show deals that haven't expired
      },
    }

    const featured = searchParams.get('featured')
    if (featured === 'true') {
      where.isFeatured = true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Price Range Filter
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    if (minPrice || maxPrice) {
      where.discountPrice = {}
      if (minPrice) where.discountPrice.gte = parseFloat(minPrice)
      if (maxPrice) where.discountPrice.lte = parseFloat(maxPrice)
    }

    // Build orderBy clause
    let orderBy: any = {}
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'price-low':
        orderBy = { discountPrice: 'asc' }
        break
      case 'price-high':
        orderBy = { discountPrice: 'desc' }
        break
      case 'ending-soon':
        orderBy = { endTime: 'asc' }
        break
      case 'popular':
        orderBy = { sold: 'desc' }
        break
      default:
        orderBy = { createdAt: 'desc' }
    }

    // Fetch deals with pagination
    const [deals, total] = await Promise.all([
      prisma.deal.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          seller: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.deal.count({ where }),
    ])

    return NextResponse.json({
      deals,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Error fetching deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== 'SELLER' && role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden: Sellers only' }, { status: 403 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      originalPrice,
      discountPrice,
      startTime,
      endTime,
      inventory,
      imageUrl,
    } = body

    // Basic validation
    if (!title || !originalPrice || !discountPrice || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get seller profile
    const sellerProfile = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!sellerProfile && role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Seller profile not found' },
        { status: 404 }
      )
    }

    // If SUPERADMIN, they might be creating for a specific seller, but for now assume they have a profile or we handle it differently.
    // For simplicity, we'll require a seller profile for now.
    if (!sellerProfile) {
      return NextResponse.json(
        { error: 'Seller profile required to create deals' },
        { status: 400 }
      )
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        description: description || '',
        category,
        originalPrice: parseFloat(originalPrice),
        discountPrice: parseFloat(discountPrice),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        inventory: parseInt(inventory) || 1,
        imageUrl,
        sellerId: sellerProfile.id,
        status: 'ACTIVE', // Auto-publish for MVP
      },
    })

    // Update analytics
    await prisma.sellerAnalytics.upsert({
      where: { sellerId: sellerProfile.id },
      create: {
        sellerId: sellerProfile.id,
        totalDealsCreated: 1,
      },
      update: {
        totalDealsCreated: { increment: 1 },
      },
    })

    return NextResponse.json({ deal }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating deal:', error)
    return NextResponse.json(
      { error: 'Failed to create deal' },
      { status: 500 }
    )
  }
}
