import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Create response with redirect to signin
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    
    // Clear all possible NextAuth cookies
    const cookiesToClear = [
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.csrf-token',
      'next-auth.state'
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
    
    // Also clear non-httpOnly cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('🧹 [Force Logout] All cookies cleared, redirecting to signin');
    
    return response;
  } catch (error) {
    console.error('❌ [Force Logout] Error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
} 