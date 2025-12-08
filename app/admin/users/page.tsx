'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'

interface User {
    id: string
    name: string | null
    email: string | null
    role: 'CUSTOMER' | 'SELLER' | 'SUPERADMIN'
    createdAt: string
    _count: {
        orders: number
        reviews: number
    }
}

export default function AdminUsersPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (status === 'authenticated') {
            if ((session?.user as any)?.role !== 'SUPERADMIN') {
                router.push('/')
            } else {
                fetchUsers()
            }
        }
    }, [status, session, router])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users')
            if (!res.ok) throw new Error('Failed to fetch users')
            const data = await res.json()
            setUsers(data.users)
        } catch (error) {
            console.error(error)
            toast.error('Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            })

            if (!res.ok) throw new Error('Failed to update role')

            toast.success('User role updated successfully')
            fetchUsers() // Refresh list
        } catch (error) {
            console.error(error)
            toast.error('Failed to update user role')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-8 flex justify-center">
                <p className="text-foreground/70">Loading users...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-navy-dark dark:text-foreground">User Management</h1>
                    <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>

                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-foreground/70">User</th>
                                    <th className="text-left p-4 font-semibold text-foreground/70">Role</th>
                                    <th className="text-left p-4 font-semibold text-foreground/70">Joined</th>
                                    <th className="text-left p-4 font-semibold text-foreground/70">Activity</th>
                                    <th className="text-left p-4 font-semibold text-foreground/70">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                                        <td className="p-4">
                                            <div>
                                                <p className="font-bold text-navy-dark dark:text-foreground">{user.name || 'No Name'}</p>
                                                <p className="text-sm text-foreground/60">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'SUPERADMIN' ? 'bg-primary-blue/10 text-primary-blue' :
                                                    user.role === 'SELLER' ? 'bg-violet-accent/10 text-violet-accent' :
                                                        'bg-neutral-100 dark:bg-neutral-700 text-foreground/70'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-foreground/70">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm text-foreground/70">
                                            <div>Orders: {user._count.orders}</div>
                                            <div>Reviews: {user._count.reviews}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {user.role !== 'SUPERADMIN' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleUpdate(user.id, 'SUPERADMIN')}
                                                        className="text-xs"
                                                    >
                                                        Make Admin
                                                    </Button>
                                                )}
                                                {user.role !== 'SELLER' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleUpdate(user.id, 'SELLER')}
                                                        className="text-xs"
                                                    >
                                                        Make Seller
                                                    </Button>
                                                )}
                                                {user.role !== 'CUSTOMER' && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleUpdate(user.id, 'CUSTOMER')}
                                                        className="text-xs"
                                                    >
                                                        Demote
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
