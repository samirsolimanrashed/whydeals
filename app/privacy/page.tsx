import React from 'react'

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-8">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                <p>Last updated: November 2025</p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">1. Introduction</h2>
                <p>
                    Welcome to Why Deals. We respect your privacy and are committed to protecting your personal data.
                    This privacy policy will inform you as to how we look after your personal data when you visit our website
                    and tell you about your privacy rights and how the law protects you.
                </p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">2. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Identity Data: includes first name, last name, username or similar identifier.</li>
                    <li>Contact Data: includes billing address, delivery address, email address and telephone numbers.</li>
                    <li>Financial Data: includes payment card details (processed securely by our payment providers).</li>
                    <li>Transaction Data: includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                </ul>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">3. How We Use Your Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                </ul>
            </div>
        </div>
    )
}
