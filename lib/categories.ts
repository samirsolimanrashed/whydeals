export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
}

export const categories: Category[] = [
  { id: '1', name: 'All Categories', slug: 'all', icon: '📋' },
  { id: '2', name: 'Food & Beverage', slug: 'food-beverage', icon: '🍔' },
  { id: '3', name: 'Fitness', slug: 'fitness', icon: '💪' },
  { id: '4', name: 'Dining', slug: 'dining', icon: '🍽️' },
  { id: '5', name: 'Wellness', slug: 'wellness', icon: '🧘' },
  { id: '6', name: 'Education', slug: 'education', icon: '📚' },
  { id: '7', name: 'Beauty', slug: 'beauty', icon: '💄' },
  { id: '8', name: 'Marketing Services', slug: 'marketing-services', icon: '📊' },
]

export type SortOption = 'time-left' | 'price-low' | 'price-high' | 'popularity' | 'discount'

export const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'time-left', label: 'Time Left' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'discount', label: 'Biggest Discount' },
]

