import React from 'react'

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-6">About Why Deals</h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-foreground/80 mb-6">
                    Why Deals is the premium marketplace for digital assets, software, and exclusive deals.
                    We empower creators, founders, and businesses by connecting them with the best tools at unbeatable prices.
                </p>
                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground mt-8 mb-4">Our Mission</h2>
                <p className="text-foreground/70 mb-6">
                    To democratize access to premium software and design resources, making it easier for anyone to launch and grow their business.
                </p>
                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground mt-8 mb-4">Why Choose Us?</h2>
                <ul className="list-disc pl-6 space-y-2 text-foreground/70">
                    <li>Curated selection of high-quality deals</li>
                    <li>Verified sellers and authentic reviews</li>
                    <li>Secure payments and instant delivery</li>
                    <li>Dedicated support for both buyers and sellers</li>
                </ul>
            </div>
        </div>
    )
}
