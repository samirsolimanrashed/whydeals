'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CreditCardIcon, DocumentTextIcon, ShoppingBagIcon, BellIcon, HeartIcon } from '@heroicons/react/24/outline'
import { DealCard } from '@/components/DealCard'
import { toast } from 'sonner'
import Link from 'next/link'

type TabType = 'orders' | 'favorites' | 'notifications'

interface Favorite {
  id: string
  createdAt: string
  deal: {
    id: string
    title: string
    description: string
    originalPrice: number
    discountPrice: number
    category: string | null
    imageUrl: string | null
    endTime: string
    sold: number
    inventory: number
    seller: {
      businessName: string
      logo: string | null
      rating: number
    }
  }
}

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('orders')
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (activeTab === 'favorites' && session) {
      fetchFavorites()
    }
  }, [activeTab, session])

  const fetchFavorites = async () => {
    setIsLoadingFavorites(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      } else {
        toast.error('Failed to load favorites')
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error('Failed to load favorites')
    } finally {
      setIsLoadingFavorites(false)
    }
  }

  const handleRemoveFavorite = (favoriteId: string) => {
    setFavorites(favorites.filter(f => f.id !== favoriteId))
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-neutral-100 dark:bg-navy-dark py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center text-2xl text-foreground font-bold">
            {session.user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">
              {session.user?.name || 'User'}
            </h1>
            <p className="text-foreground/70">
              {session.user?.email}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Wallet */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-navy-dark to-primary-blue text-foreground border-none">
              <p className="text-neutral-gray-light/80 text-sm font-medium">Wallet Balance</p>
              <h2 className="text-4xl font-bold mt-2">$0.00</h2>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Link href="/coming-soon" className="block">
                  <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-blue transition-colors cursor-pointer text-center flex flex-col items-center">
                    <CreditCardIcon className="w-8 h-8 text-primary-blue mb-2" />
                    <span className="font-medium text-navy-dark dark:text-foreground">Wallet</span>
                  </div>
                </Link>
                <Link href="/coming-soon" className="block">
                  <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-blue transition-colors cursor-pointer text-center flex flex-col items-center">
                    <DocumentTextIcon className="w-8 h-8 text-primary-blue mb-2" />
                    <span className="font-medium text-navy-dark dark:text-foreground">History</span>
                  </div>
                </Link>
              </div>
            </Card>

            <Card className="p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'orders'
                    ? 'bg-primary-blue/10 text-primary-blue'
                    : 'text-foreground/70 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  <ShoppingBagIcon className="w-5 h-5" />
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'favorites'
                    ? 'bg-primary-blue/10 text-primary-blue'
                    : 'text-foreground/70 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  <HeartIcon className="w-5 h-5" />
                  Favorites
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-3 ${activeTab === 'notifications'
                    ? 'bg-primary-blue/10 text-primary-blue'
                    : 'text-foreground/70 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  <BellIcon className="w-5 h-5" />
                  Notifications
                </button>
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <>
                <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">My Orders</h2>
                <Card className="p-6">
                  <div className="text-center py-12 flex flex-col items-center">
                    <ShoppingBagIcon className="w-16 h-16 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-foreground mb-2">
                      No orders yet
                    </h3>
                    <p className="text-foreground/70 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Button variant="primary" onClick={() => router.push('/')}>
                      Browse Deals
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <>
                <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">
                  My Favorites ({favorites.length})
                </h2>

                {isLoadingFavorites ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
                  </div>
                ) : favorites.length === 0 ? (
                  <Card className="p-6">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-lg font-semibold text-navy-dark dark:text-foreground mb-2">
                        No favorites yet
                      </h3>
                      <p className="text-foreground/70 mb-6">
                        Save deals you love to find them easily later
                      </p>
                      <Button variant="primary" onClick={() => router.push('/')}>
                        Browse Deals
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((favorite) => (
                      <DealCard
                        key={favorite.id}
                        id={favorite.deal.id}
                        title={favorite.deal.title}
                        description={favorite.deal.description}
                        originalPrice={favorite.deal.originalPrice}
                        discountPrice={favorite.deal.discountPrice}
                        category={favorite.deal.category || undefined}
                        image={favorite.deal.imageUrl || undefined}
                        endTime={favorite.deal.endTime}
                        sold={favorite.deal.sold}
                        inventory={favorite.deal.inventory}
                        isFavorited={true}
                        favoriteId={favorite.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <>
                <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">Notifications</h2>
                <Card className="p-6">
                  <div className="text-center py-12 flex flex-col items-center">
                    <BellIcon className="w-16 h-16 text-neutral-400 mb-4" />
                    <h3 className="text-lg font-semibold text-navy-dark dark:text-foreground mb-2">
                      No notifications
                    </h3>
                    <p className="text-foreground/70">
                      You're all caught up!
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
