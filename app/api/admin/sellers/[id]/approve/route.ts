import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user?.role !== 'SUPERADMIN' && session.user?.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const seller = await prisma.sellerProfile.update({
      where: { id: params.id },
      data: {
        approved: true,
        verifiedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Seller approved',
      data: seller
    });

  } catch (error) {
    console.error('Approve provider error:', error);
    return NextResponse.json({ error: 'Failed to approve provider' }, { status: 500 });
  }
}
