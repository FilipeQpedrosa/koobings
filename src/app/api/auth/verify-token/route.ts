import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verifying auth token...');
    
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.log('❌ No valid token found');
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    
    console.log('✅ Token valid for user:', user.name);
    
    return NextResponse.json({ 
      success: true,
      authenticated: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'STAFF',
        businessId: user.businessId,
        businessName: user.businessName,
        businessSlug: user.businessSlug,
        staffRole: user.staffRole || 'ADMIN',
        isAdmin: user.isAdmin || false,
        permissions: user.permissions || []
      }
    });
  } catch (error) {
    console.error('🚨 Token verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 