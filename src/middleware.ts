import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from 'next/server'

// Rate limiting maps
const ipMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 60 seconds
  const limit = 100 // 100 requests per minute

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
  admin: /^\/admin\/.*/,
  api: /^\/api\/v1\/.*/,
}

// Define public routes that don't need authentication
const publicRoutes = [
  '/auth/signin',
  '/auth/signup',
  '/auth/admin-signin', // ALLOW EVERYONE TO ACCESS ADMIN SIGNIN PAGE
  '/api/auth',
  '/api/health',
  '/api/debug-auth',
  '/api/debug-auth-flow', // Debug endpoint for testing NextAuth flow
  '/api/test-admin',
  '/api/admin/fix-password',
  '/api/simple-test',
  '/api/test-nextauth',
  '/',
]

// Configure role-based path access
const roleBasedPaths = {
  ADMIN: ['/admin'],
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

// Business slug to businessId mapping
const BUSINESS_SLUGS: Record<string, string> = {
  'barbearia-orlando': 'cmckxlexv0000js04ehmx88dq',
  'ju-unha': 'cmckxlgcd0004js04sh2db333',
};

export default withAuth(
  async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    console.log('🔒 [Middleware] Path:', pathname);
    console.log('🔒 [Middleware] Token exists:', !!token);
    
    if (token) {
      console.log('🔒 [Middleware] User:', {
        name: token.name,
        role: token.role,
        businessId: token.businessId,
        businessName: token.businessName
      });
    }

    // ============================================
    // CRITICAL SECURITY: ADMIN PORTAL PROTECTION
    // ============================================
    
    // Block ONLY admin dashboard/routes for non-admin users
    // But ALLOW everyone to access the admin-signin page
    if (pathname.startsWith('/admin/')) {
      console.log('🚨 [Middleware] ADMIN ROUTE ACCESS ATTEMPT');
      console.log('🚨 [Middleware] User role:', token?.role);
      console.log('🚨 [Middleware] User email:', token?.email);
      
      // Only allow access if user is ADMIN role AND authorized email
      if (token?.role !== 'ADMIN' || token?.email !== 'f.queirozpedrosa@gmail.com') {
        console.log('❌ [Middleware] BLOCKING ADMIN ACCESS - Unauthorized user');
        console.log('❌ [Middleware] Required: role=ADMIN AND email=f.queirozpedrosa@gmail.com');
        console.log('❌ [Middleware] Actual: role=' + token?.role + ' AND email=' + token?.email);
        
        // CRITICAL: NEVER redirect admin routes to /auth/signin
        // Always redirect to /auth/admin-signin to maintain admin flow
        console.log('🔄 [Middleware] Redirecting to ADMIN SIGNIN (not staff signin)');
        const response = NextResponse.redirect(new URL('/auth/admin-signin?error=admin_access_denied', req.url));
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        return response;
      }
      
      console.log('✅ [Middleware] Admin access granted to authorized user');
      return NextResponse.next();
    }
    
    // ALLOW admin-signin page for everyone (staff will be redirected by the page itself)
    if (pathname === '/auth/admin-signin') {
      console.log('🔓 [Middleware] Allowing access to admin-signin page');
      return NextResponse.next();
    }

    // ============================================
    // BUSINESS-SPECIFIC SECURITY
    // ============================================
    
    // Handle business-specific routes
    const businessRouteMatch = pathname.match(/^\/([^\/]+)\/staff/);
    if (businessRouteMatch) {
      const businessSlug = businessRouteMatch[1];
      console.log('🔒 [Middleware] Business slug:', businessSlug);
      
      const expectedBusinessId = BUSINESS_SLUGS[businessSlug];
      console.log('🔒 [Middleware] Expected businessId:', expectedBusinessId);
      console.log('🔒 [Middleware] Session businessId:', token?.businessId);
      
      if (!expectedBusinessId) {
        console.log('❌ [Middleware] Unknown business slug, redirecting to signin');
        return NextResponse.redirect(new URL('/auth/signin?error=unknown_business', req.url));
      }
      
      if (token?.businessId !== expectedBusinessId) {
        console.log('❌ [Middleware] Business ID mismatch - SECURITY VIOLATION!');
        console.log('❌ [Middleware] Expected:', expectedBusinessId);
        console.log('❌ [Middleware] Actual:', token?.businessId);
        
        // Force logout and redirect
        const response = NextResponse.redirect(new URL('/auth/signin?error=business_mismatch', req.url));
        response.cookies.delete('next-auth.session-token');
        response.cookies.delete('__Secure-next-auth.session-token');
        return response;
      }
      
      console.log('✅ [Middleware] Business access validated');
      return NextResponse.next();
    }
    
    // Handle legacy /staff routes - redirect to business-specific routes
    if (pathname.startsWith('/staff/')) {
      console.log('🔄 [Middleware] Legacy staff route detected');
      
      if (token?.businessId) {
        // Find business slug for this user
        const businessSlug = Object.keys(BUSINESS_SLUGS).find(
          slug => BUSINESS_SLUGS[slug] === token.businessId
        );
        
        if (businessSlug) {
          const newPath = pathname.replace('/staff/', `/${businessSlug}/staff/`);
          console.log('🔄 [Middleware] Redirecting to business-specific route:', newPath);
          return NextResponse.redirect(new URL(newPath, req.url));
        }
      }
      
      console.log('❌ [Middleware] Cannot determine business for staff route');
      return NextResponse.redirect(new URL('/auth/signin?error=business_required', req.url));
    }
    
    // Handle authenticated users accessing signin pages
    if (token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      console.log('🔄 [Middleware] Authenticated user accessing signin, role:', token.role);
      
      if (token.role === 'ADMIN') {
        console.log('🔄 [Middleware] Redirecting admin to admin dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else if (token.role === 'STAFF' && token.businessId) {
        console.log('🔄 [Middleware] Redirecting staff to business dashboard');
        
        // Find business slug for this user
        const businessSlug = Object.keys(BUSINESS_SLUGS).find(
          slug => BUSINESS_SLUGS[slug] === token.businessId
        );
        
        if (businessSlug) {
          const redirectUrl = `/${businessSlug}/staff/dashboard`;
          console.log('🔄 [Middleware] Redirecting staff to business dashboard:', redirectUrl);
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }

    // SPECIAL CASE: Handle authenticated users accessing admin-signin page
    if (token && pathname === '/auth/admin-signin') {
      console.log('🔄 [Middleware] Authenticated user accessing admin-signin, role:', token.role);
      
      if (token.role === 'ADMIN' && token.email === 'f.queirozpedrosa@gmail.com') {
        console.log('🔄 [Middleware] Redirecting authenticated admin to admin dashboard');
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else if (token.role === 'STAFF' && token.businessId) {
        console.log('🔄 [Middleware] Redirecting staff to business dashboard');
        
        // Find business slug for this user
        const businessSlug = Object.keys(BUSINESS_SLUGS).find(
          slug => BUSINESS_SLUGS[slug] === token.businessId
        );
        
        if (businessSlug) {
          const redirectUrl = `/${businessSlug}/staff/dashboard`;
          console.log('🔄 [Middleware] Redirecting staff to business dashboard:', redirectUrl);
          return NextResponse.redirect(new URL(redirectUrl, req.url));
        }
      }
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to public pages (including admin-signin)
        if (pathname.startsWith('/auth/') || 
            pathname.startsWith('/api/auth/') ||
            pathname === '/' ||
            pathname.startsWith('/about') ||
            pathname.startsWith('/privacy') ||
            pathname.startsWith('/terms') ||
            pathname.startsWith('/book') ||
            pathname.startsWith('/api/health') ||
            pathname.startsWith('/_next') ||
            pathname.startsWith('/favicon')) {
          return true;
        }
        
        // All other routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 