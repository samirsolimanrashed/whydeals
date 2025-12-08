import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define role hierarchy
const ROLE_HIERARCHY = {
    SUPERADMIN: 4,
    ADMIN: 3,
    SELLER: 2,
    CUSTOMER: 1,
}

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
    '/admin': ['SUPERADMIN', 'ADMIN'],
    '/seller': ['SELLER', 'SUPERADMIN'],
    '/customer': ['CUSTOMER', 'SELLER', 'SUPERADMIN'],
}

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    })

    const { pathname } = request.nextUrl

    // Allow public routes
    if (
        pathname.startsWith('/auth') ||
        pathname.startsWith('/api/auth') ||
        pathname === '/' ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static')
    ) {
        return NextResponse.next()
    }

    // Redirect /provider to /seller
    if (pathname.startsWith('/provider')) {
        const newUrl = new URL(pathname.replace('/provider', '/seller'), request.url)
        return NextResponse.redirect(newUrl)
    }

    // Check if route is protected
    const protectedRoute = Object.keys(PROTECTED_ROUTES).find((route) =>
        pathname.startsWith(route)
    )

    if (protectedRoute) {
        // User must be authenticated
        if (!token) {
            const url = new URL('/auth/signin', request.url)
            url.searchParams.set('callbackUrl', pathname)
            return NextResponse.redirect(url)
        }

        // Check if user has required role
        const allowedRoles = PROTECTED_ROUTES[protectedRoute as keyof typeof PROTECTED_ROUTES]
        const userRole = token.role as string

        if (!allowedRoles.includes(userRole)) {
            // Redirect to appropriate dashboard based on role
            let redirectPath = '/'

            if (userRole === 'SUPERADMIN' || userRole === 'ADMIN') {
                redirectPath = '/admin/dashboard'
            } else if (userRole === 'SELLER') {
                redirectPath = '/seller/dashboard'
            } else if (userRole === 'CUSTOMER') {
                redirectPath = '/customer/deals'
            }

            return NextResponse.redirect(new URL(redirectPath, request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
