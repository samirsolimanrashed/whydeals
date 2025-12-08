'use client'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [pendingDeals, setPendingDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Failed to fetch stats')
        const data = await res.json()
        setStats(data.stats)
        setRecentUsers(data.recentUsers)
        setPendingDeals(data.pendingDeals)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleApproveDeal = async (dealId: string) => {
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' }),
      })
      if (!res.ok) throw new Error('Failed to approve deal')
      toast.success('Deal approved')
      // Refresh data
      setPendingDeals(pendingDeals.filter(d => d.id !== dealId))
    } catch (error) {
      toast.error('Failed to approve deal')
    }
  }

  const handleRejectDeal = async (dealId: string) => {
    try {
      const res = await fetch(`/api/admin/deals/${dealId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      })
      if (!res.ok) throw new Error('Failed to reject deal')
      toast.success('Deal rejected')
      setPendingDeals(pendingDeals.filter(d => d.id !== dealId))
    } catch (error) {
      toast.error('Failed to reject deal')
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-navy-dark p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">Super Admin</h1>
            <p className="text-foreground/70">Platform Overview</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/users">
              <Button variant="outline" size="sm">Manage Users</Button>
            </Link>
            <Link href="/admin/deals">
              <Button variant="outline" size="sm">Manage All Deals</Button>
            </Link>
            <Link href="/coming-soon">
              <Button variant="primary" size="sm">Settings</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 dark:bg-navy-dark dark:border-neutral-700">
              <p className="text-sm font-medium text-foreground/70">{stat.label}</p>
              <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
              <p className="text-xs text-foreground/60 mt-2">
                <span className="text-success-green font-bold">{stat.change}</span> vs last month
              </p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <Card className="p-6 dark:bg-navy-dark dark:border-neutral-700">
            <h2 className="text-xl font-bold text-navy-dark dark:text-foreground mb-4">New Users</h2>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-lg">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full" /> : user.name?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-navy-dark dark:text-foreground">{user.name || 'Unnamed User'}</p>
                      <p className="text-xs text-foreground/70">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary-blue/10 text-primary-blue px-2 py-1 rounded">{user.role}</span>
                </div>
              ))}
              {recentUsers.length === 0 && <p className="text-foreground/50 text-center py-4">No recent users</p>}
            </div>
          </Card>

          {/* Pending Approvals (Deals) */}
          <Card className="p-6 dark:bg-navy-dark dark:border-neutral-700">
            <h2 className="text-xl font-bold text-navy-dark dark:text-foreground mb-4">Pending Deals</h2>
            <div className="space-y-4">
              {pendingDeals.map((deal) => (
                <div key={deal.id} className="p-3 border border-warning-orange/20 bg-warning-orange/5 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-bold text-navy-dark dark:text-foreground">{deal.title}</p>
                    <p className="text-xs text-foreground/70">Seller: {deal.seller?.businessName || 'Unknown'}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-error-red border-error-red hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => handleRejectDeal(deal.id)}>Reject</Button>
                    <Button variant="primary" size="sm" className="bg-success-green hover:bg-green-600 border-none" onClick={() => handleApproveDeal(deal.id)}>Approve</Button>
                  </div>
                </div>
              ))}
              {pendingDeals.length === 0 && <p className="text-foreground/50 text-center py-4">No pending deals</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
