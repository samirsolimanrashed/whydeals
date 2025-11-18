import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/providers/profile - Get current user's provider profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        providerProfile: {
          include: {
            payoutAccount: true,
            analytics: true,
            deals: true,
          },
        },
      },
    })

    if (!user?.providerProfile) {
      return NextResponse.json({ error: 'Not a provider' }, { status: 404 })
    }

    return NextResponse.json(user.providerProfile)
  } catch (error) {
    console.error('Error fetching provider profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/providers/profile - Update provider profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updated = await prisma.providerProfile.update({
      where: { userId: user.id },
      data: {
        businessName: data.businessName,
        businessEmail: data.businessEmail,
        phone: data.phone,
        logo: data.logo,
        banner: data.banner,
        bio: data.bio,
        website: data.website,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating provider profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
