'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { getMockDeals } from '@/lib/mockData'

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const dealId = searchParams.get('dealId')
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe')
  const [isProcessing, setIsProcessing] = useState(false)

  const deals = getMockDeals()
  const deal = dealId ? deals.find(d => d.id === dealId) : null

  useEffect(() => {
    if (!dealId || !deal) {
      router.push('/')
    }
  }, [dealId, deal, router])

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Deal Not Found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const subtotal = deal.discountPrice * quantity
  const platformFee = subtotal * 0.05 // 5% platform fee
  const total = subtotal + platformFee

  const handleCheckout = async () => {
    setIsProcessing(true)
    
    try {
      if (paymentMethod === 'stripe') {
        // Create Stripe checkout session
        const response = await fetch('/api/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dealId: deal.id,
            quantity,
            userId: 'user-1', // TODO: Get from session/auth
          }),
        })

        const data = await response.json()
        
        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        } else {
          throw new Error('Failed to create checkout session')
        }
      } else if (paymentMethod === 'paypal') {
        // TODO: Implement PayPal checkout
        alert('PayPal integration coming soon!')
        setIsProcessing(false)
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert('Payment processing failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
            
            <div className="flex gap-4 mb-6">
              {deal.imageUrl && (
                <img
                  src={deal.imageUrl}
                  alt={deal.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{deal.title}</h3>
                <p className="text-gray-600 text-sm">{deal.provider?.businessName}</p>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={deal.maxPurchases ? quantity >= deal.maxPurchases - deal.currentPurchases : false}
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === 'stripe'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold">Credit/Debit Card (Stripe)</div>
                  <div className="text-sm text-gray-600">Secure payment via Stripe</div>
                </div>
                <div className="text-2xl">💳</div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-semibold">PayPal</div>
                  <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                </div>
                <div className="text-2xl">🅿️</div>
              </label>
            </div>

            {paymentMethod === 'stripe' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Stripe integration placeholder. In production, this would 
                  connect to Stripe Checkout or Elements for secure card processing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee (5%)</span>
                <span className="font-semibold">${platformFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-blue-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              🔒 Secure payment processing
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

