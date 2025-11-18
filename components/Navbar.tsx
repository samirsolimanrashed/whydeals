'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Button } from './ui/Button'

type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN' | 'SUPERADMIN' | null

export default function Navbar() {
  const { data: session, status } = useSession()
  const [role, setRole] = useState<UserRole>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user role from database
  useEffect(() => {
    if (!session?.user) {
      setRole(null)
      setLoading(false)
      return
    }

    const fetchRole = async () => {
      try {
        const res = await fetch('/api/auth/user-role', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        setRole(data.role || 'CUSTOMER')
      } catch (error) {
        console.error('Failed to fetch user role:', error)
        setRole('CUSTOMER')
      } finally {
        setLoading(false)
      }
    }

    fetchRole()
  }, [session])

  // Render CTA button based on role
  const renderCTA = () => {
    // 1) Not logged in → Show "Sell Your Deal"
    if (status === 'unauthenticated') {
      return (
        <Link
          href="/auth/signup"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
        >
          Sell Your Deal
        </Link>
      )
    }

    // Loading state
    if (loading) {
      return (
        <Button variant="primary" size="sm" disabled>
          Loading...
        </Button>
      )
    }

    // 2) Admin/SuperAdmin → Admin Dashboard
    if (role === 'SUPERADMIN' || role === 'ADMIN') {
      return (
        <Link
          href="/admin/dashboard"
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium transition-colors"
        >
          Admin Dashboard
        </Link>
      )
    }

    // 3) Provider → Partner Dashboard
    if (role === 'PROVIDER') {
      return (
        <Link
          href="/provider/dashboard"
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition-colors"
        >
          Partner Dashboard
        </Link>
      )
    }

    // 4) Customer → Show Sell Your Deal CTA
    if (role === 'CUSTOMER') {
      return (
        <Link
          href="/auth/signup"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
        >
          Sell Your Deal
        </Link>
      )
    }
  }

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎁</span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-pink-700 transition-all">
            Why Deals
          </h1>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-neutral-600 hover:text-blue-600 font-medium transition-colors"
          >
            Deals
          </Link>

          {/* My Account — only if logged in */}
          {session?.user && (
            <Link
              href="/customer/account"
              className="text-neutral-600 hover:text-blue-600 font-medium transition-colors"
            >
              My Account
            </Link>
          )}

          {/* CTA Button Logic */}
          {renderCTA()}

          {/* Auth Section */}
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-neutral-600 text-sm">
                {session.user.name || session.user.email}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

