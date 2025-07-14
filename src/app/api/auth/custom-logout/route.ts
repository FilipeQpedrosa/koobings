import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 Custom logout initiated');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear all possible auth tokens
    
    // Clear admin auth token
    response.cookies.set('admin-auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Clear business auth token
    response.cookies.set('business-auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Clear old auth token for backward compatibility
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('✅ All JWT tokens cleared');
    
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
    
    // Clear all auth tokens
    response.cookies.set('admin-auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    response.cookies.set('business-auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    response.cookies.set('auth-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    console.log('✅ All JWT tokens cleared, redirecting to signin');
    
    return response;
  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
} 