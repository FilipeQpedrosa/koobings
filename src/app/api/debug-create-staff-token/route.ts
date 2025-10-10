import { NextRequest, NextResponse } from 'next/server';
import { createJWTToken } from '@/lib/jwt-safe';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Creating test staff token...');
    
    // Create a test JWT token for staff
    const testToken = createJWTToken({
      id: 'test-staff-id',
      email: 'test@staff.com',
      name: 'Test Staff',
      role: 'STAFF',
      businessId: 'test-business-id',
      businessName: 'Test Business',
      businessSlug: 'test-business',
      staffRole: 'ADMIN',
      isAdmin: true
    });
    
    console.log('✅ Test staff token created:', testToken);
    
    return NextResponse.json({ 
      success: true, 
      token: testToken,
      debug: {
        message: 'Test staff token created successfully',
        tokenLength: testToken.length
      }
    });
  } catch (error: any) {
    console.error('❌ Error creating test staff token:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
