import Link from 'next/link'
import { getMockDeals } from '@/lib/mockData'

export default function ProviderDashboard() {
  const deals = getMockDeals().slice(0, 3) // Show first 3 deals as examples

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Provider Dashboard</h1>
        <Link
          href="/provider/deals/create"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create New Deal
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Deals</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Active Deals</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-600 text-sm mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$12,450</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Deals</h2>
          <Link
            href="/provider/analytics"
            className="text-blue-600 hover:underline font-semibold"
          >
            View Analytics →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Deal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Purchases</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold">{deal.title}</p>
                      <p className="text-sm text-gray-600">{deal.category}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-blue-600">${deal.discountPrice.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">${deal.originalPrice.toFixed(2)}</span>
                  </td>
                  <td className="py-4 px-4">
                    {deal.currentPurchases} / {deal.maxPurchases || '∞'}
                  </td>
                  <td className="py-4 px-4">
                    {deal.isActive ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Inactive</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:underline text-sm">Edit</button>
                      <button className="text-red-600 hover:underline text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

