import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CurrencyDollarIcon, RocketLaunchIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function AffiliatePage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-center">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-6">Affiliate Program</h1>
            <p className="text-lg text-foreground/80 mb-8">
                Earn money by promoting the best deals to your audience.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="p-6 bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <CurrencyDollarIcon className="w-12 h-12 text-primary-blue mb-4" />
                    <h3 className="text-xl font-bold mb-2">High Commissions</h3>
                    <p className="text-foreground/70">Earn up to 30% commission on every sale you generate.</p>
                </div>
                <div className="p-6 bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <RocketLaunchIcon className="w-12 h-12 text-primary-blue mb-4" />
                    <h3 className="text-xl font-bold mb-2">Easy Promotion</h3>
                    <p className="text-foreground/70">Get access to banners, links, and marketing materials.</p>
                </div>
                <div className="p-6 bg-surface rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <ChartBarIcon className="w-12 h-12 text-primary-blue mb-4" />
                    <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
                    <p className="text-foreground/70">Monitor your clicks and earnings in real-time.</p>
                </div>
            </div>

            <div className="bg-primary-blue/5 p-8 rounded-xl border border-primary-blue/20">
                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground mb-4">Ready to start earning?</h2>
                <p className="text-foreground/70 mb-6">
                    Join our affiliate program today and start monetizing your content.
                </p>
                <Link href="/coming-soon">
                    <Button variant="primary" size="lg">
                        Join Affiliate Program
                    </Button>
                </Link>
            </div>
        </div>
    )
}
