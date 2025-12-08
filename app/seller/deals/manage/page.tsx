'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ManageDealsPage() {
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDeals()
    }, [])

    const fetchDeals = async () => {
        try {
            const res = await fetch('/api/seller/deals')
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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this deal?')) return

        try {
            const res = await fetch(`/api/deals/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete deal')
            toast.success('Deal deleted')
            setDeals(deals.filter(d => d.id !== id))
        } catch (error) {
            toast.error('Failed to delete deal')
        }
    }

    const handlePublish = async (id: string) => {
        try {
            const res = await fetch(`/api/deals/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'ACTIVE' }),
            })
            if (!res.ok) throw new Error('Failed to publish deal')
            toast.success('Deal published successfully!')
            setDeals(deals.map(d => d.id === id ? { ...d, status: 'ACTIVE' } : d))
        } catch (error) {
            toast.error('Failed to publish deal')
        }
    }

    if (loading) return <div className="p-8 text-center">Loading deals...</div>

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Manage Deals</h1>
                    <p className="text-foreground/70 mt-1">View and edit your active listings.</p>
                </div>
                <Link href="/seller/deals/create">
                    <Button variant="primary" size="md">
                        + Create New Deal
                    </Button>
                </Link>
            </div>

            <Card className="overflow-hidden dark:bg-navy-dark dark:border-neutral-700">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-100 dark:bg-neutral-800 text-foreground/70 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Deal Title</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Sales</th>
                                <th className="px-6 py-4">Revenue</th>
                                <th className="px-6 py-4">Views</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                            {deals.map((deal) => (
                                <tr key={deal.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-navy-dark dark:text-foreground">{deal.title}</td>
                                    <td className="px-6 py-4 text-foreground/70">${deal.discountPrice}</td>
                                    <td className="px-6 py-4 text-foreground/70">{deal.sales}</td>
                                    <td className="px-6 py-4 font-medium text-success-green">${deal.revenue.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-foreground/70">{deal.views}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${deal.status === 'ACTIVE' ? 'bg-success-green/10 text-success-green' :
                                            deal.status === 'REJECTED' ? 'bg-error-red/10 text-error-red' :
                                                'bg-warning-orange/10 text-warning-orange'
                                            }`}>
                                            {deal.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {deal.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handlePublish(deal.id)}
                                                    className="text-foreground/70 hover:text-success-green transition-colors mr-2"
                                                    title="Publish Deal"
                                                >
                                                    🚀
                                                </button>
                                            )}
                                            <Link href={`/seller/deals/edit/${deal.id}`}>
                                                <button className="text-foreground/70 hover:text-primary-blue transition-colors">
                                                    ✏️
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(deal.id)}
                                                className="text-foreground/70 hover:text-error-red transition-colors"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {deals.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-foreground/50">
                                        No deals found. Create your first deal!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
