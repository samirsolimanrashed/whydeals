'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DealCard } from '@/components/DealCard'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import DiscountBanner from '@/components/DiscountBanner'
import {
  CommandLineIcon,
  PaintBrushIcon,
  MegaphoneIcon,
  BoltIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  TagIcon,
  FireIcon
} from '@heroicons/react/24/outline'

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const [featuredDeals, setFeaturedDeals] = useState<any[]>([])
  const [recentDeals, setRecentDeals] = useState<any[]>([])

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Fetch Featured Deals
        const featuredRes = await fetch('/api/deals?featured=true&limit=6')
        const featuredData = await featuredRes.json()
        setFeaturedDeals(featuredData.deals || [])

        // Fetch Recent Deals
        const recentRes = await fetch('/api/deals?sort=newest&limit=4')
        const recentData = await recentRes.json()
        setRecentDeals(recentData.deals || [])
      } catch (error) {
        console.error('Failed to fetch deals:', error)
      }
    }

    fetchDeals()
  }, [])

  const popularCategories = ['Software', 'Design', 'Courses', 'E-books', 'Services']

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-primary-blue via-violet-accent to-primary-blue dark:from-navy-dark dark:via-navy-medium dark:to-navy-dark text-foreground">
        {/* Discount Banner */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <DiscountBanner />
        </div>

        <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm text-foreground text-sm font-semibold mb-6 border border-white/30">
              <TagIcon className="w-4 h-4" />
              Your Marketplace for Real Savings
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-foreground drop-shadow-lg">
              <span className="block whitespace-nowrap">Deals That Make You Ask!</span>
              <span className="block text-primary-blue">Why Pay More?</span>
            </h1>
            <p className="text-xl text-foreground/90 mb-10 max-w-2xl mx-auto drop-shadow-md">Discover digital services, lifetime software offers , and nearby service providers to help you save more and get things done.</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for software, courses, or assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-navy-dark text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
              />
              <Button
                type="submit"
                variant="primary"
                className="absolute right-2 top-2 rounded-full px-6 bg-navy-dark hover:bg-navy-dark/90"
              >
                Search
              </Button>
            </form>
          </motion.div>

          {/* Category Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            <span className="text-foreground/80 text-sm font-medium self-center mr-2">Popular:</span>
            {popularCategories.map((cat) => (
              <Link key={cat} href={`/marketplace?category=${cat}`}>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-sm text-foreground transition-colors cursor-pointer border border-white/30">
                  {cat}
                </span>
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/marketplace">
              <Button variant="primary" size="lg" className="shadow-lg shadow-black/20">
                Browse All Deals
              </Button>
            </Link>
            <Link href="/seller/onboarding">
              <Button variant="outline" size="lg" className="border-white/40 text-foreground hover:bg-white/20 backdrop-blur-sm">
                Sell Your Product
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Featured Deals - Horizontal Scroll */}
      <section className="py-16 px-4 bg-background dark:bg-surface border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Featured Deals
                <FireIcon className="w-8 h-8 text-error-red" />
              </h2>
              <p className="text-foreground/60 mt-2">Hand-picked deals ending soon.</p>
            </div>
            <Link href="/marketplace">
              <Button variant="secondary" size="sm">View All</Button>
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {featuredDeals.length > 0 ? (
              featuredDeals.map((deal, index) => (
                <div key={`${deal.id}-featured-${index}`} className="min-w-[300px] md:min-w-[350px] snap-center">
                  <DealCard
                    id={deal.id}
                    title={deal.title}
                    description={deal.description}
                    originalPrice={deal.originalPrice}
                    discountPrice={deal.discountPrice}
                    category={deal.category}
                    image={deal.image}
                    imageUrl={deal.imageUrl}
                    endTime={deal.endTime}
                    sold={deal.sold}
                    inventory={deal.inventory}
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 text-foreground/60">
                No featured deals at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Additions - 4 Cards Grid */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">Recent Additions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentDeals.map((deal, index) => (
              <DealCard
                key={`${deal.id}-recent-${index}`}
                id={deal.id}
                title={deal.title}
                description={deal.description}
                originalPrice={deal.originalPrice}
                discountPrice={deal.discountPrice}
                category={deal.category}
                image={deal.image}
                imageUrl={deal.imageUrl}
                endTime={deal.endTime}
                sold={deal.sold}
                inventory={deal.inventory}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Improved Categories */}
      <section className="py-16 bg-background border-y border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Software', icon: CommandLineIcon },
              { name: 'Design', icon: PaintBrushIcon },
              { name: 'Marketing', icon: MegaphoneIcon },
              { name: 'Productivity', icon: BoltIcon },
              { name: 'Courses', icon: AcademicCapIcon },
              { name: 'Dev Tools', icon: WrenchScrewdriverIcon }
            ].map((cat) => (
              <Link key={cat.name} href={`/marketplace?category=${cat.name}`}>
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-primary-blue hover:shadow-md transition-all cursor-pointer text-center group bg-surface">
                  <div className="w-12 h-12 mx-auto bg-primary-blue/10 rounded-full flex items-center justify-center text-primary-blue mb-3 group-hover:bg-primary-blue group-hover:text-foreground transition-colors">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-foreground">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-r from-primary-blue to-violet-accent dark:from-navy-dark dark:to-primary-blue/20 text-foreground">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 drop-shadow-lg">
            Never Miss a Lifetime Deal
          </h2>
          <p className="text-foreground/90 mb-8 text-lg drop-shadow-md">
            Join 50,000+ founders getting the best deals delivered to their inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 rounded-lg border-none focus:ring-2 focus:ring-white/50 outline-none bg-white text-primary-blue"
            />
            <Button variant="primary" size="lg" className="shadow-lg">
              Subscribe
            </Button>
          </div>
          <p className="text-foreground/70 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  )
}
