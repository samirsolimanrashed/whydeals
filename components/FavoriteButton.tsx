'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface FavoriteButtonProps {
    dealId: string
    initialFavorited?: boolean
    favoriteId?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function FavoriteButton({
    dealId,
    initialFavorited = false,
    favoriteId,
    size = 'md',
    className = '',
}: FavoriteButtonProps) {
    const { data: session } = useSession()
    const router = useRouter()
    const [isFavorited, setIsFavorited] = useState(initialFavorited)
    const [currentFavoriteId, setCurrentFavoriteId] = useState(favoriteId)
    const [isLoading, setIsLoading] = useState(false)

    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-10 h-10',
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!session) {
            router.push('/auth/signin')
            return
        }

        setIsLoading(true)

        try {
            if (isFavorited && currentFavoriteId) {
                // Remove from favorites
                const response = await fetch(`/api/favorites/${currentFavoriteId}`, {
                    method: 'DELETE',
                })

                if (response.ok) {
                    setIsFavorited(false)
                    setCurrentFavoriteId(undefined)
                } else {
                    const data = await response.json()
                    console.error('Failed to remove favorite:', data.error)
                }
            } else {
                // Add to favorites
                const response = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ dealId }),
                })

                if (response.ok) {
                    const data = await response.json()
                    setIsFavorited(true)
                    setCurrentFavoriteId(data.favorite.id)
                } else {
                    const data = await response.json()
                    console.error('Failed to add favorite:', data.error)
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-full
        bg-surface dark:bg-navy-dark/90 dark:bg-gray-800/90
        backdrop-blur-sm
        border border-gray-200 dark:border-gray-700
        hover:bg-surface dark:bg-navy-dark dark:hover:bg-gray-800
        hover:scale-110
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            {isLoading ? (
                <svg
                    className={`${iconSizes[size]} animate-spin text-gray-400`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    ></circle>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                </svg>
            ) : isFavorited ? (
                <svg
                    className={`${iconSizes[size]} text-red-500`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    className={`${iconSizes[size]} text-gray-400 dark:text-gray-500`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            )}
        </button>
    )
}
