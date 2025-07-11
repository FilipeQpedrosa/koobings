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
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    return verifyJWTToken(token);
  } catch (error) {
    console.error('❌ Server auth verification failed:', error);
    return null;
  }
}

/**
 * Get authenticated user from NextRequest
 */
export function getRequestAuthUser(request: NextRequest): JWTPayload | null {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    return verifyJWTToken(token);
  } catch (error) {
    console.error('❌ Request auth verification failed:', error);
    return null;
  }
}

/**
 * Check if user is admin
 */
export function isAdmin(user: JWTPayload | null): boolean {
  return user?.isAdmin === true || user?.role === 'ADMIN';
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