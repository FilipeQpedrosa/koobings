import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Debug staff auth - Starting...');
    console.log('🔧 DEBUG: Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('🔧 DEBUG: Request cookies:', Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])));
    
    const user = getRequestAuthUser(request);
    console.log('🔧 DEBUG: getRequestAuthUser result:', user);
    
    return NextResponse.json({ 
      success: true, 
      debug: {
        headers: Object.fromEntries(request.headers.entries()),
        cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])),
        user: user,
        pathname: request.nextUrl.pathname
      }
    });
  } catch (error: any) {
    console.error('❌ Debug staff auth error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
