import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚨 EMERGENCY CLEANUP: Starting complete session isolation...');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Emergency session cleanup completed',
      timestamp: new Date().toISOString(),
      action: 'All cookies cleared and sessions isolated'
    });
    
    // Clear ALL possible authentication cookies with ALL configurations
    const cookiesToClear = [
      'auth-token',
      'business-auth-token', 
      'admin-auth-token',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'authjs.session-token',
      'authjs.csrf-token',
      '__Secure-authjs.session-token',
      '__Host-authjs.csrf-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      // Clear with multiple configurations to ensure complete removal
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
        domain: undefined
      });
      
      response.cookies.set(cookieName, '', {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
        domain: undefined
      });
      
      // Also try with localhost domain
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
        domain: 'localhost'
      });
      
      console.log(`🧹 Emergency cleared cookie: ${cookieName}`);
    });
    
    console.log('✅ EMERGENCY CLEANUP: All sessions cleared and isolated');
    
    return response;
    
  } catch (error) {
    console.error('❌ EMERGENCY CLEANUP error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚨 EMERGENCY CLEANUP GET: Clearing and redirecting...');
    
    // Clear and redirect to signin
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    
    // Clear all cookies
    const cookiesToClear = [
      'auth-token',
      'business-auth-token', 
      'admin-auth-token',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    console.log('✅ EMERGENCY CLEANUP: Redirecting to signin');
    
    return response;
  } catch (error) {
    console.error('❌ EMERGENCY CLEANUP error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
} 