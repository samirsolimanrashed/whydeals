'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChartBarIcon, PlusCircleIcon, ClipboardDocumentListIcon, CurrencyDollarIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'

const sidebarLinks = [
    { name: 'Dashboard', href: '/seller/dashboard', Icon: ChartBarIcon },
    { name: 'Create Deal', href: '/seller/deals/create', Icon: PlusCircleIcon },
    { name: 'Manage Deals', href: '/seller/deals/manage', Icon: ClipboardDocumentListIcon },
    { name: 'Orders', href: '/seller/orders', Icon: ShoppingBagIcon },
    { name: 'Earnings', href: '/seller/earnings', Icon: CurrencyDollarIcon },
]

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-neutral-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-surface dark:bg-navy-dark border-r border-neutral-200 hidden md:block pt-20 flex-shrink-0">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-navy-dark mb-6">Seller Center</h2>
                    <nav className="space-y-2">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-blue/10 text-primary-blue font-medium'
                                        : 'text-foreground/70 hover:bg-neutral-50 hover:text-navy-dark'
                                        }`}
                                >
                                    <link.Icon className="w-5 h-5" />
                                    {link.name}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 w-full p-6 border-t border-neutral-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-accent flex items-center justify-center text-foreground font-bold">
                            S
                        </div>
                        <div>
                            <p className="text-sm font-medium text-navy-dark">Seller Account</p>
                            <p className="text-xs text-foreground/70">View Profile</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pt-8 px-6 pb-12">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
