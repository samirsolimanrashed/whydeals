'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default function AccountPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Please Sign In</h1>
          <Link href="/auth/signin">
            <Button variant="primary" size="lg" className="w-full">
              Sign In
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="p-6 md:col-span-1">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Profile</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-neutral-600 text-sm">Name</p>
                <p className="font-semibold text-neutral-900">{session.user.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-neutral-600 text-sm">Email</p>
                <p className="font-semibold text-neutral-900">{session.user.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => signOut()}
              className="w-full"
            >
              Sign Out
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/customer/deals">
                <Button variant="outline" className="w-full text-left">
                  🎁 Browse Deals
                </Button>
              </Link>
              <Link href="/customer/checkout">
                <Button variant="outline" className="w-full text-left">
                  🛒 Checkout
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full text-left">
                  🏠 Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Purchase History */}
        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Purchase History</h2>
          <div className="text-center py-8 text-neutral-600">
            <p>No purchases yet</p>
            <Link href="/customer/deals" className="text-blue-600 font-semibold mt-2 inline-block">
              Start shopping →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
