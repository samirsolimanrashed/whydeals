'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CountdownTimer } from '@/components/CountdownTimer'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { ReviewForm } from '@/components/ReviewForm'
import { useCart } from '@/context/CartContext'
import { GiftIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Review {
    id: string
    rating: number
    comment: string
    user: {
        name: string | null
        avatar: string | null
    }
    createdAt: string
}

interface Deal {
    id: string
    title: string
    description: string
    originalPrice: number
    discountPrice: number
    category: string | null
    image: string | null
    imageUrl: string | null
    startTime: string
    endTime: string
    inventory: number
    sold: number
    seller: {
        user: {
            name: string | null
            email: string | null
            avatar: string | null
        }
    }
    reviews: Review[]
}

export default function DealPage() {
    const params = useParams()
    const [deal, setDeal] = useState<Deal | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [quantity, setQuantity] = useState(1)
    const { data: session } = useSession()
    const { addItem } = useCart()
    const router = useRouter()

    const handleReviewSubmitted = () => {
        if (deal) {
            fetchDeal(deal.id)
        }
    }

    const handleAddToCart = () => {
        if (!deal) return
        addItem({
            id: deal.id,
            title: deal.title,
            price: deal.discountPrice || deal.originalPrice,
            image: deal.image || undefined,
            quantity: quantity,
            maxQuantity: deal.inventory - deal.sold,
            providerId: deal.seller?.user?.name || '', // Using seller name as ID fallback or empty string if needed
        })
        toast.success('Added to cart!')
    }

    const handleBuyNow = () => {
        handleAddToCart()
        router.push('/cart')
    }

    useEffect(() => {
        if (params.id) {
            fetchDeal(params.id as string)
        }
    }, [params.id])

    async function fetchDeal(id: string) {
        try {
            const response = await fetch(`/api/deals/${id}`)
            if (!response.ok) throw new Error('Deal not found')
            const data = await response.json()
            setDeal(data.deal)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
        )
    }

    if (error || !deal) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-error-red">Error</h1>
                <p>{error || 'Deal not found'}</p>
                <Link href="/marketplace">
                    <Button variant="primary">Back to Marketplace</Button>
                </Link>
            </div>
        )
    }

    const discountPercent = Math.round(((deal.originalPrice - deal.discountPrice) / deal.originalPrice) * 100)
    const stockPercent = deal.inventory > 0 ? (deal.sold / deal.inventory) * 100 : 0

    return (
        <div className="min-h-screen bg-background py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6 text-sm text-foreground/70">
                    <Link href="/" className="hover:text-primary-blue">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/marketplace" className="hover:text-primary-blue">Marketplace</Link>
                    <span className="mx-2">/</span>
                    <span className="text-neutral-black dark:text-foreground font-medium">{deal.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div className="bg-surface rounded-2xl overflow-hidden shadow-sm p-2">
                            <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden relative">
                                {(deal.imageUrl || deal.image) ? (
                                    <img
                                        src={deal.imageUrl || deal.image || ''}
                                        alt={deal.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl">
                                        <div className="w-full h-full flex items-center justify-center">
                                            <GiftIcon className="w-24 h-24 text-neutral-400" />
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-primary-blue text-foreground px-3 py-1 rounded-full text-sm font-bold">
                                    {deal.category || 'General'}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-4 text-neutral-black dark:text-foreground">About this Deal</h2>
                            <div className="prose max-w-none text-foreground/70">
                                <p>{deal.description}</p>
                            </div>
                        </Card>



                        // ... (existing loading/error checks)

                        // ... (existing render)

                        {/* Reviews */}
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neutral-black dark:text-foreground">
                                    Reviews ({deal.reviews.length})
                                </h2>
                            </div>

                            {session?.user && (
                                <div className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
                                    <h3 className="text-lg font-semibold mb-4 text-neutral-black dark:text-foreground">Write a Review</h3>
                                    <ReviewForm dealId={deal.id} onReviewSubmitted={handleReviewSubmitted} />
                                </div>
                            )}

                            {deal.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {deal.reviews.map((review) => (
                                        <div key={review.id} className="border-b border-neutral-gray-light dark:border-neutral-700 last:border-0 pb-6 last:pb-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                                    {review.user.avatar ? (
                                                        <img src={review.user.avatar} alt={review.user.name || ''} className="w-full h-full rounded-full" />
                                                    ) : (
                                                        <span className="font-bold text-foreground/70">
                                                            {(review.user.name || 'U').charAt(0)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-neutral-black dark:text-foreground">{review.user.name || 'Anonymous'}</p>
                                                    <div className="flex text-yellow-400 text-sm">
                                                        {'★'.repeat(review.rating)}
                                                        <span className="text-neutral-gray-light">{'★'.repeat(5 - review.rating)}</span>
                                                    </div>
                                                </div>
                                                <span className="ml-auto text-sm text-foreground/60">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-foreground/70">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-foreground/70">No reviews yet.</p>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Purchase Card */}
                        <Card className="p-6 sticky top-24">
                            <h1 className="text-2xl font-bold text-neutral-black dark:text-foreground mb-2">{deal.title}</h1>

                            <div className="flex items-baseline gap-3 mb-6">
                                <span className="text-4xl font-bold text-primary-blue">${deal.discountPrice}</span>
                                <span className="text-xl text-foreground/60 line-through">${deal.originalPrice}</span>
                                <span className="bg-error-red/10 text-error-red px-2 py-1 rounded text-sm font-bold">
                                    -{discountPercent}% OFF
                                </span>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-foreground/70">Hurry! Ends in:</span>
                                </div>
                                <CountdownTimer endTime={deal.endTime} className="justify-center bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg" />
                            </div>

                            {deal.inventory > 0 && (
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-foreground/70">Availability</span>
                                        <span className="font-bold text-neutral-black dark:text-foreground">{deal.inventory - deal.sold} left</span>
                                    </div>
                                    <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-success-green transition-all duration-500"
                                            style={{ width: `${stockPercent}%` }}
                                        />
                                    </div>

                                    {/* Quantity Selector */}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-foreground/70">Quantity</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold w-8 text-center">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(Math.min(deal.inventory - deal.sold, quantity + 1))}
                                                className="w-8 h-8 rounded-md border border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3">
                                <Button variant="primary" className="w-full py-4 text-lg" onClick={handleBuyNow}>
                                    Buy Now
                                </Button>
                                <Button variant="outline" className="w-full" onClick={handleAddToCart}>
                                    Add to Cart
                                </Button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-neutral-gray-light dark:border-neutral-700">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                        {deal.seller?.user?.avatar ? (
                                            <img src={deal.seller.user.avatar} alt="" className="w-full h-full rounded-full" />
                                        ) : (
                                            <span className="font-bold text-xl text-foreground/70">
                                                {(deal.seller?.user?.name || 'S').charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-foreground/70">Sold by</p>
                                        <p className="font-bold text-neutral-black dark:text-foreground">{deal.seller?.user?.name || 'Seller'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
