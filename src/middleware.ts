import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextRequestWithAuth } from 'next-auth/middleware'

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

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/auth/:path*'
  ]
} 