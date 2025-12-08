'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '@/lib/categories'

export default function SellerOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    logoUrl: '',
    selectedCategories: [] as string[],
    subscriptionType: 'COMMISSION_BASED' as 'COMMISSION_BASED' | 'MONTHLY_SUBSCRIPTION' | 'ANNUAL_SUBSCRIPTION',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCategoryToggle = (categoryName: string) => {
    setFormData({
      ...formData,
      selectedCategories: formData.selectedCategories.includes(categoryName)
        ? formData.selectedCategories.filter(c => c !== categoryName)
        : [...formData.selectedCategories, categoryName],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement API call to create seller profile
    console.log('Creating seller profile:', formData)
    alert('Seller profile created! Pending admin approval.')
    router.push('/seller/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 dark:text-foreground">Seller Onboarding</h1>
        <p className="text-gray-600 dark:text-gray-400">Set up your business profile to start listing deals</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-primary-blue text-foreground' : 'bg-gray-200 text-gray-600 dark:bg-neutral-700 dark:text-gray-400'
                  }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${step > s ? 'bg-primary-blue' : 'bg-gray-200 dark:bg-neutral-700'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Business Info</span>
          <span>Categories</span>
          <span>Review</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="bg-surface rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Business Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                placeholder="Your Business Name"
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
                placeholder="Describe your business..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                placeholder="123 Main St, City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Logo URL
              </label>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-primary-blue text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary-blue/90 transition"
              >
                Next: Categories
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Categories */}
        {step === 2 && (
          <div className="bg-surface rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Select Categories</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Choose the categories that best describe your business</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.slice(1).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryToggle(category.name)}
                  className={`p-4 border-2 rounded-lg text-center transition dark:text-foreground ${formData.selectedCategories.includes(category.name)
                    ? 'border-primary-blue bg-primary-blue/5 dark:bg-primary-blue/20'
                    : 'border-gray-200 hover:border-gray-300 dark:border-neutral-700 dark:hover:border-neutral-600'
                    }`}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium">{category.name}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subscription Model
              </label>
              <select
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
              >
                <option value="COMMISSION_BASED">Commission Based (Pay per sale)</option>
                <option value="MONTHLY_SUBSCRIPTION">Monthly Subscription</option>
                <option value="ANNUAL_SUBSCRIPTION">Annual Subscription</option>
              </select>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition dark:bg-neutral-700 dark:text-foreground dark:hover:bg-neutral-600"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-primary-blue text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary-blue/90 transition"
              >
                Next: Review
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="bg-surface rounded-lg shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-semibold mb-4 dark:text-foreground">Review Your Information</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Business Name</h3>
                <p className="text-gray-600 dark:text-gray-400">{formData.businessName}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">{formData.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Categories</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.selectedCategories.map((cat) => (
                    <span key={cat} className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-sm">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Subscription Model</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {formData.subscriptionType === 'COMMISSION_BASED' && 'Commission Based'}
                  {formData.subscriptionType === 'MONTHLY_SUBSCRIPTION' && 'Monthly Subscription'}
                  {formData.subscriptionType === 'ANNUAL_SUBSCRIPTION' && 'Annual Subscription'}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-900/50">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> Your seller profile will be reviewed by our admin team.
                You'll receive an email notification once approved.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition dark:bg-neutral-700 dark:text-foreground dark:hover:bg-neutral-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-primary-blue text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary-blue/90 transition"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

