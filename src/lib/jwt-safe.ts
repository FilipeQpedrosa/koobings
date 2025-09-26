import { verify, sign } from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

if (!JWT_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required');
}

export interface JWTPayload {
  id?: string;
  userId?: string; // For backward compatibility
  email: string;
  name: string;
  role: 'ADMIN' | 'BUSINESS_OWNER' | 'STAFF' | 'CUSTOMER';
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  staffRole?: 'ADMIN' | 'STANDARD' | 'MANAGER';
  isAdmin: boolean;
  permissions?: string[];
  iat?: number;
  exp?: number;
}

/**
 * Create a JWT token
 */
export function createJWTToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Safe JWT verification that handles malformed tokens gracefully
 */
export function verifyJWTToken(token: string): JWTPayload | null {
  try {
    // 🛡️ SAFETY: Basic format validation before JWT verification
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      return null;
    }
    
    const decoded = verify(token, JWT_SECRET) as JWTPayload;
    
    // Normalize user ID for backward compatibility
    if (decoded.userId && !decoded.id) {
      decoded.id = decoded.userId;
    }
    
    // Set isAdmin based on role
    if (decoded.isAdmin === undefined) {
      decoded.isAdmin = decoded.role === 'ADMIN';
    }
    
    return decoded;
  } catch (error) {
    // Silently handle malformed tokens to prevent authentication disruption
    return null;
  }
}

/**
 * Get authenticated user from cookies (server-side only)
 */
export async function getServerAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    
    // Try admin token first for admin access
    let token = cookieStore.get('admin-auth-token')?.value;
    if (token) {
      const user = verifyJWTToken(token);
      if (user) return user;
    }

    // Try business token
    token = cookieStore.get('business-auth-token')?.value;
    if (token) {
      const user = verifyJWTToken(token);
      if (user) return user;
    }

    // Try legacy auth token
    token = cookieStore.get('auth-token')?.value;
    if (token) {
      const user = verifyJWTToken(token);
      if (user) return user;
    }

    return null;
  } catch (error) {
    console.error('❌ Server auth verification failed:', error);
    return null;
  }
}

/**
 * Safe token verification helper
 */
function safeVerifyToken(token: string | undefined): JWTPayload | null {
  if (!token) return null;
  return verifyJWTToken(token);
}

/**
 * Get authenticated user from NextRequest with context awareness
 */
export function getRequestAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const pathname = request.nextUrl.pathname;
    
    // Helper function to get token from cookies or Authorization header
    const getToken = (cookieName: string) => {
      // First try cookie
      const cookieToken = request.cookies.get(cookieName)?.value;
      if (cookieToken) return cookieToken;
      
      // Then try Authorization header (only if no cookie found)
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
      
      return null;
    };
    
    // Helper function to get any token from Authorization header
    const getAuthToken = () => {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
      }
      return null;
    };
    
    // 🚨 For admin routes, ONLY check admin token
    if (pathname.startsWith('/admin')) {
      const adminToken = getToken('admin-auth-token');
      const user = safeVerifyToken(adminToken);
      if (user && user.role === 'ADMIN') {
        return user;
      }
      return null;
    }
    
    // 🚨 For business routes, prioritize business tokens first
    const businessSlugMatch = pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
    if (businessSlugMatch) {
      const businessSlug = businessSlugMatch[1];
      
      // First try Authorization header token
      const authToken = getAuthToken();
      if (authToken) {
        const user = safeVerifyToken(authToken);
        if (user && (user.businessSlug === businessSlug || user.businessId)) {
          return user;
        }
      }
      
      // Then try business and auth tokens from cookies
      const businessTokens = [
        getToken('business-auth-token'),
        getToken('auth-token')
      ];
      
      for (const token of businessTokens) {
        const user = safeVerifyToken(token);
        if (user && (user.businessSlug === businessSlug || user.businessId)) {
          return user;
        }
      }
      
      // Only if no business token works, check admin access
      const adminToken = getToken('admin-auth-token');
      const adminUser = safeVerifyToken(adminToken);
      if (adminUser && adminUser.role === 'ADMIN' && adminUser.isAdmin) {
        // Admin accessing business route - clear business data to prevent contamination
        return {
          ...adminUser,
          businessId: undefined,
          businessName: undefined,
          businessSlug: undefined
        };
      }
      
      return null;
    }
    
    // For API routes and other paths, try ALL tokens including admin
    // First try Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const authToken = authHeader.substring(7);
      const user = safeVerifyToken(authToken);
      if (user) return user;
    }
    
    // Then try cookies
    const tokens = [
      request.cookies.get('admin-auth-token')?.value,
      request.cookies.get('business-auth-token')?.value,
      request.cookies.get('auth-token')?.value
    ];
    
    for (const token of tokens) {
      const user = safeVerifyToken(token);
      if (user) return user;
    }

    return null;
  } catch (error) {
    console.error('❌ Request auth verification failed:', error);
    return null;
  }
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'ADMIN' && user?.isAdmin === true;
}

/**
 * Check if user has access to specific business
 */
export function hasBusinessAccess(user: JWTPayload | null, businessSlug: string): boolean {
  if (!user) return false;
  
  // Admins can access all businesses
  if (isAdmin(user)) return true;
  
  // Business owners and staff can access their own business
  return user.businessSlug === businessSlug;
} 