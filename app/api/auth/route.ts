import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/auth/login - User login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (action === 'login') {
      // For MVP, return mock success. Replace with actual authentication later:
      // const user = await prisma.user.findUnique({
      //   where: { email },
      // })
      //
      // if (!user) {
      //   return NextResponse.json(
      //     { error: 'Invalid credentials' },
      //     { status: 401 }
      //   )
      //
      //   // Verify password (use bcrypt in production)
      //   const isValidPassword = await bcrypt.compare(password, user.password)
      //   if (!isValidPassword) {
      //     return NextResponse.json(
      //       { error: 'Invalid credentials' },
      //       { status: 401 }
      //     )
      //   }
      //
      //   // Generate JWT token
      //   const token = jwt.sign(
      //     { userId: user.id, email: user.email, role: user.role },
      //     process.env.JWT_SECRET!,
      //     { expiresIn: '7d' }
      //   )

      const user = {
        id: 'user-1',
        email,
        name: 'John Doe',
        role: 'CUSTOMER',
      }

      return NextResponse.json(
        { user, token: 'mock-jwt-token' },
        { status: 200 }
      )
    }

    if (action === 'register') {
      const { name, role = 'CUSTOMER' } = body

      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }

      // For MVP, return success. Replace with actual Prisma create later:
      // const existingUser = await prisma.user.findUnique({
      //   where: { email },
      // })
      //
      // if (existingUser) {
      //   return NextResponse.json(
      //     { error: 'User already exists' },
      //     { status: 400 }
      //   )
      //
      //   const hashedPassword = await bcrypt.hash(password, 10)
      //   const user = await prisma.user.create({
      //     data: {
      //       email,
      //       name,
      //       password: hashedPassword,
      //       role: role as UserRole,
      //     },
      //   })
      //
      //   const token = jwt.sign(
      //     { userId: user.id, email: user.email, role: user.role },
      //     process.env.JWT_SECRET!,
      //     { expiresIn: '7d' }
      //   )

      const user = {
        id: `user-${Date.now()}`,
        email,
        name,
        role,
      }

      return NextResponse.json(
        { user, token: 'mock-jwt-token' },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "login" or "register"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in auth:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

