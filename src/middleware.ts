import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { env } from './lib/env'

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

// Define protected routes patterns
const protectedRoutes = {
  business: /^\/portals\/business\/.*/,
  staff: /^\/portals\/staff\/.*/,
  admin: /^\/portals\/admin\/.*/,
  api: /^\/api\/v1\/.*/,
}

// Define public routes that don't need authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/api/auth',
  '/api/health',
  '/',
]

// Configure role-based path access
const roleBasedPaths = {
  ADMIN: ['/portals/admin'],
  BUSINESS: ['/portals/business'],
  STAFF: ['/portals/staff'],
} as const;

type UserRole = keyof typeof roleBasedPaths;

function isPublicPath(path: string): boolean {
  return publicRoutes.some(route => path.startsWith(route)) ||
         path.startsWith('/_next') ||
         path.includes('favicon.ico');
}

function hasPathAccess(role: UserRole, path: string): boolean {
  const allowedPaths = roleBasedPaths[role] || [];
  return allowedPaths.some(prefix => path.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes and static files
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Apply rate limiting
  const ip = request.ip || 'unknown'
  if (isRateLimited(ip)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // Get the token and check authentication
  const token = await getToken({ req: request })

  // If no token and trying to access protected route, redirect to signin
  if (!token) {
    if (Object.values(protectedRoutes).some(pattern => pattern.test(pathname))) {
      const signInUrl = new URL('/auth/signin', request.url)
      signInUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
  }

  // Check role-based access
  const userRole = token.role as UserRole
  if (!hasPathAccess(userRole, pathname)) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/portals/admin/dashboard', request.url))
      case 'BUSINESS':
        return NextResponse.redirect(new URL('/portals/business/dashboard', request.url))
      case 'STAFF':
        return NextResponse.redirect(new URL('/portals/staff/dashboard', request.url))
      default:
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Add security headers and user info
  const headers = new Headers(request.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  )

  // Add user info for API routes
  if (pathname.startsWith('/api/')) {
    headers.set('x-user-id', token.sub as string)
    headers.set('x-user-role', token.role as string)
  }

  // Continue with added headers
  return NextResponse.next({
    request: {
      headers,
    },
  })
}

export const config = {
  matcher: [
    '/portals/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 