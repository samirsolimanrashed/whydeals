'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { GiftIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useCart } from '@/context/CartContext'
import { loadStripe } from '@stripe/stripe-js'
import { TwoCheckoutForm } from '@/components/checkout/TwoCheckoutForm'

// Make sure to set this environment variable in your .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const { items, cartTotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [deal, setDeal] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | '2CHECKOUT'>('STRIPE')

  const dealId = searchParams.get('dealId')

  useEffect(() => {
    if (dealId) {
      fetchDeal(dealId)
    }
  }, [dealId])

  const fetchDeal = async (id: string) => {
    try {
      const res = await fetch(`/api/deals/${id}`)
      if (!res.ok) throw new Error('Failed to fetch deal')
      const data = await res.json()
      setDeal(data.deal)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load deal details')
    }
  }

  const handleCheckout = async () => {
    if (!session) {
      toast.error('Please sign in to continue')
      return
    }

    try {
      setLoading(true)

      if (dealId && deal) {
        // Single Deal Checkout
        await processCheckout(deal.id, 1)
      } else if (items.length > 0) {
        // Cart Checkout - Process each item sequentially for now (Mock)
        // In real Stripe, we'd create a session with line_items
        for (const item of items) {
          await processCheckout(item.id, item.quantity)
        }
        clearCart()
      }

      window.location.href = `/customer/checkout/success?session_id=mock_cart_${Date.now()}`
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Checkout failed')
      setLoading(false)
    }
  }

  const processCheckout = async (dealId: string, quantity: number) => {
    const res = await fetch('/api/mock-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dealId,
        userId: session?.user?.id,
        quantity,
      }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.error || 'Failed to process checkout')
    }
  }

  const isCartCheckout = !dealId && items.length > 0
  const totalAmount = dealId && deal ? (deal.discountPrice || deal.price) : cartTotal

  if (!dealId && items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-center">
        <p className="text-foreground/70">Your cart is empty.</p>
      </div>
    )
  }

  if (dealId && !deal) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-center">
        <p className="text-foreground/70">Loading deal details...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6 dark:bg-navy-dark dark:border-neutral-700">
              <h2 className="text-xl font-bold text-navy-dark dark:text-foreground mb-4">Order Summary</h2>

              {dealId && deal ? (
                <div className="flex gap-4 mb-4">
                  {deal.imageUrl && (
                    <img src={deal.imageUrl} alt={deal.title} className="w-24 h-24 object-cover rounded-lg" />
                  )}
                  <div>
                    <h3 className="font-bold text-navy-dark dark:text-foreground">{deal.title}</h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">{deal.description}</p>
                    <p className="text-primary-blue font-bold mt-1">${deal.discountPrice || deal.price}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-2xl">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                        ) : (
                          <GiftIcon className="w-8 h-8 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-dark dark:text-foreground text-sm">{item.title}</h3>
                        <p className="text-foreground/70 text-xs">Qty: {item.quantity}</p>
                        <p className="text-primary-blue font-bold text-sm">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <div className="flex justify-between text-foreground/70">
                  <span>Subtotal</span>
                  <span>${(dealId && deal ? (deal.discountPrice || deal.price) : cartTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-navy-dark dark:text-foreground pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Action */}
          <div className="space-y-6">
            <Card className="p-6 bg-navy-dark text-foreground border-none">
              <h2 className="text-xl font-bold mb-4">Complete Purchase</h2>

              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('STRIPE')}
                  className={`flex-1 p-3 rounded-lg border ${paymentMethod === 'STRIPE'
                    ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                    : 'border-neutral-600 text-neutral-400'
                    }`}
                >
                  Stripe (Test)
                </button>
                <button
                  onClick={() => setPaymentMethod('2CHECKOUT')}
                  className={`flex-1 p-3 rounded-lg border ${paymentMethod === '2CHECKOUT'
                    ? 'border-primary-blue bg-primary-blue/10 text-primary-blue'
                    : 'border-neutral-600 text-neutral-400'
                    }`}
                >
                  2Checkout
                </button>
              </div>

              {paymentMethod === 'STRIPE' ? (
                <>
                  <p className="text-neutral-gray-light/80 mb-6">
                    This is a <strong>Test Checkout</strong>. No actual payment will be processed.
                  </p>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-surface text-primary-blue hover:bg-neutral-100"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Simulate Payment ($${totalAmount.toFixed(2)})`}
                  </Button>

                  <p className="text-xs text-center text-neutral-gray-light/60 mt-4">
                    Test Mode Enabled
                  </p>
                </>
              ) : (
                <TwoCheckoutForm
                  amount={totalAmount}
                  loading={loading}
                  onSuccess={async (token, cardData) => {
                    setLoading(true);
                    try {
                      const payload: any = {
                        token,
                        cardData,
                        userId: session?.user?.id,
                        billingDetails: {
                          email: session?.user?.email,
                          name: session?.user?.name
                        }
                      };

                      if (dealId && deal) {
                        payload.dealId = deal.id;
                        payload.quantity = 1;
                      } else if (items.length > 0) {
                        payload.items = items.map(item => ({
                          dealId: item.id,
                          quantity: item.quantity
                        }));
                      }

                      const res = await fetch('/api/checkout/2checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });

                      if (!res.ok) {
                        const errorData = await res.json();
                        throw new Error(errorData.error || 'Payment failed');
                      }

                      const data = await res.json();

                      if (data.redirectUrl) {
                        window.location.href = data.redirectUrl;
                      } else {
                        if (!dealId) clearCart();
                        window.location.href = `/customer/checkout/success?session_id=${data.purchaseId}`;
                      }
                    } catch (err: any) {
                      console.error(err);
                      toast.error(err.message || 'Payment failed');
                      setLoading(false);
                    }
                  }}
                />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
