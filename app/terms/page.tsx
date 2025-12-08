import React from 'react'

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-navy-dark dark:text-foreground mb-8">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6 text-foreground/80">
                <p>Last updated: November 2025</p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">1. Agreement to Terms</h2>
                <p>
                    By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.
                </p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">2. Use License</h2>
                <p>
                    Permission is granted to temporarily download one copy of the materials (information or software) on Why Deals' website for personal,
                    non-commercial transitory viewing only.
                </p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">3. Disclaimer</h2>
                <p>
                    The materials on Why Deals' website are provided on an 'as is' basis. Why Deals makes no warranties, expressed or implied,
                    and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
                    fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <h2 className="text-2xl font-bold text-navy-dark dark:text-foreground">4. Limitations</h2>
                <p>
                    In no event shall Why Deals or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit,
                    or due to business interruption) arising out of the use or inability to use the materials on Why Deals' website.
                </p>
            </div>
        </div>
    )
}
