'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { useCart } from '@/context/CartContext'
import Logo from './Logo'


type UserRole = 'CUSTOMER' | 'SELLER' | 'ADMIN' | 'SUPERADMIN' | null

export default function Navbar() {
  const { data: session, status } = useSession()
  const { totalItems } = useCart()
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
    // 1) Not logged in → Show "Become a Seller"
    if (status === 'unauthenticated') {
      return (
        <Link href="/become-seller">
          <Button variant="primary" size="sm">
            Become a Seller
          </Button>
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
        <Link href="/admin/dashboard">
          <Button variant="accent" size="sm">
            Admin Dashboard
          </Button>
        </Link>
      )
    }

    // 3) Seller → Seller Dashboard
    if (role === 'SELLER') {
      return (
        <Link href="/seller/dashboard">
          <Button variant="accent" size="sm">
            Seller Dashboard
          </Button>
        </Link>
      )
    }

    // 4) Customer → Show "Become a Seller" CTA
    if (role === 'CUSTOMER') {
      return (
        <Link href="/become-seller">
          <Button variant="primary" size="sm">
            Become a Seller
          </Button>
        </Link>
      )
    }
  }

  return (
    <nav className="border-b border-neutral-300 dark:border-neutral-700 sticky top-0 z-50 shadow-sm bg-background backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-10 w-40 relative">
            <Logo className="w-full h-full" />
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground hover:text-primary-blue font-medium transition-colors"
          >
            Deals
          </Link>

          {/* My Account — only if logged in */}
          {session?.user && (
            <Link
              href="/customer/account"
              className="text-foreground hover:text-primary-blue font-medium transition-colors"
            >
              My Account
            </Link>
          )}




          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-foreground hover:text-primary-blue transition-colors group">
            <ShoppingCartIcon className="h-6 w-6 text-foreground group-hover:text-primary-blue transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-error-red text-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-foreground">
                {totalItems}
              </span>
            )}
          </Link>

          {/* CTA Button Logic */}
          {renderCTA()}

          {/* Auth Section */}
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-foreground/70 text-sm hidden md:block">
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

