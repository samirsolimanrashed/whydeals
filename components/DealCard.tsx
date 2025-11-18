'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from './ui/Button'

interface DealCardProps {
  deal: {
    id: string
    title: string
    description: string
    price: number
    image?: string
    category?: string
    inventory: number
    sold: number
    endAt?: string
  }
}

export default function DealCard({ deal }: DealCardProps) {
  const remainingInventory = deal.inventory - deal.sold
  const soldPercentage = deal.inventory > 0 ? (deal.sold / deal.inventory) * 100 : 0
  const isLowStock = remainingInventory < 5
  const isSoldOut = remainingInventory <= 0

  return (
    <Link href={`/customer/deals/${deal.id}`}>
      <div className="bg-white rounded-xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
        {/* Image Section */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden group">
          {deal.image ? (
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-300 text-6xl">
              🎁
            </div>
          )}
          
          {/* Category Badge */}
          {deal.category && (
            <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {deal.category}
            </div>
          )}

          {/* Stock Status */}
          <div className="absolute top-3 right-3">
            {isSoldOut ? (
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                SOLD OUT
              </div>
            ) : isLowStock ? (
              <div className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                LOW STOCK
              </div>
            ) : null}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col h-full">
          {/* Title */}
          <h3 className="font-bold text-lg text-neutral-900 mb-2 line-clamp-2">
            {deal.title}
          </h3>

          {/* Description */}
          <p className="text-neutral-600 text-sm mb-3 line-clamp-2 flex-grow">
            {deal.description}
          </p>

          {/* Price */}
          <div className="mb-3">
            <p className="text-2xl font-bold text-blue-600">
              ${typeof deal.price === 'number' ? deal.price.toFixed(2) : '0.00'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-neutral-500 mb-1">
              <span>{deal.sold} sold</span>
              <span>{remainingInventory} left</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                style={{ width: `${Math.min(soldPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Time Left */}
          {deal.endAt && (
            <p className="text-xs text-neutral-500 mb-3">
              ⏱️ Ends {new Date(deal.endAt).toLocaleDateString()}
            </p>
          )}

          {/* CTA Button */}
          <Button
            variant={isSoldOut ? 'secondary' : 'primary'}
            size="md"
            className="w-full"
            disabled={isSoldOut}
          >
            {isSoldOut ? 'Sold Out' : 'View Deal'}
          </Button>
        </div>
      </div>
    </Link>
  )
}

