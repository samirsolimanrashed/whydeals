import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/checkout'

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

    const { session } = await createCheckoutSession({ dealId, quantity, userId })

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
