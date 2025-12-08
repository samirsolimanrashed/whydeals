'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import {
    CurrencyDollarIcon,
    ChartBarIcon,
    UserGroupIcon,
    ShieldCheckIcon,
    RocketLaunchIcon,
    GlobeAltIcon,
    AdjustmentsHorizontalIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    StarIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline'

export default function BecomeSellerPage() {
    const whySell = [
        {
            icon: CurrencyDollarIcon,
            title: "No Upfront Fees. Earn First, Pay Later",
            description: "List unlimited deals for free. We only take a commission when you sell. Our current commission model is 40% and it helps us cover marketing, traffic, operations and seller support."
        },
        {
            icon: GlobeAltIcon,
            title: "Reach Ready to Buy Clients Worldwide",
            description: "Your offers are actively promoted to a global audience that is already searching for services and deals."
        },
        {
            icon: RocketLaunchIcon,
            title: "Instant Deal Publishing",
            description: "Add your service, set your price, upload images and go live in minutes."
        },
        {
            icon: AdjustmentsHorizontalIcon,
            title: "You Control Everything",
            description: "Pricing, delivery time, deal description, availability, and communication with buyers. You stay in full control of your business."
        }
    ]

    const whoCanSell = [
        "Freelancers",
        "Agencies",
        "Designers & Developers",
        "Marketers",
        "Coaches & Consultants",
        "SaaS Founders",
        "Local Service Providers",
        "Photographers & Editors"
    ]

    const earningSteps = [
        { title: "Add your services and deals", description: "Create compelling offers in minutes." },
        { title: "Buyers purchase securely", description: "We handle the payment processing." },
        { title: "You deliver the work", description: "Provide value to your new client." },
        { title: "You get paid", description: "Use your preferred withdrawal method." },
        { title: "We take our 40% commission", description: "Only when you successfully sell." }
    ]

    const dashboardHighlights = [
        { icon: ChartBarIcon, text: "Full analytics for your deals" },
        { icon: BanknotesIcon, text: "Order management" },
        { icon: ChatBubbleLeftRightIcon, text: "Chat with buyers" },
        { icon: StarIcon, text: "Ratings and reviews" },
        { icon: CurrencyDollarIcon, text: "Automatic payouts" },
        { icon: UserGroupIcon, text: "Transaction history & Insights" }
    ]

    const differentiators = [
        { title: "A marketplace focused on deals", desc: "People come here to buy, not browse." },
        { title: "Transparent commission model", desc: "You always know what you earn. No surprises. Fixed at 40%." },
        { title: "Verified sellers", desc: "Your profile looks trusted from day one." },
        { title: "Global exposure", desc: "From the moment you join." }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-blue to-violet-accent text-white py-24 px-4">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Sell Your Services. Get More Clients. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Earn More on One Marketplace.</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
                            Give your digital or local services massive visibility and start receiving buyers instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/seller/signup" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-blue hover:bg-blue-50 font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                                    <RocketLaunchIcon className="w-6 h-6 mr-2" />
                                    Become a Seller
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Sell on Our Marketplace? */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-dark dark:text-white text-center mb-12">
                        Why Sell on Our Marketplace?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {whySell.map((item, index) => (
                            <Card key={index} className="p-8 hover:shadow-lg transition-all border-none bg-white dark:bg-neutral-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-6 h-6 text-primary-blue" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-navy-dark dark:text-white mb-2">{item.title}</h3>
                                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Can Sell? */}
            <section className="py-20 px-4 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-dark dark:text-white mb-6">
                        Who Can Sell on Our Platform?
                    </h2>
                    <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-10">
                        If you provide value, you can sell it here.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {whoCanSell.map((item, index) => (
                            <span key={index} className="px-6 py-3 rounded-full bg-white dark:bg-neutral-800 shadow-sm border border-neutral-200 dark:border-neutral-700 text-lg font-medium text-navy-dark dark:text-white">
                                {item}
                            </span>
                        ))}
                        <span className="px-6 py-3 rounded-full bg-primary-blue/10 text-primary-blue border border-primary-blue/20 text-lg font-medium">
                            And many more...
                        </span>
                    </div>
                </div>
            </section>

            {/* How You Earn Money */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-dark dark:text-white text-center mb-16">
                        How You Earn Money
                    </h2>
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>

                        <div className="space-y-12">
                            {earningSteps.map((step, index) => (
                                <div key={index} className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className={`md:flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                            <h3 className="text-xl font-bold text-navy-dark dark:text-white mb-2">{step.title}</h3>
                                            <p className="text-neutral-600 dark:text-neutral-400">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-primary-blue text-white flex items-center justify-center font-bold text-xl z-10 shadow-lg border-4 border-white dark:border-background">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-neutral-500 dark:text-neutral-400 mt-12 font-medium">
                        No subscriptions. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Dashboard Highlights */}
            <section className="py-20 px-4 bg-navy-dark text-white">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                        Seller Dashboard Highlights
                    </h2>
                    <p className="text-center text-blue-200 mb-16 max-w-2xl mx-auto">
                        Everything you need to grow your business in one place.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dashboardHighlights.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <item.icon className="w-8 h-8 text-primary-blue" />
                                <span className="font-medium text-lg">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What Makes Us Different */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-navy-dark dark:text-white text-center mb-12">
                        What Makes Us Different?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {differentiators.map((item, index) => (
                            <Card key={index} className="p-6 border-l-4 border-l-primary-blue">
                                <h3 className="text-xl font-bold text-navy-dark dark:text-white mb-2">{item.title}</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust & Safety + CTA */}
            <section className="py-24 px-4 bg-neutral-50 dark:bg-neutral-900">
                <div className="container mx-auto max-w-4xl text-center">
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-navy-dark dark:text-white mb-8">Trust and Safety</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {["Secure payments", "Protected transactions", "Clear terms", "Fast support"].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <ShieldCheckIcon className="w-8 h-8 text-success-green" />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary-blue to-violet-accent rounded-3xl p-10 md:p-16 text-white shadow-2xl">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Ready to Start Selling?
                        </h2>
                        <p className="text-xl mb-8 text-blue-50">
                            It only takes two minutes. Create your seller account and start listing deals today.
                        </p>
                        <Link href="/seller/signup">
                            <Button size="lg" className="bg-white text-primary-blue hover:bg-blue-50 font-bold px-10 py-5 text-lg shadow-lg">
                                Become a Seller
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
