// Replacement for NextAuth functionality during JWT transition
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessId?: string;
  businessName?: string;
  businessSlug?: string;
  isAdmin?: boolean;
  staffRole?: string;
}

export interface AuthSession {
  user: AuthUser;
}

// Legacy NextAuth compatibility - these functions are deprecated
export async function getServerSession(req?: NextRequest, authOptions?: any): Promise<AuthSession | null> {
  console.warn('⚠️  getServerSession is deprecated. Use getRequestAuthUser from @/lib/jwt instead.');
  
  // Try to get user from JWT if request is provided
  if (req) {
    try {
      const { getRequestAuthUser } = await import('@/lib/jwt');
      const user = getRequestAuthUser(req);
      if (user) {
        return { user };
      }
    } catch (error) {
      console.error('Error getting JWT user:', error);
    }
  }
  
  return null;
}

// NextAuth options placeholder for compatibility
export const authOptions = {
  providers: [],
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    jwt: async () => ({}),
    session: async () => ({}),
  },
};

export default authOptions; 