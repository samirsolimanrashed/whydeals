import React from 'react'

export default function CookiesPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-8">Cookie Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                <p>Last updated: November 2025</p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">1. What Are Cookies</h2>
                <p>
                    Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows
                    the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                </p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">2. How We Use Cookies</h2>
                <p>
                    When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To enable certain functions of the Service (e.g. authentication).</li>
                    <li>To provide analytics.</li>
                    <li>To store your preferences.</li>
                </ul>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">3. Your Choices</h2>
                <p>
                    If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
                    Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer,
                    you may not be able to store your preferences, and some of our pages might not display properly.
                </p>
            </div>
        </div>
    )
}
