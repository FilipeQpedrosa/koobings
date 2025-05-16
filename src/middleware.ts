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

  // In production, use subdomains    
  if (process.env.NODE_ENV === 'production') {
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
  if (isStaffPath) {
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
  if (!isStaffPath) {
    // Prevent staff users from accessing customer portal
    if (token?.type === 'staff') {
      return NextResponse.redirect(new URL('/staff/dashboard', request.url))
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
} 