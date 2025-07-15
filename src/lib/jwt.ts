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
  role: 'ADMIN' | 'BUSINESS_OWNER' | 'STAFF';
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
 * Verify JWT token and return payload
 */
export function verifyJWTToken(token: string): JWTPayload | null {
  try {
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
    console.error('❌ JWT verification failed:', error);
    return null;
  }
}

/**
 * Get authenticated user from server-side cookies
 */
export async function getServerAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    
    // Try admin token first
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
    
    // Fallback: try old auth-token for backward compatibility
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
 * Get authenticated user from NextRequest with context awareness
 */
export function getRequestAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const pathname = request.nextUrl.pathname;
    
    // 🚨 CRITICAL FIX: For admins, ALWAYS prioritize admin token first
    // This prevents business data contamination when admins access business routes
    const adminToken = request.cookies.get('admin-auth-token')?.value;
    if (adminToken) {
      const adminUser = verifyJWTToken(adminToken);
      if (adminUser && adminUser.role === 'ADMIN' && adminUser.isAdmin) {
        console.log('🔑 Admin token found, using admin privileges for:', adminUser.email);
        
        // For business routes, admin should have access without business-specific data
        const businessSlugMatch = pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
        if (businessSlugMatch) {
          const businessSlug = businessSlugMatch[1];
          console.log('👑 Admin accessing business route:', businessSlug);
          
          // Admin can access any business - return admin user without business contamination
          return {
            ...adminUser,
            businessId: undefined, // Clear any business data contamination
            businessName: undefined,
            businessSlug: undefined
          };
        }
        
        return adminUser;
      }
    }
    
    // For admin routes, prioritize admin token (redundant check but safer)
    if (pathname.startsWith('/admin')) {
      const adminToken = request.cookies.get('admin-auth-token')?.value;
      if (adminToken) {
        const user = verifyJWTToken(adminToken);
        if (user && user.role === 'ADMIN') {
          return user;
        }
      }
    }
    
    // For business routes, check business token (only for non-admins)
    const businessSlugMatch = pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
    if (businessSlugMatch) {
      const businessToken = request.cookies.get('business-auth-token')?.value;
      if (businessToken) {
        const user = verifyJWTToken(businessToken);
        if (user && (user.role === 'BUSINESS_OWNER' || user.role === 'STAFF')) {
          return user;
        }
      }
    }
    
    // Fallback: try all tokens (but admin was already checked above)
    const tokens = [
      request.cookies.get('business-auth-token')?.value,
      request.cookies.get('auth-token')?.value // backward compatibility
    ];
    
    for (const token of tokens) {
      if (token) {
        const user = verifyJWTToken(token);
        if (user) return user;
      }
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