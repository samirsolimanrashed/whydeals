'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Provider {
  id: string;
  businessName: string;
  businessEmail: string;
  approved: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalDeals: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.role !== 'SUPERADMIN' && session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        const providersRes = await fetch('/api/admin/providers');
        const providersData = await providersRes.json();
        setProviders(providersData.data || []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  const handleApproveProvider = async (providerId: string) => {
    try {
      const response = await fetch(`/api/admin/providers/${providerId}/approve`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setProviders(prev =>
          prev.map(p => p.id === providerId ? { ...p, approved: true } : p)
        );
      }
    } catch (error) {
      console.error('Failed to approve provider:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <p className="text-neutral-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Admin Dashboard</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-neutral-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </Card>
            <Card className="p-6">
              <p className="text-neutral-600 text-sm mb-2">Total Providers</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalProviders}</p>
            </Card>
            <Card className="p-6">
              <p className="text-neutral-600 text-sm mb-2">Total Deals</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalDeals}</p>
            </Card>
            <Card className="p-6">
              <p className="text-neutral-600 text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-orange-600">${stats.totalRevenue.toFixed(2)}</p>
            </Card>
          </div>
        )}

        <Card className="p-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Providers Management</h2>
          
          {providers.length === 0 ? (
            <p className="text-neutral-600">No providers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">Business Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map(provider => (
                    <tr key={provider.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                      <td className="py-3 px-4 text-neutral-900">{provider.businessName}</td>
                      <td className="py-3 px-4 text-neutral-600">{provider.businessEmail}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          provider.approved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {provider.approved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {!provider.approved && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleApproveProvider(provider.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

