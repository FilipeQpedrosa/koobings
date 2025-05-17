import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequestWithAuth } from 'next-auth/middleware'
import type { NextRequest } from 'next/server'
import { env } from './lib/env'
import { AuthService } from '@/services/auth'

const authService = new AuthService()

// Rate limiting maps
const ipMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = Number(env.RATE_LIMIT_DURATION) * 1000
  const limit = Number(env.RATE_LIMIT_REQUESTS)

  const requests = ipMap.get(ip) || []
  const windowStart = now - windowMs

  // Remove old requests
  const recentRequests = requests.filter(timestamp => timestamp > windowStart)
  
  // Add current request
  recentRequests.push(now)
  ipMap.set(ip, recentRequests)

  return recentRequests.length > limit
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const token = await getToken({ req: request })
    const isAuth = !!token
    const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
    const isApiRoute = request.nextUrl.pathname.startsWith('/api')
    
    // Handle public routes
    const publicRoutes = ['/']
    if (publicRoutes.includes(request.nextUrl.pathname)) {
      return NextResponse.next()
    }

    // Handle auth pages
    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.next()
    }

    // Protect API routes
    if (isApiRoute) {
      if (!isAuth) {
        return new NextResponse('Unauthorized', { status: 401 })
      }

      // Business-only routes
      const businessOnlyRoutes = [
        '/api/business',
        '/api/staff',
        '/api/categories',
        '/api/services'
      ]
      
      if (businessOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && 
          token.role !== 'business') {
        return new NextResponse('Forbidden', { status: 403 })
      }

      // Staff-only routes
      const staffOnlyRoutes = [
        '/api/appointments/staff',
        '/api/availability/staff'
      ]
      
      if (staffOnlyRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && 
          token.role !== 'staff') {
        return new NextResponse('Forbidden', { status: 403 })
      }

      return NextResponse.next()
    }

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }
      return NextResponse.next()
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/api/health',
  ]
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Get token from header
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }

  try {
    // Verify token and get user
    const user = await authService.verifyToken(token)

    // Check role-based access
    const roleRoutes: Record<string, string[]> = {
      '/api/admin': ['SUPER_ADMIN', 'ADMIN'],
      '/api/staff': ['OWNER', 'ADMIN'],
      '/api/reports': ['OWNER', 'ADMIN', 'PROVIDER'],
    }
    for (const [route, roles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route) && !roles.includes(user.role)) {
        return new NextResponse(
          JSON.stringify({ error: 'Insufficient permissions' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }
    }

    // For API routes that access sensitive data
    if (pathname.includes('/api/patients/') && pathname.includes('/sensitive')) {
      const patientId = pathname.split('/')[3] // Extract patient ID from URL
      const hasAccess = await authService.validateSensitiveDataAccess(
        user.id,
        patientId,
        user.businessId!
      )

      if (!hasAccess) {
        return new NextResponse(
          JSON.stringify({ error: 'Access to sensitive data denied' }),
          { status: 403, headers: { 'content-type': 'application/json' } }
        )
      }

      // Log access attempt
      await authService.createAccessLog(
        user.id,
        user.businessId!,
        patientId,
        'VIEW',
        'patient_sensitive_info',
        request.headers.get('x-access-reason') || 'No reason provided',
        true
      )
    }

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)
    requestHeaders.set('x-user-role', user.role)
    if (user.businessId) {
      requestHeaders.set('x-business-id', user.businessId)
    }

    // Continue with modified request
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 