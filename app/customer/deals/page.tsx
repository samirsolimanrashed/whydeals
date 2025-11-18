'use client'

import { useState, useEffect } from 'react'
import DealCard from '@/components/DealCard'
import { Button } from '@/components/ui/Button'

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
  category?: string
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals')
        const data = await response.json()
        setDeals(Array.isArray(data) ? data : data.deals || [])
      } catch (error) {
        console.error('Failed to fetch deals:', error)
        setDeals([])
      } finally {
        setLoading(false)
      }
    }
    fetchDeals()
  }, [])

  const categories = ['All', ...Array.from(new Set(deals.map(d => d.category || '').filter(Boolean)))]
  const filteredDeals = selectedCategory && selectedCategory !== 'All'
    ? deals.filter(d => (d.category || '') === selectedCategory)
    : deals

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">Amazing Deals</h1>
          <p className="text-neutral-600">Discover and grab exclusive deals before they're gone</p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          </div>
        )}

        {/* Deals Grid */}
        {!loading && filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map(deal => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <p className="text-neutral-600 mb-4">No deals found</p>
            <Button onClick={() => setSelectedCategory('All')}>Clear filters</Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
