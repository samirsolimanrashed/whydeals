'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { ShoppingBagIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface Order {
    id: string
    transactionId: string | null
    createdAt: string
    total: number
    status: string
    deal: {
        id: string
        title: string
        imageUrl: string | null
        image: string | null
    }
    user: {
        name: string | null
        email: string
        image: string | null
    }
}

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/seller/orders')
            if (!res.ok) throw new Error('Failed to fetch orders')
            const data = await res.json()
            setOrders(data.orders)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const filteredOrders = orders.filter(order =>
        order.deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.transactionId && order.transactionId.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Orders</h1>
                    <p className="text-foreground/70 mt-1">Manage and track your customer orders.</p>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface dark:bg-neutral-800 focus:ring-2 focus:ring-primary-blue outline-none"
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 absolute left-3 top-2.5" />
                </div>
            </div>

            {orders.length === 0 ? (
                <Card className="p-12 text-center flex flex-col items-center">
                    <ShoppingBagIcon className="w-16 h-16 text-neutral-300 mb-4" />
                    <h3 className="text-xl font-bold text-navy-dark dark:text-foreground mb-2">No orders yet</h3>
                    <p className="text-foreground/70 mb-6 max-w-md">
                        When customers purchase your deals, they will appear here. Share your deals to start generating sales!
                    </p>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-100 dark:bg-neutral-800 text-foreground/70 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Deal</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-foreground/70">
                                            #{order.transactionId || order.id.substring(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-foreground/70">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center overflow-hidden">
                                                    {order.user.image ? (
                                                        <img src={order.user.image} alt={order.user.name || 'User'} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-4 h-4 text-neutral-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-navy-dark dark:text-foreground">{order.user.name || 'Guest'}</p>
                                                    <p className="text-xs text-foreground/60">{order.user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-neutral-200 dark:bg-neutral-700 flex-shrink-0 overflow-hidden">
                                                    {(order.deal.image || order.deal.imageUrl) && (
                                                        <img src={order.deal.image || order.deal.imageUrl || ''} alt={order.deal.title} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <p className="font-medium text-navy-dark dark:text-foreground line-clamp-1 max-w-[200px]" title={order.deal.title}>
                                                    {order.deal.title}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-primary-blue">
                                            ${order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' || order.status === 'COMPLETED'
                                                    ? 'bg-green-100 text-green-800'
                                                    : order.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredOrders.length === 0 && searchTerm && (
                        <div className="p-8 text-center text-foreground/60">
                            No orders found matching "{searchTerm}"
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}
