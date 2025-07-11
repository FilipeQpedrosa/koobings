import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get both token and session for comparison
    const token = await getToken({ req: request });
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      success: true,
      debug: {
        tokenExists: !!token,
        sessionExists: !!session,
        token: token ? {
          email: token.email,
          name: token.name,
          role: token.role,
          businessId: token.businessId,
          businessName: token.businessName,
          staffRole: token.staffRole,
          isAdmin: token.isAdmin,
          iat: token.iat,
          exp: token.exp,
          jti: token.jti
        } : null,
        session: session ? {
          user: {
            id: session.user?.id,
            email: session.user?.email,
            name: session.user?.name,
            role: session.user?.role,
            businessId: session.user?.businessId,
            businessName: session.user?.businessName,
            staffRole: session.user?.staffRole,
            isAdmin: session.user?.isAdmin
          }
        } : null
      }
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 