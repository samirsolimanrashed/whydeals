'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import {
    CurrencyDollarIcon,
    TagIcon,
    EyeIcon,
    StarIcon,
    MegaphoneIcon,
    UserIcon,
    CreditCardIcon,
    LightBulbIcon
} from '@heroicons/react/24/outline'

export default function SellerDashboard() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        stats: {
            totalSales: 0,
            activeDeals: 0,
            totalViews: 0,
            avgRating: 0
        },
        recentSales: [] as any[]
    })

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/seller/stats')
            if (!res.ok) throw new Error('Failed to fetch stats')
            const statsData = await res.json()
            setData(statsData)
        } catch (error) {
            console.error(error)
            // Don't show error toast on initial load to avoid annoyance if empty
        } finally {
            setLoading(false)
        }
    }

    const stats = [
        { label: 'Total Sales', value: `$${data.stats.totalSales.toFixed(2)}`, change: 'Lifetime', Icon: CurrencyDollarIcon, color: 'text-success-green' },
        { label: 'Active Deals', value: data.stats.activeDeals.toString(), change: 'Now', Icon: TagIcon, color: 'text-primary-blue' },
        { label: 'Total Views', value: data.stats.totalViews.toLocaleString(), change: 'Lifetime', Icon: EyeIcon, color: 'text-violet-accent' },
        { label: 'Avg. Rating', value: data.stats.avgRating.toFixed(1), change: 'Lifetime', Icon: StarIcon, color: 'text-warning-orange' },
    ]

    if (loading) {
        return <div className="p-8 text-center">Loading dashboard...</div>
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Dashboard</h1>
                    <p className="text-foreground/70 mt-1">Welcome back! Here's what's happening with your deals.</p>
                </div>
                <Link href="/seller/deals/create">
                    <Button variant="primary" size="md">
                        + Create New Deal
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-foreground/70">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-navy-dark dark:text-foreground mt-2">{stat.value}</h3>
                            </div>
                            <stat.Icon className={`w-8 h-8 ${stat.color}`} />
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-success-green font-medium bg-success-green/10 px-2 py-0.5 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Recent Activity & Top Deals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Sales */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">Recent Sales</h2>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-100 dark:bg-neutral-800 text-foreground/70 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Deal</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {data.recentSales.length > 0 ? (
                                        data.recentSales.map((sale) => (
                                            <tr key={sale.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-neutral-700 last:border-0">
                                                <td className="px-6 py-4 font-medium text-navy-dark dark:text-foreground">{sale.deal}</td>
                                                <td className="px-6 py-4 text-foreground/70">{sale.customer}</td>
                                                <td className="px-6 py-4 font-medium text-navy-dark dark:text-foreground">${sale.amount.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${sale.status === 'PAID' || sale.status === 'COMPLETED'
                                                        ? 'bg-success-green/10 text-success-green'
                                                        : sale.status === 'PENDING'
                                                            ? 'bg-warning-orange/10 text-warning-orange'
                                                            : 'bg-error-red/10 text-error-red'
                                                        }`}>
                                                        {sale.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-foreground/50">
                                                No recent sales found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 text-center">
                            <Link href="/seller/orders" className="text-primary-blue font-medium hover:underline">
                                View All Orders
                            </Link>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions / Tips */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link href="/seller/deals/create" className="block">
                            <Button variant="outline" className="w-full justify-start flex items-center gap-2">
                                <MegaphoneIcon className="w-5 h-5" />
                                Create New Deal
                            </Button>
                        </Link>
                        <Link href="/seller/earnings" className="block">
                            <Button variant="outline" className="w-full justify-start flex items-center gap-2">
                                <CreditCardIcon className="w-5 h-5" />
                                View Earnings
                            </Button>
                        </Link>
                    </div>
                    <Card className="md:col-span-2 dark:bg-navy-dark dark:border-neutral-700">
                        <h2 className="text-xl font-bold text-navy-dark dark:text-foreground mb-4">Seller Tips</h2>
                        <div className="bg-primary-blue/5 p-4 rounded-lg border border-primary-blue/10">
                            <p className="text-foreground/80 mb-2 flex items-start gap-2">
                                <LightBulbIcon className="w-5 h-5 text-warning-orange flex-shrink-0 mt-0.5" />
                                <span><strong>Pro Tip:</strong> Deals with high-quality images and detailed descriptions convert 3x better.</span>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
