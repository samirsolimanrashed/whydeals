import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/providers - Get all providers
export async function GET(request: NextRequest) {
  try {
    // For MVP, return mock data. Replace with actual Prisma query later:
    // const providers = await prisma.providerProfile.findMany({
    //   include: {
    //     user: true,
    //     deals: true,
    //   },
    // })

    const providers = [
      {
        id: 'provider-1',
        userId: 'user-1',
        businessName: 'Coffee Corner',
        description: 'Premium coffee shop',
        website: 'https://coffeecorner.com',
        phone: '(555) 111-2222',
        address: '123 Main St, City, State',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-1',
          email: 'coffee@example.com',
          name: 'Coffee Corner Owner',
        },
        deals: [],
      },
      {
        id: 'provider-2',
        userId: 'user-2',
        businessName: 'FitZone Gym',
        description: 'Fitness and wellness center',
        website: 'https://fitzone.com',
        phone: '(555) 222-3333',
        address: '456 Oak Ave, City, State',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-2',
          email: 'fitzone@example.com',
          name: 'FitZone Manager',
        },
        deals: [],
      },
    ]

    return NextResponse.json({ providers }, { status: 200 })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch providers' },
      { status: 500 }
    )
  }
}

// POST /api/providers - Create a new provider profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, businessName, description, website, phone, address } = body

    if (!userId || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and businessName' },
        { status: 400 }
      )
    }

    // For MVP, return success. Replace with actual Prisma create later:
    // const provider = await prisma.providerProfile.create({
    //   data: {
    //     userId,
    //     businessName,
    //     description,
    //     website,
    //     phone,
    //     address,
    //   },
    //   include: { user: true },
    // })

    const provider = {
      id: `provider-${Date.now()}`,
      userId,
      businessName,
      description,
      website,
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return NextResponse.json({ provider }, { status: 201 })
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    )
  }
}

