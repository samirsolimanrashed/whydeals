'use client'

import { Card } from '@/components/ui/Card'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function OrdersPage() {
    const { data: session } = useSession()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (session?.user?.id) {
            fetchOrders()
        }
    }, [session])

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/customer/orders')
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-center">
                <p className="text-foreground/70">Loading orders...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <Card className="p-8 text-center dark:bg-navy-dark dark:border-neutral-700">
                        <p className="text-foreground/70 mb-4">You haven't placed any orders yet.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order.id} className="p-6 dark:bg-navy-dark dark:border-neutral-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-bold text-navy-dark dark:text-foreground">Order #{order.transactionId || order.id.substring(0, 8)}</p>
                                        <p className="text-sm text-foreground/70">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-blue">${order.total.toFixed(2)}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${order.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                                    <div className="flex gap-4">
                                        {/* We assume Deal is included in the fetch */}
                                        {order.deal?.imageUrl && (
                                            <img src={order.deal.imageUrl} alt={order.deal.title} className="w-16 h-16 object-cover rounded" />
                                        )}
                                        <div>
                                            <p className="font-bold text-navy-dark dark:text-foreground">{order.deal?.title || 'Unknown Deal'}</p>
                                            <p className="text-sm text-foreground/70">Qty: {order.quantity}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
