'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateDealPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    category: '',
    startDate: '',
    endDate: '',
    timeFramePreset: '', // hours, days, weeks, months
    timeFrameValue: '',
    maxPurchases: '',
    imageUrl: '',
    isSponsored: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to create deal
    console.log('Creating deal:', formData)
    alert('Deal created successfully! (This is a mock - implement API call)')
    router.push('/provider/dashboard')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const discountPercent = formData.originalPrice && formData.discountPrice
    ? Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.discountPrice)) / parseFloat(formData.originalPrice)) * 100)
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Deal</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 50% Off Premium Coffee Subscription"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your deal in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price ($) *
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Price ($) *
              </label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {discountPercent > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {discountPercent}% discount
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Fitness">Fitness</option>
              <option value="Dining">Dining</option>
              <option value="Wellness">Wellness</option>
              <option value="Education">Education</option>
              <option value="Beauty">Beauty</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Deal Duration</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Presets (or set custom dates below)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: '24 Hours', hours: 24 },
                  { label: '3 Days', hours: 72 },
                  { label: '1 Week', hours: 168 },
                  { label: '1 Month', hours: 720 },
                  { label: '2 Months', hours: 1440 },
                  { label: '3 Months', hours: 2160 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const now = new Date()
                      const end = new Date(now.getTime() + preset.hours * 60 * 60 * 1000)
                      setFormData({
                        ...formData,
                        startDate: now.toISOString().slice(0, 16),
                        endDate: end.toISOString().slice(0, 16),
                      })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 transition text-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Maximum duration: 3 months. Deals create urgency with time limits!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inventory / Maximum Purchases
            </label>
            <input
              type="number"
              name="maxPurchases"
              value={formData.maxPurchases}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Leave empty for unlimited"
            />
            <p className="text-xs text-gray-500 mt-1">
              Limited inventory creates urgency! Leave empty for unlimited availability.
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isSponsored"
              id="isSponsored"
              checked={formData.isSponsored}
              onChange={(e) => setFormData({ ...formData, isSponsored: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isSponsored" className="ml-2 text-sm font-medium text-gray-700">
              Make this a Sponsored Deal (highlighted placement)
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Deal
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

