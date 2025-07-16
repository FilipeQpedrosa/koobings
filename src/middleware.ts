import { NextRequest, NextResponse } from 'next/server'
import { getRequestAuthUser } from '@/lib/jwt-safe'

/**
 * Extract business slug from pathname (simplified version for middleware)
 */
function extractBusinessSlug(pathname: string): string | null {
  // Match patterns like /business-slug/staff/dashboard
  const match = pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
  return match ? match[1] : null;
}

/**
 * Check if slug has valid format (letters, numbers, hyphens)
 */
function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && slug.length >= 2 && slug.length <= 50;
}

/**
 * Check if business exists in database using edge-compatible fetch
 */
async function businessExists(slug: string, request: NextRequest): Promise<boolean> {
  try {
    // Use the internal API endpoint to check business existence
    const baseUrl = request.nextUrl.origin;
    const response = await fetch(`${baseUrl}/api/business/by-slug/${slug}`, {
      method: 'HEAD', // Only check if exists, don't need the data
      headers: {
        'x-middleware-check': 'true' // Flag to identify middleware requests
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('❌ Middleware: Error checking business existence:', error);
    return false; // Fail closed - if we can't check, deny access
  }
}

// Define public routes that don't need authentication
const publicRoutes = [
  '/',
  '/book',
  '/auth/signin',
  '/auth/signup',
  '/auth/admin-signin',
  '/api/auth',
  '/api/health',
  '/api/debug-auth',
  '/api/debug-auth-flow',
  '/api/test-admin',
  '/api/admin/fix-password',
  '/api/simple-test',
  '/api/test-nextauth',
  '/api/business/by-slug', // Allow business lookup for signin pages
  '/api/client', // Allow client API endpoints
  '/api/public', // Allow all public API endpoints
  '/api/debug-user-data', // Allow debug endpoint
]

function isPublicRoute(path: string): boolean {
  // Check exact matches first
  if (publicRoutes.includes(path)) {
    return true;
  }
  
  // Check if starts with public routes
  if (publicRoutes.some(route => path.startsWith(route))) {
    return true;
  }
  
  // Also allow business auth signin pages
  if (path.match(/^\/[^\/]+\/auth\/signin$/)) {
    return true;
  }
  
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('🛡️ Middleware checking:', pathname);

  // Skip middleware for API routes and static assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Allow public routes without any checks
  if (isPublicRoute(pathname)) {
    console.log('✅ Public route allowed:', pathname);
    return NextResponse.next();
  }

  // ✅ Check if it's a dynamic business route (PROTECTED)
  const businessSlug = extractBusinessSlug(pathname);
  if (businessSlug) {
    console.log('🏢 Business route detected:', businessSlug);
    
    // Basic validation: check if slug format is valid
    if (!isValidSlugFormat(businessSlug)) {
      console.log('❌ Invalid business slug format');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    console.log('✅ Business slug format is valid:', businessSlug);
    
    // 🚀 NEW: Check if business exists in database
    const exists = await businessExists(businessSlug, request);
    if (!exists) {
      console.log('❌ Business does not exist in database:', businessSlug);
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    console.log('✅ Business exists in database:', businessSlug);
    
    // Get the JWT token using centralized helper
    const user = getRequestAuthUser(request);
    console.log('🎫 JWT Token status:', !!user);

    // Redirect to login if no token
    if (!user) {
      console.log('❌ No valid JWT token found, redirecting to login');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
    
    // Check if user has access to this specific business
    console.log('🔍 User business slug:', user.businessSlug);
    console.log('🔍 Requested business slug:', businessSlug);
    console.log('🔍 User role:', user.role);
    console.log('🔍 User isAdmin:', user.isAdmin);
    
    // Allow access if:
    // 1. User belongs to this business (businessSlug matches)
    // 2. User is a SYSTEM ADMIN (role === 'ADMIN') - can access all businesses
    // Note: Business owners (BUSINESS_OWNER) can only access their own business
    const hasSystemAdminAccess = user.role === 'ADMIN' && user.isAdmin;
    const hasBusinessAccess = user.businessSlug === businessSlug;
    
    // 🚨 CRITICAL SECURITY FIX: Additional validation for business users
    if (!hasSystemAdminAccess && !hasBusinessAccess) {
      console.log('❌ SECURITY VIOLATION: User trying to access wrong business!');
      console.log('❌ User email:', user.email);
      console.log('❌ User businessSlug:', user.businessSlug);
      console.log('❌ Requested businessSlug:', businessSlug);
      console.log('❌ User role:', user.role);
      
      // Force logout and redirect to emergency cleanup
      const cleanupUrl = new URL('/api/auth/emergency-cleanup', request.url);
      return NextResponse.redirect(cleanupUrl);
    }
    
    if (hasBusinessAccess || hasSystemAdminAccess) {
      console.log('✅ User has access to business:', businessSlug);
      if (hasSystemAdminAccess) {
        console.log('🔐 System admin access granted');
      } else {
        console.log('🏢 Business member access granted');
      }
      return NextResponse.next();
    } else {
      console.log('❌ User does not have access to business:', businessSlug);
      console.log('❌ User businessSlug:', user.businessSlug);
      console.log('❌ User role:', user.role);
      console.log('❌ User isAdmin:', user.isAdmin);
      console.log('❌ hasSystemAdminAccess:', hasSystemAdminAccess);
      console.log('❌ hasBusinessAccess:', hasBusinessAccess);
      
      // Redirect to their own business dashboard if they have one
      if (user.businessSlug) {
        const redirectUrl = `/${user.businessSlug}/staff/dashboard`;
        console.log('🔄 Redirecting to user own business:', redirectUrl);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      } else {
        // No business assigned, redirect to emergency cleanup
        return NextResponse.redirect(new URL('/api/auth/emergency-cleanup', request.url));
      }
    }
  }

  // ✅ Check admin routes
  if (pathname.startsWith('/admin')) {
    const user = getRequestAuthUser(request);
    if (!user || (user.role !== 'ADMIN' || !user.isAdmin)) {
      console.log('❌ Admin access denied');
      return NextResponse.redirect(new URL('/auth/admin-signin', request.url));
    }
    console.log('✅ Admin access granted');
    return NextResponse.next();
  }

  // For all other routes, check authentication
  const user = getRequestAuthUser(request);
  if (!user) {
    console.log('❌ No authentication for protected route');
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  console.log('✅ Allowing route:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 