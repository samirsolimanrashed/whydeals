'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDealsPage() {
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        fetchDeals()
    }, [filter])

    const fetchDeals = async () => {
        try {
            setLoading(true)
            const res = await fetch(`/api/admin/deals?status=${filter}`)
            if (!res.ok) throw new Error('Failed to fetch deals')
            const data = await res.json()
            setDeals(data.deals)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load deals')
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (dealId: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/deals/${dealId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error('Failed to update deal')
            toast.success(`Deal ${status.toLowerCase()}`)
            fetchDeals() // Refresh list
        } catch (error) {
            toast.error('Failed to update deal status')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-navy-dark p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Manage Deals</h1>
                        <p className="text-foreground/70">View and moderate all platform deals</p>
                    </div>
                    <Link href="/admin/dashboard">
                        <Button variant="outline" size="sm">Back to Dashboard</Button>
                    </Link>
                </div>

                <Card className="p-6 dark:bg-navy-dark dark:border-neutral-700">
                    <div className="flex gap-4 mb-6">
                        {['ALL', 'ACTIVE', 'DRAFT', 'ENDED', 'REJECTED'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-primary-blue text-white'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-foreground/70 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading deals...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 dark:bg-neutral-800 text-foreground/70 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Seller</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {deals.map((deal) => (
                                        <tr key={deal.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-navy-dark dark:text-foreground">{deal.title}</td>
                                            <td className="px-6 py-4 text-foreground/70">{deal.seller?.user?.name || deal.seller?.businessName || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-foreground/70">${deal.discountPrice}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${new Date(deal.endTime) < new Date() ? 'bg-neutral-200 text-neutral-600' :
                                                    deal.status === 'ACTIVE' ? 'bg-success-green/10 text-success-green' :
                                                        deal.status === 'REJECTED' ? 'bg-error-red/10 text-error-red' :
                                                            'bg-warning-orange/10 text-warning-orange'
                                                    }`}>
                                                    {new Date(deal.endTime) < new Date() ? 'ENDED' : deal.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/seller/deals/create?edit=${deal.id}`}>
                                                        <Button variant="outline" size="sm" className="h-8 px-3">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={`h-8 px-3 ${deal.isFeatured ? 'text-yellow-500 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 'text-gray-400'}`}
                                                        onClick={() => handleStatusUpdate(deal.id, deal.isFeatured ? 'UNFEATURE' : 'FEATURE')}
                                                        title={deal.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                                                    >
                                                        ★
                                                    </Button>
                                                    <Link href={`/deals/${deal.id}`} target="_blank">
                                                        <Button variant="outline" size="sm" className="h-8 px-3">
                                                            Preview
                                                        </Button>
                                                    </Link>
                                                    {deal.status !== 'ACTIVE' && (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="bg-success-green hover:bg-green-600 border-none h-8 px-3"
                                                            onClick={() => handleStatusUpdate(deal.id, 'ACTIVE')}
                                                        >
                                                            Approve
                                                        </Button>
                                                    )}
                                                    {deal.status !== 'REJECTED' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-error-red border-error-red hover:bg-red-50 dark:hover:bg-red-900/20 h-8 px-3"
                                                            onClick={() => handleStatusUpdate(deal.id, 'REJECTED')}
                                                        >
                                                            Reject
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {deals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                                                No deals found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
