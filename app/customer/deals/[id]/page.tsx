import CountdownTimer from '@/components/CountdownTimer'
import ShareButton from '@/components/ShareButton'
import { getMockDeals } from '@/lib/mockData'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default function DealDetailsPage({ params }: PageProps) {
  const deals = getMockDeals()
  const deal = deals.find(d => d.id === params.id)

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Deal Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Deals
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {deal.imageUrl && (
            <img
              src={deal.imageUrl}
              alt={deal.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          )}
        </div>

        <div>
          <div className="mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
              {deal.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold mb-4">{deal.title}</h1>

          {deal.provider && (
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                {deal.provider.logoUrl && (
                  <img
                    src={deal.provider.logoUrl}
                    alt={deal.provider.businessName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {deal.provider.businessName}
                  </p>
                  {deal.provider.rating && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">{deal.provider.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-sm">
                        ({deal.provider.totalRatings} ratings)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <ShareButton deal={deal} />
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-4xl font-bold text-blue-600">${deal.discountPrice.toFixed(2)}</span>
              <span className="text-2xl text-gray-400 line-through">${deal.originalPrice.toFixed(2)}</span>
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                {Math.round(deal.discountPercent)}% OFF
              </span>
            </div>
          </div>

          <div className="mb-6">
            <CountdownTimer endDate={deal.endDate} />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">{deal.description}</p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Purchases:</span>
              <span className="font-semibold">
                {deal.currentPurchases} / {deal.maxPurchases || '∞'}
              </span>
            </div>
            {deal.maxPurchases && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(deal.currentPurchases / deal.maxPurchases) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <Link
            href={`/customer/checkout?dealId=${deal.id}`}
            className="block w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition text-center"
          >
            Buy Now - Secure Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}

