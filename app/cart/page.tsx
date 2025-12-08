'use client'

import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ShoppingCartIcon, GiftIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background py-20 px-4">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <ShoppingCartIcon className="w-16 h-16 text-neutral-400 mb-6" />
                    <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground mb-4">
                        Your cart is empty
                    </h1>
                    <p className="text-foreground/70 mb-8">
                        Looks like you haven't added any deals yet.
                    </p>
                    <Link href="/marketplace">
                        <Button variant="primary" size="lg">
                            Browse Deals
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground mb-8">
                    Shopping Cart ({items.length} items)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <Card key={item.id} className="p-4 flex gap-4 items-center">
                                {/* Image */}
                                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <GiftIcon className="w-12 h-12 text-neutral-400" />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1">
                                    <h3 className="font-bold text-navy-dark dark:text-foreground text-lg mb-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-primary-blue font-bold">
                                        ${item.price.toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                                    >
                                        -
                                    </button>
                                    <span className="font-medium w-4 text-center dark:text-foreground">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-neutral-400 hover:text-error-red transition p-2"
                                    aria-label="Remove item"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </Card>
                        ))}

                        <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" onClick={clearCart} className="text-error-red border-error-red hover:bg-error-red/10">
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-navy-dark dark:text-foreground mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-foreground/70">
                                    <span>Subtotal</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-foreground/70">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 flex justify-between font-bold text-lg text-navy-dark dark:text-foreground">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Link href="/customer/checkout">
                                <Button variant="primary" size="lg" className="w-full">
                                    Proceed to Checkout
                                </Button>
                            </Link>

                            <p className="text-xs text-center text-foreground/60 mt-4">
                                Secure checkout powered by 2Checkout
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
