'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Why Deals
          </Link>

          <div className="flex space-x-6">
            <Link
              href="/"
              className={`${
                pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition`}
            >
              Home
            </Link>
            <Link
              href="/provider/dashboard"
              className={`${
                pathname?.startsWith('/provider') ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition`}
            >
              Provider
            </Link>
            <Link
              href="/provider/onboarding"
              className={`${
                pathname?.startsWith('/provider/onboarding') ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition`}
            >
              Become Provider
            </Link>
            <Link
              href="/admin/dashboard"
              className={`${
                pathname?.startsWith('/admin') ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition`}
            >
              Admin
            </Link>
            <Link
              href="/customer/account"
              className={`${
                pathname?.startsWith('/customer/account') ? 'text-blue-600 font-semibold' : 'text-gray-700'
              } hover:text-blue-600 transition`}
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

