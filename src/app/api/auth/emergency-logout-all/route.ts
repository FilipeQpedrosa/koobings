import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚨 [EMERGENCY_LOGOUT_ALL] CRITICAL SECURITY BREACH - FORCING ALL LOGOUTS');
    
    // Create response that clears ALL possible authentication cookies
    const response = NextResponse.json({
      success: true,
      message: 'Emergency logout executed - all sessions terminated',
      severity: 'CRITICAL_SECURITY_BREACH'
    });

    // Nuclear option - clear ALL possible auth cookies with multiple strategies
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
      'token'
    ];

    // Strategy 1: Set all to empty with immediate expiry
    authCookieNames.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: -1,
        expires: new Date(0),
        path: '/'
      });
      
      // Also try with domain variations
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax', 
        maxAge: -1,
        expires: new Date(0),
        path: '/',
        domain: '.koobings.com'
      });
      
      // Delete explicitly
      response.cookies.delete(cookieName);
    });

    console.log('🚨 [EMERGENCY_LOGOUT_ALL] All authentication cookies cleared');
    
    return response;

  } catch (error) {
    console.error('🚨 [EMERGENCY_LOGOUT_ALL] Critical error:', error);
    
    // Even if there's an error, try to clear cookies
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Emergency logout failed',
        severity: 'CRITICAL'
      },
      { status: 500 }
    );
    
    // Still try to clear auth-token at minimum
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: true,
      maxAge: -1,
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  }
} 