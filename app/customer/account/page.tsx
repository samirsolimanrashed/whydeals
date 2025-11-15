'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getMockDeals } from '@/lib/mockData'
import DealCard from '@/components/DealCard'

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'purchases' | 'favorites' | 'notifications'>('profile')
  const deals = getMockDeals()
  const favoriteDeals = deals.slice(0, 3) // Mock favorites

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Account</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'purchases', label: 'Purchase History' },
            { id: 'favorites', label: 'Saved Deals' },
            { id: 'notifications', label: 'Notifications' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                defaultValue="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                defaultValue="+1 (555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Email notifications for deal expiry reminders</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Email notifications for new deals in saved categories</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">Push notifications (requires browser permission)</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Update Profile
            </button>
          </div>
        </div>
      )}

      {/* Purchases Tab */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Purchase History</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Premium Coffee Subscription</h3>
                  <p className="text-sm text-gray-600">Purchased on Jan 15, 2024</p>
                </div>
                <span className="text-blue-600 font-semibold">$39.99</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Completed
                </span>
                <Link href="/customer/deals/1" className="text-blue-600 text-xs hover:underline">
                  View Deal
                </Link>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Fitness Gym Membership</h3>
                  <p className="text-sm text-gray-600">Purchased on Jan 10, 2024</p>
                </div>
                <span className="text-blue-600 font-semibold">$149.99</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Completed
                </span>
                <Link href="/customer/deals/2" className="text-blue-600 text-xs hover:underline">
                  View Deal
                </Link>
              </div>
            </div>

            <div className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">Restaurant Dinner for Two</h3>
                  <p className="text-sm text-gray-600">Purchased on Jan 5, 2024</p>
                </div>
                <span className="text-blue-600 font-semibold">$79.99</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                  Pending
                </span>
                <Link href="/customer/deals/3" className="text-blue-600 text-xs hover:underline">
                  View Deal
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Saved Deals</h2>
          {favoriteDeals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No saved deals yet.</p>
              <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
                Browse deals
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Deal Expiring Soon</h3>
                <p className="text-sm text-blue-800">
                  Premium Coffee Subscription expires in 2 hours!
                </p>
                <p className="text-xs text-blue-600 mt-1">2 hours ago</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex-1">
                <h3 className="font-semibold text-green-900">New Deal Available</h3>
                <p className="text-sm text-green-800">
                  A new deal in Fitness category is now available!
                </p>
                <p className="text-xs text-green-600 mt-1">1 day ago</p>
              </div>
              <button className="text-green-600 hover:text-green-800 text-sm">View</button>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Purchase Confirmed</h3>
                <p className="text-sm text-gray-800">
                  Your purchase of Restaurant Dinner for Two has been confirmed.
                </p>
                <p className="text-xs text-gray-600 mt-1">3 days ago</p>
              </div>
              <button className="text-gray-600 hover:text-gray-800 text-sm">View</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
