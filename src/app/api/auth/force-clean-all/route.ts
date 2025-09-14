import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Force clean all authentication data');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'All authentication data cleared',
      instructions: [
        'Clear browser cache (Ctrl+Shift+Delete)',
        'Clear localStorage and sessionStorage',
        'Close and reopen browser',
        'Try accessing the site again'
      ]
    });

    // Clear ALL possible authentication cookies
    const cookiesToClear = [
      'auth-token',
      'admin-auth-token', 
      'business-auth-token',
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url'
    ];

    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      
      // Also try with domain
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
        domain: '.koobings.com'
      });
    });

    console.log('🧹 ✅ All authentication cookies cleared');

    return response;

  } catch (error) {
    console.error('🧹 ❌ Force clean error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear authentication data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 