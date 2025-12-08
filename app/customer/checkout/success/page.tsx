'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      // Optional: Verify session status via API if needed
      toast.success('Payment successful!')
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex justify-center items-center">
      <Card className="max-w-md w-full p-8 text-center dark:bg-navy-dark dark:border-neutral-700">
        <div className="w-20 h-20 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground mb-4">Payment Successful!</h1>
        <p className="text-foreground/70 mb-8">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>

        <div className="space-y-4">
          <Link href="/customer/account">
            <Button variant="primary" size="lg" className="w-full">
              View My Orders
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="lg" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
