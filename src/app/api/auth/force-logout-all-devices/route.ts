import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[FORCE_LOGOUT_ALL] 🚨 EMERGENCY LOGOUT FROM ALL DEVICES...');
    
    // Create response that forces logout from ALL devices
    const response = NextResponse.json({
      success: true,
      message: 'Logout forçado de todos os dispositivos',
      timestamp: new Date().toISOString(),
      action: 'ALL_DEVICES_LOGGED_OUT'
    });

    // Clear ALL possible authentication cookies with MAXIMUM security
    const authCookieNames = [
      'auth-token',
      'customer-auth',
      'business-auth-token', 
      'admin-auth-token',
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      'session',
      'sessionid',
      'jwt',
      'token',
      '__session',
      'connect.sid',
      'JSESSIONID',
      'PHPSESSID'
    ];

    // Strategy 1: Clear with strict security for current domain
    authCookieNames.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: -1,
        expires: new Date(0),
        path: '/'
      });
    });

    // Strategy 2: Clear with domain variations 
    authCookieNames.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: -1,
        expires: new Date(0),
        path: '/',
        domain: '.koobings.com'
      });
    });

    // Strategy 3: Clear for root domain
    authCookieNames.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: -1,
        expires: new Date(0),
        path: '/',
        domain: 'koobings.com'
      });
    });

    // Strategy 4: Delete explicitly
    authCookieNames.forEach(cookieName => {
      response.cookies.delete(cookieName);
    });

    // Add headers to prevent ANY caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Clear-Site-Data', '"cache", "cookies", "storage", "executionContexts"');

    console.log('[FORCE_LOGOUT_ALL] ✅ All devices logged out - cookies nuked');

    return response;

  } catch (error) {
    console.error('[FORCE_LOGOUT_ALL] ❌ Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Force logout failed',
        message: 'Erro interno do servidor'
      },
      { status: 500 }
    );
  }
} 