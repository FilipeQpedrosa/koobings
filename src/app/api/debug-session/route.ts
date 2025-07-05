import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('🔍 [DEBUG] Session check:', {
      hasSession: !!session,
      user: session?.user,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      session: session,
      user: session?.user || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [DEBUG] Session error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 