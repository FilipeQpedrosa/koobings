import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing password for Mari Nails...');
    
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json({
        success: false,
        error: 'Password required'
      }, { status: 400 });
    }
    
    // Get staff member
    const staff = await prisma.staff.findUnique({
      where: { email: 'marigabiatti@hotmail.com' }
    });
    
    if (!staff) {
      return NextResponse.json({
        success: false,
        error: 'Staff not found'
      }, { status: 404 });
    }
    
    console.log('👤 Found staff:', staff.name);
    console.log('🔑 Stored hash:', staff.password.substring(0, 20) + '...');
    console.log('🔑 Testing password:', password);
    
    // Test password with bcryptjs
    const isValidPassword = await bcrypt.compare(password, staff.password);
    console.log('✅ Password valid:', isValidPassword);
    
    // Also test with different passwords
    const testPasswords = ['mari123', 'Mari123', 'MARI123', 'mari', '123'];
    const results = {};
    
    for (const testPwd of testPasswords) {
      const isValid = await bcrypt.compare(testPwd, staff.password);
      results[testPwd] = isValid;
    }
    
    return NextResponse.json({
      success: true,
      passwordTest: {
        provided: password,
        isValid: isValidPassword,
        allTests: results
      },
      staff: {
        name: staff.name,
        email: staff.email,
        hashPreview: staff.password.substring(0, 20) + '...'
      }
    });
    
  } catch (error: any) {
    console.error('❌ DEBUG password test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
