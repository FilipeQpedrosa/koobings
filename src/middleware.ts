import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Get the current URL and hostname
  const currentUrl = new URL(request.url)
  const isStaffDomain = currentUrl.hostname.startsWith('staff.')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'yourapp.com'
  
  // Define route types
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth')
  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isStaffPath = request.nextUrl.pathname.startsWith('/staff') || 
                     request.nextUrl.pathname.startsWith('/business') ||
                     request.nextUrl.pathname.startsWith('/dashboard')

  // For local development, use ports
  if (process.env.NODE_ENV === 'development') {
    const isStaffPort = currentUrl.port === '5002'
    
    // Staff routes should only be accessed on port 5002
    if (isStaffPath && !isStaffPort) {
      currentUrl.port = '5002'
      return NextResponse.redirect(currentUrl)
    }

    // Non-staff routes should only be accessed on port 5001
    if (isStaffPort && !isStaffPath && !isAuthPage) {
      currentUrl.port = '5001'
      return NextResponse.redirect(currentUrl)
    }
  } else {
    // In production, use subdomains    
    // Staff routes should only be accessed on staff subdomain
    if (isStaffPath && !isStaffDomain) {
      return NextResponse.redirect(new URL(request.nextUrl.pathname, `https://staff.${baseUrl}`))
    }

    // Non-staff routes should only be accessed on main domain
    if (isStaffDomain && !isStaffPath && !isAuthPage) {
      return NextResponse.redirect(new URL(request.nextUrl.pathname, `https://${baseUrl}`))
    }
  }

  // Staff Portal Access Control
  if ((process.env.NODE_ENV === 'development' && currentUrl.port === '5002') || 
      (process.env.NODE_ENV === 'production' && isStaffDomain)) {
    // Redirect non-staff users to staff login
    if (!token || token.type !== 'staff') {
      if (!isAuthPage) {
        return NextResponse.redirect(new URL('/auth/staff/signin', request.url))
      }
      return NextResponse.next()
    }

    // Redirect authenticated staff away from auth pages
    if (isAuthPage && token.type === 'staff') {
      return NextResponse.redirect(new URL('/staff/dashboard', request.url))
    }
  }

  // Customer Portal Access Control
  if ((process.env.NODE_ENV === 'development' && currentUrl.port === '5001') || 
      (process.env.NODE_ENV === 'production' && !isStaffDomain)) {
    // Prevent staff users from accessing customer portal
    if (token?.type === 'staff') {
      const staffUrl = process.env.NODE_ENV === 'development' 
        ? new URL('/staff/dashboard', `${currentUrl.protocol}//${currentUrl.hostname}:5002`)
        : new URL('/staff/dashboard', `https://staff.${baseUrl}`)
      return NextResponse.redirect(staffUrl)
    }

    // Redirect authenticated customers away from auth pages
    if (isAuthPage && token && token.type === 'patient') {
      return NextResponse.redirect(new URL('/services', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/staff/:path*',
    '/auth/:path*',
    '/api/staff/:path*',
    '/api/client/:path*',
    '/api/patient/:path*',
    '/api/admin/:path*',
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ]
} 