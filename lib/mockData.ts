export interface MockDeal {
  id: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  imageUrl?: string
  category?: string
  startDate: Date | string
  endDate: Date | string
  maxPurchases?: number
  currentPurchases: number
  isActive: boolean
  isSponsored?: boolean
  views?: number
  clicks?: number
  shares?: number
  provider?: {
    businessName: string
    id: string
    rating?: number
    totalRatings?: number
    logoUrl?: string
  }
}

export function getMockDeals(): MockDeal[] {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const nextWeek = new Date(now)
  nextWeek.setDate(nextWeek.getDate() + 7)
  
  const twoWeeks = new Date(now)
  twoWeeks.setDate(twoWeeks.getDate() + 14)

  return [
    {
      id: '1',
      title: '50% Off Premium Coffee Subscription',
      description: 'Get a month of premium coffee delivered to your door. Includes 4 bags of specialty coffee from around the world.',
      originalPrice: 79.99,
      discountPrice: 39.99,
      discountPercent: 50,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      category: 'Food & Beverage',
      startDate: now,
      endDate: nextWeek,
      maxPurchases: 100,
      currentPurchases: 23,
      isActive: true,
      isSponsored: true,
      views: 1245,
      clicks: 89,
      shares: 12,
      provider: {
        id: 'provider-1',
        businessName: 'Coffee Corner',
        rating: 4.8,
        totalRatings: 234,
        logoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100',
      },
    },
    {
      id: '2',
      title: 'Fitness Gym Membership - 3 Months',
      description: 'Full access to all gym facilities, group classes, and personal training sessions. No initiation fee!',
      originalPrice: 299.99,
      discountPrice: 149.99,
      discountPercent: 50,
      imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      category: 'Fitness',
      startDate: now,
      endDate: twoWeeks,
      maxPurchases: 50,
      currentPurchases: 12,
      isActive: true,
      isSponsored: false,
      views: 892,
      clicks: 67,
      shares: 8,
      provider: {
        id: 'provider-2',
        businessName: 'FitZone Gym',
        rating: 4.6,
        totalRatings: 189,
        logoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100',
      },
    },
    {
      id: '3',
      title: 'Restaurant Dinner for Two',
      description: 'Enjoy a romantic dinner for two at our award-winning restaurant. Includes appetizer, main course, and dessert.',
      originalPrice: 120.00,
      discountPrice: 79.99,
      discountPercent: 33,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      category: 'Dining',
      startDate: now,
      endDate: tomorrow,
      maxPurchases: 30,
      currentPurchases: 8,
      isActive: true,
      isSponsored: true,
      views: 1567,
      clicks: 134,
      shares: 23,
      provider: {
        id: 'provider-3',
        businessName: 'Bella Vista Restaurant',
        rating: 4.9,
        totalRatings: 312,
        logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100',
      },
    },
    {
      id: '4',
      title: 'Spa Day Package',
      description: 'Relax and rejuvenate with a full spa day including massage, facial, and access to sauna and hot tub.',
      originalPrice: 199.99,
      discountPrice: 119.99,
      discountPercent: 40,
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
      category: 'Wellness',
      startDate: now,
      endDate: nextWeek,
      maxPurchases: 25,
      currentPurchases: 5,
      isActive: true,
      isSponsored: false,
      views: 678,
      clicks: 45,
      shares: 6,
      provider: {
        id: 'provider-4',
        businessName: 'Serenity Spa',
        rating: 4.7,
        totalRatings: 156,
        logoUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=100',
      },
    },
    {
      id: '5',
      title: 'Online Course Bundle - Web Development',
      description: 'Complete web development course bundle covering HTML, CSS, JavaScript, React, and Node.js. Lifetime access!',
      originalPrice: 299.99,
      discountPrice: 99.99,
      discountPercent: 67,
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      category: 'Education',
      startDate: now,
      endDate: twoWeeks,
      maxPurchases: 200,
      currentPurchases: 45,
      isActive: true,
      isSponsored: false,
      views: 2345,
      clicks: 189,
      shares: 34,
      provider: {
        id: 'provider-5',
        businessName: 'TechLearn Academy',
        rating: 4.5,
        totalRatings: 445,
        logoUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100',
      },
    },
    {
      id: '6',
      title: 'Hair Salon Complete Makeover',
      description: 'Full service including haircut, color, styling, and treatment. Perfect for a fresh new look!',
      originalPrice: 150.00,
      discountPrice: 89.99,
      discountPercent: 40,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
      category: 'Beauty',
      startDate: now,
      endDate: nextWeek,
      maxPurchases: 40,
      currentPurchases: 15,
      isActive: true,
      isSponsored: false,
      views: 543,
      clicks: 34,
      shares: 5,
      provider: {
        id: 'provider-6',
        businessName: 'Style Studio',
        rating: 4.4,
        totalRatings: 98,
        logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100',
      },
    },
    {
      id: '7',
      title: 'Marketing Services Package - Social Media',
      description: 'Complete social media management package for 3 months. Includes content creation, posting, and analytics.',
      originalPrice: 999.99,
      discountPrice: 599.99,
      discountPercent: 40,
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
      category: 'Marketing Services',
      startDate: now,
      endDate: twoWeeks,
      maxPurchases: 20,
      currentPurchases: 3,
      isActive: true,
      isSponsored: true,
      views: 456,
      clicks: 28,
      shares: 4,
      provider: {
        id: 'provider-7',
        businessName: 'Digital Marketing Pro',
        rating: 4.9,
        totalRatings: 67,
        logoUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100',
      },
    },
    {
      id: '8',
      title: 'Yoga & Meditation Classes - 10 Sessions',
      description: '10 sessions of yoga and meditation classes. Perfect for beginners and experienced practitioners.',
      originalPrice: 199.99,
      discountPrice: 129.99,
      discountPercent: 35,
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      category: 'Fitness',
      startDate: now,
      endDate: nextWeek,
      maxPurchases: 35,
      currentPurchases: 7,
      isActive: true,
      isSponsored: false,
      views: 789,
      clicks: 56,
      shares: 9,
      provider: {
        id: 'provider-8',
        businessName: 'Zen Yoga Studio',
        rating: 4.8,
        totalRatings: 123,
        logoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=100',
      },
    },
  ]
}

