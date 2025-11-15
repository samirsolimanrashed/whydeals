'use client'

import { useState, useMemo } from 'react'
import DealCard from '@/components/DealCard'
import { getMockDeals } from '@/lib/mockData'
import { categories, sortOptions, type SortOption } from '@/lib/categories'
import type { MockDeal } from '@/lib/mockData'

export default function HomePage() {
  const allDeals = getMockDeals()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('time-left')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAndSortedDeals = useMemo(() => {
    let filtered = allDeals

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(deal => deal.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(deal =>
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.provider?.businessName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort deals
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'time-left':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
        case 'price-low':
          return a.discountPrice - b.discountPrice
        case 'price-high':
          return b.discountPrice - a.discountPrice
        case 'popularity':
          return (b.views || 0) - (a.views || 0)
        case 'discount':
          return b.discountPercent - a.discountPercent
        default:
          return 0
      }
    })

    // Show sponsored deals first
    return sorted.sort((a, b) => {
      if (a.isSponsored && !b.isSponsored) return -1
      if (!a.isSponsored && b.isSponsored) return 1
      return 0
    })
  }, [selectedCategory, sortBy, searchQuery, allDeals])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Featured Deals</h1>
        <p className="text-gray-600">Discover amazing deals from local providers</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search deals, providers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters and Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Category Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug === 'all' ? 'all' : cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedDeals.length} of {allDeals.length} deals
      </div>

      {/* Deals Grid */}
      {filteredAndSortedDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No deals found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}
