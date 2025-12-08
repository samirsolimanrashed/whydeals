import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SUPERADMIN' }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Super Admin already exists' },
        { status: 403 }
      );
    }

    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'SUPERADMIN',
        verified: true,
        active: true,
        wallet: {
          create: {
            balance: 0,
            currency: 'USD'
          }
        }
      }
    });

    await prisma.adminSettings.create({
      data: {
        platformFeePercent: 10,
        minSellerPayout: 100,
        payoutFrequency: 'WEEKLY',
        allowNewSellers: true,
        allowNewDeals: true,
        maintenanceMode: false,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
        passwordExpireDays: 90,
        maxLoginAttempts: 5,
        lockoutDurationMinutes: 30
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Super Admin created successfully',
      user: {
        id: superAdmin.id,
        email: superAdmin.email,
        name: superAdmin.name,
        role: superAdmin.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Admin setup error:', error);
    return NextResponse.json(
      { error: 'Failed to create Super Admin' },
      { status: 500 }
    );
  }
}
