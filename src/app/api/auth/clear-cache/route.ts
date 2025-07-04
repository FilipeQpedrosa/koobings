import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    console.log('🧹 Clear cache endpoint called');
    
    // Get current session
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({
        error: 'No session found',
        success: false
      }, { status: 401 });
    }

    console.log('📋 Current session before clear:', {
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      id: session.user.id
    });

    // Force clear any cached session data
    const response = NextResponse.json({
      success: true,
      message: 'Cache cleared successfully',
      sessionCleared: true
    });

    // Clear NextAuth cookies to force fresh login
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/'
    });
    response.cookies.set('next-auth.csrf-token', '', {
      expires: new Date(0),
      path: '/'
    });
    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      secure: true
    });

    return response;

  } catch (error) {
    console.error('❌ Clear cache error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      success: false
    }, { status: 500 });
  }
} 