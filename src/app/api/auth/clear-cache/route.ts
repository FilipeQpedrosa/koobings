import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🧹 [Clear Cache] Forcing complete authentication reset');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'All authentication caches cleared',
      timestamp: new Date().toISOString()
    });
    
    // Clear all possible NextAuth cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token', 
      'next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'next-auth.state',
      'authjs.session-token',
      'authjs.csrf-token',
      '__Secure-authjs.session-token',
      '__Host-authjs.csrf-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      // Clear with all possible configurations
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      // Also clear non-httpOnly version
      response.cookies.set(cookieName, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    });
    
    console.log('🧹 [Clear Cache] All cookies cleared');
    
    return response;
  } catch (error) {
    console.error('❌ [Clear Cache] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
} 