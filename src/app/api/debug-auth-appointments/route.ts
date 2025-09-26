import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing authentication for appointments API...');
    
    // Log all cookies
    console.log('🍪 All cookies:', request.cookies.getAll());
    
    // Log Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Authorization header:', authHeader);
    
    // Test authentication
    const user = getRequestAuthUser(request);
    console.log('👤 User from getRequestAuthUser:', user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found',
        debug: {
          cookies: request.cookies.getAll(),
          authHeader: authHeader,
          pathname: request.nextUrl.pathname
        }
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
        businessSlug: user.businessSlug
      },
      debug: {
        cookies: request.cookies.getAll(),
        authHeader: authHeader,
        pathname: request.nextUrl.pathname
      }
    });
    
  } catch (error: any) {
    console.error('❌ DEBUG auth error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      debug: {
        cookies: request.cookies.getAll(),
        authHeader: request.headers.get('authorization'),
        pathname: request.nextUrl.pathname
      }
    }, { status: 500 });
  }
}
