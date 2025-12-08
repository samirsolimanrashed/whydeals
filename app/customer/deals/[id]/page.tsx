'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ReviewForm } from '@/components/ReviewForm'
import { GiftIcon } from '@heroicons/react/24/outline'
import { useCart } from '@/context/CartContext'
import { CountdownTimer } from '@/components/CountdownTimer'
import { toast } from 'sonner'

interface Deal {
  id: string
  title: string
  description: string
  price: number
  originalPrice: number
  image?: string
  inventory: number
  sold: number
  startAt?: string
  endAt?: string
  providerId?: string
  category?: string
  discountPrice?: number
}

export default function DealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dealId = params.id as string
  const { data: session } = useSession()
  const { addItem } = useCart()
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
          if (!data.deal || !data.deal.id) {
            // Handle case where API returns { deal: ... } or just ...
            // My API returns { deal: ... }
            if (data.id) {
              setDeal(data)
            } else {
              throw new Error('Invalid deal data')
            }
          } else {
            setDeal(data.deal)
          }
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

  const handleAddToCart = () => {
    if (!deal) return
    addItem({
      id: deal.id,
      title: deal.title,
      price: deal.price || deal.discountPrice || 0, // Handle different field names if necessary
      image: deal.image,
      quantity: quantity,
      maxQuantity: deal.inventory - deal.sold,
      providerId: deal.providerId || '',
    })
    toast.success('Added to cart!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    router.push('/cart')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-neutral-600 dark:text-neutral-400">Loading deal...</p>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground mb-4">Deal not found</h2>
          <Button onClick={() => router.push('/marketplace')}>Back to Deals</Button>
        </div>
      </div>
    )
  }

  const available = deal.inventory - deal.sold
  const soldPercentage = (deal.sold / deal.inventory) * 100
  const currentPrice = deal.price || (deal as any).discountPrice // Fallback if API uses different name
  const originalPrice = deal.originalPrice || (deal as any).originalPrice

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push('/marketplace')}
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
              <div className="w-full aspect-square bg-gradient-to-br from-primary-blue/20 to-violet-accent/20 rounded-lg flex items-center justify-center mb-4">
                <div className="w-full h-full flex items-center justify-center">
                  <GiftIcon className="w-24 h-24 text-neutral-400" />
                </div>
              </div>
            )}
            {deal.category && (
              <div className="inline-block px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-semibold">
                {deal.category}
              </div>
            )}
          </Card>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-2">{deal.title}</h1>
              <p className="text-foreground/70 mb-4">{deal.description}</p>

              <div className="flex items-baseline gap-4 mb-4">
                <p className="text-4xl font-bold text-primary-blue">
                  ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : '0.00'}
                </p>
                {originalPrice && (
                  <p className="text-xl text-foreground/70 line-through">
                    ${typeof originalPrice === 'number' ? originalPrice.toFixed(2) : '0.00'}
                  </p>
                )}
              </div>

              {/* Countdown */}
              {(deal.endAt || (deal as any).endTime) && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-foreground/70 mb-2">Offer Ends In:</p>
                  <CountdownTimer endTime={deal.endAt || (deal as any).endTime} />
                </div>
              )}
            </div>

            {/* Stock Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-navy-dark dark:text-foreground mb-3">Availability</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-foreground/70">Remaining: {available} of {deal.inventory}</span>
                    <span className="text-foreground/70">{Math.round(soldPercentage)}% sold</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-blue to-violet-accent h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
                {available <= 5 && available > 0 && (
                  <p className="text-warning-orange font-semibold">⚠️ Only {available} left!</p>
                )}
                {available === 0 && (
                  <p className="text-error-red font-semibold">❌ Sold Out</p>
                )}
              </div>
            </Card>

            {/* Quantity Selector */}
            {available > 0 && (
              <Card className="p-6">
                <label className="block text-sm font-semibold text-navy-dark dark:text-foreground mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-navy-dark dark:text-foreground"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={available}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center border border-neutral-200 dark:border-neutral-600 rounded-lg px-3 py-2 font-semibold bg-transparent text-navy-dark dark:text-foreground"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(available, quantity + 1))}
                    className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold text-navy-dark dark:text-foreground"
                  >
                    +
                  </button>
                </div>
              </Card>
            )}

            {/* CTA Buttons */}
            <div className="space-y-3">
              {available > 0 ? (
                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleBuyNow}
                    className="flex-1"
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/marketplace')}
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
