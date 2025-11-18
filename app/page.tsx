'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function HomePage() {
  const mockDeals = [
    {
      id: '1',
      title: 'Premium Coffee Maker',
      description: 'High-end espresso machine with built-in grinder',
      price: 299.99,
      image: '☕',
      category: 'Electronics',
      inventory: 50,
      sold: 12,
      endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Wireless Headphones',
      description: 'Noise-canceling Bluetooth headphones with 30hr battery',
      price: 149.99,
      image: '🎧',
      category: 'Electronics',
      inventory: 100,
      sold: 45,
      endAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      title: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat with carrying strap',
      price: 49.99,
      image: '🧘',
      category: 'Wellness',
      inventory: 200,
      sold: 85,
      endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-neutral-900 mb-4">
            Amazing Deals, Limited Time
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Discover exclusive offers from trusted merchants
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/customer/deals">
              <Button variant="primary" size="lg">
                Browse All Deals
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDeals.map(deal => {
              const remaining = deal.inventory - deal.sold
              const soldPercent = (deal.sold / deal.inventory) * 100

              return (
                <Link key={deal.id} href={`/customer/deals/${deal.id}`}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="text-6xl mb-4">{deal.image}</div>
                    <div className="mb-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                      {deal.category}
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      {deal.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {deal.description}
                    </p>
                    <p className="text-2xl font-bold text-blue-600 mb-4">
                      ${deal.price.toFixed(2)}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>{deal.sold} sold</span>
                        <span>{remaining} left</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.min(soldPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="primary" size="md" className="w-full">
                      View Deal
                    </Button>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-blue-100 mb-8">Create an account now and get access to exclusive deals</p>
          <Link href="/auth/signup">
            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-neutral-100">
              Sign Up Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
