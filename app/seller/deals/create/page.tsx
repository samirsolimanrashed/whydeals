'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { useEffect } from 'react'

export default function CreateDealPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const isEditMode = !!editId

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: '',
    discountPrice: '',
    category: '',
    startDate: '',
    endDate: '',
    timeFramePreset: '',
    timeFrameValue: '',
    maxPurchases: '',
    imageUrl: '',
    isSponsored: false,
  })

  useEffect(() => {
    if (isEditMode) {
      fetchDeal(editId)
    }
  }, [isEditMode, editId])

  const fetchDeal = async (id: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/deals/${id}`)
      if (!res.ok) throw new Error('Failed to fetch deal')
      const data = await res.json()
      const deal = data.deal

      // Format dates for datetime-local input
      const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const tzOffset = date.getTimezoneOffset() * 60000
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16)
      }

      setFormData({
        title: deal.title,
        description: deal.description,
        originalPrice: deal.originalPrice.toString(),
        discountPrice: deal.discountPrice.toString(),
        category: deal.category || '',
        startDate: formatDate(deal.startTime),
        endDate: formatDate(deal.endTime),
        timeFramePreset: '',
        timeFrameValue: '',
        maxPurchases: deal.inventory.toString(),
        imageUrl: deal.image || '',
        isSponsored: false,
      })
    } catch (error) {
      console.error(error)
      toast.error('Failed to load deal details')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const data = new FormData()
      data.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { url } = await res.json()
      setFormData(prev => ({ ...prev, imageUrl: url }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = isEditMode ? `/api/deals/${editId}` : '/api/deals'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          originalPrice: parseFloat(formData.originalPrice),
          discountPrice: parseFloat(formData.discountPrice),
          category: formData.category,
          startTime: new Date(formData.startDate).toISOString(),
          endTime: new Date(formData.endDate).toISOString(),
          inventory: formData.maxPurchases ? parseInt(formData.maxPurchases) : 9999,
          imageUrl: formData.imageUrl,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save deal')
      }

      toast.success(isEditMode ? 'Deal updated successfully!' : 'Deal created successfully!')
      router.back()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to save deal')
    } finally {
      setLoading(false)
    }
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
      <h1 className="text-4xl font-bold mb-8 dark:text-foreground">{isEditMode ? 'Edit Deal' : 'Create New Deal'}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-surface rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              placeholder="e.g., 50% Off Premium Coffee Subscription"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              placeholder="Describe your deal in detail..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              />
              {discountPercent > 0 && (
                <p className="text-sm text-primary-blue mt-1">
                  {discountPercent}% discount
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
            >
              <option value="">Select a category</option>
              <option value="Software">Software</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Productivity">Productivity</option>
              <option value="Courses">Courses</option>
              <option value="Dev Tools">Dev Tools</option>
            </select>
          </div>

          <div className="border-t pt-6 dark:border-neutral-700">
            <h3 className="text-lg font-semibold mb-4 dark:text-foreground">Deal Duration</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: '24 Hours', hours: 24 },
                  { label: '3 Days', hours: 72 },
                  { label: '1 Week', hours: 168 },
                  { label: '1 Month', hours: 720 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const now = new Date()
                      const end = new Date(now.getTime() + preset.hours * 60 * 60 * 1000)
                      // Adjust for timezone offset to display correctly in datetime-local input
                      const tzOffset = now.getTimezoneOffset() * 60000
                      const localStart = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16)
                      const localEnd = new Date(end.getTime() - tzOffset).toISOString().slice(0, 16)

                      setFormData({
                        ...formData,
                        startDate: localStart,
                        endDate: localEnd,
                      })
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-primary-blue/5 hover:border-primary-blue transition text-sm dark:border-neutral-700 dark:text-foreground dark:hover:bg-primary-blue/20"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Inventory / Maximum Purchases
            </label>
            <input
              type="number"
              name="maxPurchases"
              value={formData.maxPurchases}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deal Image
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-blue/10 file:text-primary-blue hover:file:bg-primary-blue/20"
              />
              {uploading && <span className="text-sm text-gray-500">Uploading...</span>}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Recommended size: 1200x800px (3:2 aspect ratio). Max size: 5MB. Supported formats: JPG, PNG, WEBP.
            </p>
            {formData.imageUrl && (
              <div className="mt-4">
                <img src={formData.imageUrl} alt="Deal preview" className="h-32 w-auto rounded-lg object-cover" />
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 bg-primary-blue text-foreground py-3 rounded-lg font-semibold hover:bg-primary-blue/90 transition disabled:opacity-50"
            >
              {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Deal' : 'Create Deal')}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition dark:bg-neutral-700 dark:text-foreground dark:hover:bg-neutral-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

