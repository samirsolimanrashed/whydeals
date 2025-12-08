'use client'

import { useState, useEffect } from 'react'
import { DealCard } from '@/components/DealCard'
import { DealCardSkeleton } from '@/components/skeletons/DealCardSkeleton'
import { Button } from '@/components/ui/Button'
import { useSearchParams, useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, GiftIcon } from '@heroicons/react/24/outline'

const CATEGORIES = [
    'All',
    'Software',
    'Design',
    'Courses',
    'E-books',
    'Services',
    'Marketing',
    'Business',
]

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
]

interface Deal {
    id: string
    title: string
    description: string
    originalPrice: number
    discountPrice: number
    category: string | null
    image: string | null
    imageUrl: string | null
    endTime: string
    sold: number
    inventory: number
}

export default function MarketplacePage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const [deals, setDeals] = useState<Deal[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
    const [sortBy, setSortBy] = useState('newest')
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })

    useEffect(() => {
        fetchDeals()
    }, [selectedCategory, sortBy, searchQuery, page, priceRange.min, priceRange.max]) // Debounce might be needed for price, but for now simple effect

    // Update URL when filters change (optional but good for UX)
    useEffect(() => {
        const params = new URLSearchParams()
        if (selectedCategory !== 'All') params.set('category', selectedCategory)
        if (searchQuery) params.set('search', searchQuery)
        // router.push(`/marketplace?${params.toString()}`, { scroll: false })
    }, [selectedCategory, searchQuery])

    async function fetchDeals() {
        setLoading(true)
        try {
            const params = new URLSearchParams({
                category: selectedCategory === 'All' ? 'all' : selectedCategory,
                sort: sortBy,
                page: page.toString(),
                limit: '12',
            })

            if (searchQuery) params.append('search', searchQuery)
            if (priceRange.min) params.append('minPrice', priceRange.min)
            if (priceRange.max) params.append('maxPrice', priceRange.max)

            const response = await fetch(`/api/deals?${params}`)
            const data = await response.json()

            setDeals(data.deals || [])
            setTotalPages(data.pagination?.totalPages || 1)
        } catch (error) {
            console.error('Error fetching deals:', error)
        } finally {
            setLoading(false)
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        setPage(1)
        fetchDeals()
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-foreground">
                        Discover Amazing Deals
                    </h1>
                    <p className="text-lg text-foreground/60">
                        Browse our curated selection of premium products at unbeatable prices
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Search for deals..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-6 py-4 rounded-lg border-2 border-neutral-200 dark:border-neutral-600 focus:border-primary-blue outline-none text-lg bg-surface text-foreground"
                        />
                        <Button type="submit" variant="primary" size="lg" className="px-8 flex items-center gap-2">
                            <MagnifyingGlassIcon className="w-5 h-5" />
                            Search
                        </Button>
                    </div>
                </form>

                {/* Filters & Controls */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8">
                    {/* Left: Filters */}
                    <div className="lg:w-1/4 space-y-6">
                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-foreground mb-3">Categories</h3>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category)
                                            setPage(1)
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                            ? 'bg-primary-blue text-foreground'
                                            : 'bg-surface text-foreground/70 border border-neutral-200 dark:border-neutral-600 hover:border-primary-blue'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-bold text-foreground mb-3">Price Range</h3>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-600 bg-surface text-foreground"
                                />
                                <span className="text-neutral-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full px-3 py-2 rounded border border-neutral-200 dark:border-neutral-600 bg-surface text-foreground"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Results */}
                    <div className="lg:w-3/4">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-6 bg-surface p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <p className="text-sm text-foreground/60">
                                {loading ? 'Loading...' : `${deals.length} deals found`}
                            </p>

                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-surface shadow text-primary-blue' : 'text-neutral-400'}`}
                                        title="Grid View"
                                    >
                                        ⊞
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-surface shadow text-primary-blue' : 'text-neutral-400'}`}
                                        title="List View"
                                    >
                                        ≣
                                    </button>
                                </div>

                                {/* Sort */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => {
                                        setSortBy(e.target.value)
                                        setPage(1)
                                    }}
                                    className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-600 outline-none font-medium bg-surface text-foreground"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Deals Grid/List */}
                        {loading ? (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                {[...Array(6)].map((_, i) => (
                                    <DealCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : deals.length === 0 ? (
                            <div className="text-center py-20 flex flex-col items-center">
                                <MagnifyingGlassIcon className="w-16 h-16 text-neutral-400 mb-4" />
                                <h3 className="text-2xl font-bold mb-2 text-foreground">
                                    No deals found
                                </h3>
                                <p className="text-foreground/60">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        ) : (
                            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                                {deals.map((deal) => (
                                    viewMode === 'grid' ? (
                                        <DealCard
                                            key={deal.id}
                                            id={deal.id}
                                            title={deal.title}
                                            description={deal.description}
                                            originalPrice={deal.originalPrice}
                                            discountPrice={deal.discountPrice}
                                            category={deal.category || undefined}
                                            image={deal.image || undefined}
                                            imageUrl={deal.imageUrl || undefined}
                                            endTime={deal.endTime}
                                            sold={deal.sold}
                                            inventory={deal.inventory}
                                        />
                                    ) : (
                                        // List View Item
                                        <div key={deal.id} className="flex gap-6 bg-surface border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:shadow-lg transition-all">
                                            <div className="w-48 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                                                {(deal.image || deal.imageUrl) ? (
                                                    <img src={deal.image || deal.imageUrl || ''} alt={deal.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <GiftIcon className="w-12 h-12 text-neutral-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="text-xl font-bold text-foreground mb-2">{deal.title}</h3>
                                                        <span className="text-primary-blue font-bold text-xl">${deal.discountPrice.toFixed(2)}</span>
                                                    </div>
                                                    <p className="text-foreground/60 line-clamp-2 mb-2">{deal.description}</p>
                                                    {deal.category && (
                                                        <span className="text-xs font-semibold bg-primary-blue/10 text-primary-blue px-2 py-1 rounded-full">
                                                            {deal.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex justify-end mt-4">
                                                    <Button variant="primary" size="sm" onClick={() => router.push(`/customer/deals/${deal.id}`)}>
                                                        View Deal
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i + 1}
                                        variant={page === i + 1 ? 'primary' : 'outline'}
                                        onClick={() => setPage(i + 1)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
