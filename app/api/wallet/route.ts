import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth-config'

// GET /api/wallet - Get user's wallet
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        wallet: {
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 50,
            },
          },
        },
      },
    })

    if (!user?.wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    return NextResponse.json(user.wallet)
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/wallet/add-funds - Add funds to wallet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount } = await req.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { wallet: true },
    })

    if (!user?.wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    const updatedWallet = await prisma.wallet.update({
      where: { userId: user.id },
      data: {
        balance: user.wallet.balance + amount,
      },
    })

    await prisma.walletTransaction.create({
      data: {
        walletId: updatedWallet.id,
        type: 'ADD_FUNDS',
        amount,
        balanceBefore: user.wallet.balance,
        balanceAfter: updatedWallet.balance,
        note: 'Funds added to wallet',
      },
    })

    return NextResponse.json(updatedWallet)
  } catch (error) {
    console.error('Error adding funds:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
