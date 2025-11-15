'use client'

import { useState } from 'react'
import Link from 'next/link'
import CountdownTimer from './CountdownTimer'

interface Deal {
  id: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  imageUrl?: string
  endDate: Date | string
  isSponsored?: boolean
  provider?: {
    businessName: string
    rating?: number
    totalRatings?: number
    logoUrl?: string
  }
}

interface DealCardProps {
  deal: Deal
}

export default function DealCard({ deal }: DealCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const discountPercent = Math.round(deal.discountPercent)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorited(!isFavorited)
    // TODO: Implement API call to save/unsave favorite
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>)
    }
    return stars
  }

  return (
    <Link href={`/customer/deals/${deal.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer relative">
        {/* Sponsored Badge */}
        {deal.isSponsored && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">
            SPONSORED
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
          aria-label="Add to favorites"
        >
          <svg
            className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {deal.imageUrl && (
          <div className="h-48 bg-gray-200 relative overflow-hidden">
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
              {discountPercent}% OFF
            </div>
          </div>
        )}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-800">{deal.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{deal.description}</p>
          
          {deal.provider && (
            <div className="flex items-center gap-2 mb-4">
              {deal.provider.logoUrl && (
                <img
                  src={deal.provider.logoUrl}
                  alt={deal.provider.businessName}
                  className="w-6 h-6 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{deal.provider.businessName}</p>
                {deal.provider.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">{renderStars(deal.provider.rating)}</div>
                    <span className="text-xs text-gray-600 ml-1">
                      {deal.provider.rating.toFixed(1)} ({deal.provider.totalRatings})
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl font-bold text-blue-600">${deal.discountPrice.toFixed(2)}</span>
            <span className="text-lg text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
          </div>

          <CountdownTimer endDate={deal.endDate} />
        </div>
      </div>
    </Link>
  )
}
