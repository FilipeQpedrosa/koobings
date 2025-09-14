import { NextRequest, NextResponse } from 'next/server';
import { getUltraSecureCookieOptions, createEmergencyClearResponse } from '@/lib/ultra-secure-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[SIMPLE_LOGOUT] 🚪 Simple customer logout...');
    
    // 🚀 Simple and effective logout response
    const response = NextResponse.json({
      ...createEmergencyClearResponse(),
      message: 'Logout realizado com sucesso',
      timestamp: new Date().toISOString()
    });

    // Clear ONLY the main authentication cookies (avoid problematic ones)
    const mainAuthCookies = [
      'auth-token',           // Our main cookie
      'customer-auth',        // Backup customer cookie
      'session',              // Generic session
      'sessionid',            // Alternative session
      'jwt',                  // JWT token
      'token'                 // Generic token
    ];

    // Strategy 1: Clear main cookies with proper options
    mainAuthCookies.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: -1,
        expires: new Date(0),
        path: '/'
      });
    });

    // Strategy 2: Delete cookies explicitly
    mainAuthCookies.forEach(cookieName => {
      response.cookies.delete(cookieName);
    });

    // Add cache prevention headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    console.log('[SIMPLE_LOGOUT] ✅ Simple logout completed - cookies cleared');

    return response;

  } catch (error) {
    console.error('[SIMPLE_LOGOUT] ❌ Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Logout failed',
        message: 'Erro no logout'
      },
      { status: 500 }
    );
  }
} 