import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'SUPERADMIN' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, totalProviders, totalDeals, purchases] = await Promise.all([
      prisma.user.count(),
      prisma.providerProfile.count(),
      prisma.deal.count(),
      prisma.purchase.findMany({
        where: { status: 'PAID' },
        select: { total: true }
      })
    ]);

    const totalRevenue = purchases.reduce((sum, p) => sum + p.total, 0);

    return NextResponse.json({
      totalUsers,
      totalProviders,
      totalDeals,
      totalRevenue
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
