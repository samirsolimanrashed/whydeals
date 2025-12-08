import React from 'react'
import { Button } from '@/components/ui/Button'

export default function SupportPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-6">Support Center</h1>
            <p className="text-lg text-foreground/80 mb-8">
                Need help? Our support team is here to assist you with any questions or issues.
            </p>

            <div className="bg-surface p-8 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm mb-8">
                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground mb-4">Contact Us</h2>
                <p className="text-foreground/70 mb-6">
                    For immediate assistance, please email us directly.
                </p>
                <a href="mailto:support@whydeals.com">
                    <Button variant="primary" size="lg">
                        Email Support
                    </Button>
                </a>
            </div>

            <div className="text-left">
                <h3 className="text-xl font-bold text-navy-dark dark:text-foreground mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <details className="bg-surface p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <summary className="font-medium cursor-pointer">How do I access my purchases?</summary>
                        <p className="mt-2 text-foreground/70">You can access all your purchased deals in the "My Account" section under "My Orders".</p>
                    </details>
                    <details className="bg-surface p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <summary className="font-medium cursor-pointer">Can I get a refund?</summary>
                        <p className="mt-2 text-foreground/70">We offer a 30-day money-back guarantee on most deals. Please check the specific deal terms for details.</p>
                    </details>
                    <details className="bg-surface p-4 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        <summary className="font-medium cursor-pointer">How do I become a seller?</summary>
                        <p className="mt-2 text-foreground/70">Click on "Become a Seller" in the navigation bar to start your application process.</p>
                    </details>
                </div>
            </div>
        </div>
    )
}
