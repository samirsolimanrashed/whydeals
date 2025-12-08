'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { CountdownTimer } from './CountdownTimer'
import FavoriteButton from './FavoriteButton'
import { GiftIcon } from '@heroicons/react/24/outline'

interface DealCardProps {
  id: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  category?: string
  image?: string
  imageUrl?: string
  endTime: Date | string
  sold?: number
  inventory?: number
  isFavorited?: boolean
  favoriteId?: string
}

export function DealCard({
  id,
  title,
  description,
  originalPrice,
  discountPrice,
  category,
  image,
  imageUrl,
  endTime,
  sold = 0,
  inventory = 0,
  isFavorited = false,
  favoriteId,
}: DealCardProps) {
  const discountPercent = Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
  const stockPercent = inventory > 0 ? (sold / inventory) * 100 : 0

  return (
    <Link href={`/deals/${id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          {(image || imageUrl) ? (
            <Image
              src={image || imageUrl || ''}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <GiftIcon className="w-16 h-16" />
            </div>
          )}

          {/* Discount Badge */}
          <div className="absolute top-3 right-3 text-foreground px-3 py-1 rounded-full font-bold text-sm shadow-lg bg-error-red">
            -{discountPercent}%
          </div>

          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 left-3 text-foreground px-3 py-1 rounded-full text-xs font-semibold bg-primary-blue">
              {category}
            </div>
          )}

          {/* Favorite Button */}
          <div className="absolute bottom-3 right-3">
            <FavoriteButton
              dealId={id}
              initialFavorited={isFavorited}
              favoriteId={favoriteId}
              size="md"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-blue transition-colors text-foreground">
            {title}
          </h3>

          <p className="text-sm mb-4 line-clamp-2 text-foreground/60">
            {description}
          </p>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-primary-blue">
              ${discountPrice.toFixed(2)}
            </span>
            <span className="text-sm line-through text-foreground/50">
              ${originalPrice.toFixed(2)}
            </span>
          </div>

          {/* Stock Progress */}
          {inventory > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1 text-foreground/60">
                <span>{sold} sold</span>
                <span>{inventory - sold} left</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                <div
                  className={`h-full rounded-full transition-all ${stockPercent > 80 ? 'bg-error-red' : 'bg-primary-blue'}`}
                  style={{
                    width: `${stockPercent}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          <div className="mt-auto">
            <div className="text-xs font-semibold mb-2 text-foreground/60">
              Ends in:
            </div>
            <CountdownTimer endTime={endTime} className="justify-center" />
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 pt-0">
          <Button variant="primary" size="md" className="w-full">
            View Deal
          </Button>
        </div>
      </Card>
    </Link>
  )
}
