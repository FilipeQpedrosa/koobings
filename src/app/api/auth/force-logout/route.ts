import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function POST() {
  try {
    // Clear all NextAuth cookies
    const cookieStore = await cookies();
    
    // Clear the main session token
    cookieStore.delete('next-auth.session-token');
    cookieStore.delete('__Secure-next-auth.session-token');
    
    // Clear the CSRF token
    cookieStore.delete('next-auth.csrf-token');
    cookieStore.delete('__Host-next-auth.csrf-token');
    
    // Clear the callback URL
    cookieStore.delete('next-auth.callback-url');
    cookieStore.delete('__Secure-next-auth.callback-url');
    
    console.log('🧹 Force logout: All NextAuth cookies cleared');
    
    return NextResponse.json({
      success: true,
      message: 'Session forcefully cleared'
    });
  } catch (error) {
    console.error('Force logout error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 