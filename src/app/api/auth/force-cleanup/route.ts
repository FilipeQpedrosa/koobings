import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 FORCE CLEANUP: Starting complete authentication cleanup...');
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'All authentication tokens cleared',
      timestamp: new Date().toISOString()
    });
    
    // Clear ALL possible authentication cookies
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
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0), // Expire immediately
        path: '/'
      });
      console.log(`🧹 Cleared cookie: ${cookieName}`);
    });
    
    console.log('✅ FORCE CLEANUP: All authentication tokens cleared successfully');
    
    return response;
    
  } catch (error) {
    console.error('❌ FORCE CLEANUP error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 