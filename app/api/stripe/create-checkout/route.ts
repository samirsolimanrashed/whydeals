import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dealId, quantity = 1, userId } = body

    if (!dealId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: dealId and userId' },
        { status: 400 }
      )
    }

    // Get deal from database
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      include: { provider: true },
    })

    if (!deal || !deal.isActive) {
      return NextResponse.json(
        { error: 'Deal not found or not active' },
        { status: 404 }
      )
    }

    // Check inventory
    if (deal.maxPurchases && deal.currentPurchases + quantity > deal.maxPurchases) {
      return NextResponse.json(
        { error: 'Deal sold out' },
        { status: 400 }
      )
    }

    // Calculate prices
    const subtotal = deal.discountPrice * quantity
    const platformFee = subtotal * 0.05 // 5% platform fee
    const total = subtotal + platformFee

    // Create purchase record first
    const purchase = await prisma.purchase.create({
      data: {
        userId,
        dealId,
        quantity,
        totalPrice: total,
        commissionAmount: platformFee,
        status: 'PENDING',
      },
    })

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: deal.title,
              description: deal.description,
              images: deal.imageUrl ? [deal.imageUrl] : [],
            },
            unit_amount: Math.round(deal.discountPrice * 100), // Convert to cents
          },
          quantity: quantity,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Platform Fee',
              description: 'Why Deals platform fee (5%)',
            },
            unit_amount: Math.round(platformFee * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/checkout?dealId=${dealId}`,
      metadata: {
        purchaseId: purchase.id,
        userId,
        dealId,
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

