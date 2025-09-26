import { NextRequest, NextResponse } from 'next/server';
import { verifyJWTToken } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Simple test endpoint called');
    
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔑 Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'NO_TOKEN', message: 'No Bearer token found' } 
      }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    console.log('🎯 Token extracted:', token.substring(0, 50) + '...');
    
    // Verify token directly
    const user = verifyJWTToken(token);
    console.log('👤 User from token:', user);
    
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_TOKEN', message: 'Token is invalid' } 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Token is valid!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        businessId: user.businessId,
        businessSlug: user.businessSlug
      }
    });
    
  } catch (error) {
    console.error('❌ Simple test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
