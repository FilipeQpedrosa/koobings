import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('[CLIENT_LOGOUT] Starting logout...');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

    // Clear the authentication cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    // Also clear any other potential auth cookies
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('__Secure-next-auth.session-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });

    console.log('[CLIENT_LOGOUT] ✅ Logout successful');

    return response;

  } catch (error) {
    console.error('[CLIENT_LOGOUT] ❌ Logout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'LOGOUT_ERROR', 
          message: 'Erro interno do servidor' 
        } 
      },
      { status: 500 }
    );
  }
} 