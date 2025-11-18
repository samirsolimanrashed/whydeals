'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Deal {
  id: string
  title: string
  price: number
  image?: string
  inventory: number
  sold: number
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dealId = searchParams.get('dealId')
  const [deal, setDeal] = useState<Deal | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [dealLoading, setDealLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (dealId) {
      const fetchDeal = async () => {
        try {
          const response = await fetch(`/api/deals/${dealId}`)
          const data = await response.json()
          setDeal(data)
        } catch (error) {
          console.error('Failed to fetch deal:', error)
        } finally {
          setDealLoading(false)
        }
      }
      fetchDeal()
    }
  }, [dealId])

  const handleCheckout = async () => {
    if (!deal || !session?.user?.id) {
      router.push('/auth/signin')
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          quantity,
          userId: session.user.id,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (dealLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <p className="text-neutral-600">Loading deal...</p>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Deal not found</h2>
          <Button onClick={() => router.push('/')}>Back to Deals</Button>
        </div>
      </div>
    )
  }

  const available = deal.inventory - deal.sold
  const price = typeof deal.price === 'number' ? deal.price : 0
  const subtotal = price * quantity
  const platformFee = subtotal * 0.1
  const total = subtotal + platformFee

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Checkout</h1>

        <div className="grid gap-6">
          {/* Deal Summary */}
          <Card className="p-6">
            <div className="flex gap-6">
              {deal.image && (
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">{deal.title}</h2>
                <p className="text-3xl font-bold text-blue-600 mb-4">${price.toFixed(2)}</p>
                <p className="text-neutral-600">
                  {available} items available
                </p>
              </div>
            </div>
          </Card>

          {/* Quantity Selection */}
          <Card className="p-6">
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 font-bold"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={available}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center border border-neutral-300 rounded-lg px-3 py-2 font-semibold"
              />
              <button
                onClick={() => setQuantity(Math.min(available, quantity + 1))}
                className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 font-bold"
              >
                +
              </button>
            </div>
          </Card>

          {/* Price Breakdown */}
          <Card className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({quantity}x)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Platform Fee (10%)</span>
                <span>${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between text-lg font-bold text-neutral-900">
                <span>Total</span>
                <span className="text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* Checkout Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleCheckout}
            isLoading={loading}
            className="w-full"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
