import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Custom logout initiated');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear the JWT auth token
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('✅ JWT token cleared');
    
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