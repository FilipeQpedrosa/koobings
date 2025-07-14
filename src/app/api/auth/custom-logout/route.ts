import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Custom logout initiated');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear the JWT auth token for all possible paths
    // Clear admin path
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/admin',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Clear root path (fallback)
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Get the current URL to determine business slug
    const url = new URL(request.url);
    const pathSegments = url.pathname.split('/');
    if (pathSegments.length > 1 && pathSegments[1] && pathSegments[1] !== 'api') {
      // Clear business-specific path
      response.cookies.set('auth-token', '', {
        expires: new Date(0),
        path: `/${pathSegments[1]}`,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
    }
    
    console.log('✅ JWT tokens cleared for all paths');
    
    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Logout failed' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🚪 Custom logout GET request');
    
    // Clear the token and redirect to signin
    const response = NextResponse.redirect(new URL('/auth/signin', request.url));
    
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('✅ JWT token cleared, redirecting to signin');
    
    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
} 