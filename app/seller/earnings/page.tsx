'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function EarningsPage() {
    const [loading, setLoading] = useState(false)
    const [showPayoutForm, setShowPayoutForm] = useState(false)
    const [payoutAccount, setPayoutAccount] = useState<any>(null)
    const [formData, setFormData] = useState({
        accountHolder: '',
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
        country: 'US'
    })

    useEffect(() => {
        fetchPayoutAccount()
    }, [])

    const fetchPayoutAccount = async () => {
        try {
            const res = await fetch('/api/seller/payout')
            if (res.ok) {
                const data = await res.json()
                if (data.payoutAccount) {
                    setPayoutAccount(data.payoutAccount)
                    setFormData({
                        accountHolder: data.payoutAccount.accountHolder,
                        bankName: data.payoutAccount.bankName || '',
                        accountNumber: data.payoutAccount.accountNumber,
                        routingNumber: data.payoutAccount.routingNumber || '',
                        accountType: data.payoutAccount.accountType,
                        country: data.payoutAccount.country
                    })
                }
            }
        } catch (error) {
            console.error('Failed to fetch payout account', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/seller/payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!res.ok) throw new Error('Failed to save payout account')

            const data = await res.json()
            setPayoutAccount(data.payoutAccount)
            setShowPayoutForm(false)
            toast.success('Payout account saved successfully!')
        } catch (error) {
            toast.error('Failed to save payout account')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Earnings & Payouts</h1>
                <p className="text-foreground/70 mt-1">Track your revenue and manage your payout settings.</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-navy-dark text-foreground border-none">
                    <p className="text-neutral-gray-light/80 text-sm font-medium">Available Balance</p>
                    <h2 className="text-4xl font-bold mt-2">$0.00</h2>
                    <p className="text-xs text-foreground/60 mt-2">Connect your payout account below</p>
                </Card>

                <Card className="p-6">
                    <p className="text-foreground/70 text-sm font-medium">Pending Clearance</p>
                    <h2 className="text-4xl font-bold text-navy-dark dark:text-foreground mt-2">$0.00</h2>
                    <p className="text-xs text-foreground/60 mt-2">Funds are held for 7 days after sale.</p>
                </Card>

                <Card className="p-6">
                    <p className="text-foreground/70 text-sm font-medium">Total Withdrawn</p>
                    <h2 className="text-4xl font-bold text-navy-dark dark:text-foreground mt-2">$0.00</h2>
                    <p className="text-xs text-foreground/60 mt-2">Lifetime earnings paid out.</p>
                </Card>
            </div>

            {/* Payout Account Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">Payout Account</h2>
                    {payoutAccount && !showPayoutForm && (
                        <Button onClick={() => setShowPayoutForm(true)} variant="outline" size="sm">
                            Edit
                        </Button>
                    )}
                </div>

                {payoutAccount && !showPayoutForm ? (
                    <Card className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-foreground/70">Account Holder</p>
                                <p className="font-medium text-navy-dark dark:text-foreground">{payoutAccount.accountHolder}</p>
                            </div>
                            {payoutAccount.bankName && (
                                <div>
                                    <p className="text-sm text-foreground/70">Bank Name</p>
                                    <p className="font-medium text-navy-dark dark:text-foreground">{payoutAccount.bankName}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-foreground/70">Account Number</p>
                                <p className="font-medium text-navy-dark dark:text-foreground">****{payoutAccount.accountNumber.slice(-4)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-foreground/70">Account Type</p>
                                <p className="font-medium text-navy-dark dark:text-foreground capitalize">{payoutAccount.accountType}</p>
                            </div>
                            <div>
                                <p className="text-sm text-foreground/70">Status</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${payoutAccount.verified
                                        ? 'bg-success-green/10 text-success-green'
                                        : 'bg-warning-orange/10 text-warning-orange'
                                    }`}>
                                    {payoutAccount.verified ? 'Verified' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Holder Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="accountHolder"
                                        value={formData.accountHolder}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                        placeholder="Chase Bank"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                        placeholder="123456789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Routing Number
                                    </label>
                                    <input
                                        type="text"
                                        name="routingNumber"
                                        value={formData.routingNumber}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                        placeholder="021000021"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Account Type *
                                    </label>
                                    <select
                                        name="accountType"
                                        value={formData.accountType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                    >
                                        <option value="checking">Checking</option>
                                        <option value="savings">Savings</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Country *
                                    </label>
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent bg-white dark:bg-surface dark:text-foreground dark:border-neutral-700"
                                    >
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" variant="primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Payout Account'}
                                </Button>
                                {payoutAccount && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowPayoutForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                )}
            </div>

            {/* Transaction History */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-navy-dark dark:text-foreground">Transaction History</h2>
                <Card className="p-8 text-center">
                    <p className="text-foreground/60">No transactions yet</p>
                    <p className="text-sm text-foreground/50 mt-2">Your sales and payouts will appear here</p>
                </Card>
            </div>
        </div>
    )
}
