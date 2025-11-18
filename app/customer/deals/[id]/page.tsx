'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

interface Deal {
  id: string
  title: string
  description: string
  price: number
  image?: string
  inventory: number
  sold: number
  startAt?: string
  endAt?: string
  providerId?: string
  category?: string
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string
  const { data: session } = useSession()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (dealId) {
      const fetchDeal = async () => {
        try {
          const response = await fetch(`/api/deals/${dealId}`)
          if (!response.ok) throw new Error('Failed to fetch deal')
          const data = await response.json()
          
          // Validate that deal has required fields
          if (!data.id || !data.title || data.price === undefined) {
            throw new Error('Invalid deal data')
          }
          
          setDeal(data)
        } catch (error) {
          console.error('Failed to fetch deal:', error)
          setDeal(null)
        } finally {
          setLoading(false)
        }
      }
      fetchDeal()
    }
  }, [dealId])

  const handleCheckout = () => {
    if (!session?.user?.id) {
      router.push('/auth/signin')
      return
    }
    router.push(`/customer/checkout?dealId=${dealId}&quantity=${quantity}`)
  }

  if (loading) {
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
          <Button onClick={() => router.push('/customer/deals')}>Back to Deals</Button>
        </div>
      </div>
    )
  }

  const available = deal.inventory - deal.sold
  const soldPercentage = (deal.sold / deal.inventory) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/customer/deals')}
          className="mb-6"
        >
          ← Back to Deals
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <Card className="p-6 h-fit">
            {deal.image ? (
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-blue-200 to-cyan-200 rounded-lg flex items-center justify-center mb-4">
                <span className="text-neutral-600">No image</span>
              </div>
            )}
            {deal.category && (
              <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {deal.category}
              </div>
            )}
          </Card>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-neutral-900 mb-2">{deal.title}</h1>
              <p className="text-neutral-600 mb-4">{deal.description}</p>
              <p className="text-4xl font-bold text-blue-600">
                ${typeof deal.price === 'number' ? deal.price.toFixed(2) : '0.00'}
              </p>
            </div>

            {/* Stock Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-3">Availability</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-neutral-600">Remaining: {available} of {deal.inventory}</span>
                    <span className="text-neutral-600">{Math.round(soldPercentage)}% sold</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {available <= 5 && available > 0 && (
                  <p className="text-orange-600 font-semibold">⚠️ Only {available} left!</p>
                )}
                {available === 0 && (
                  <p className="text-red-600 font-semibold">❌ Sold Out</p>
                )}
              </div>
            </Card>

            {/* Quantity Selector */}
            {available > 0 && (
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
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              {available > 0 ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Share Deal
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/customer/deals')}
                  className="w-full"
                >
                  Sold Out - Browse More
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


