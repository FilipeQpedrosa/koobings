import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJWTToken } from '@/lib/jwt-safe';
import bcrypt from 'bcryptjs';
import { createId } from '@paralleldrive/cuid2';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Creating new Mari Nails staff with known password...');
    
    // Find the business
    const business = await prisma.business.findUnique({
      where: { slug: 'mari-nails' }
    });
    
    if (!business) {
      return NextResponse.json({
        success: false,
        error: 'Business not found'
      }, { status: 404 });
    }
    
    console.log('✅ Found business:', business.name);
    
    // Update existing staff password instead of deleting
    const password = 'mari123';
    const passwordHash = await bcrypt.hash(password, 12);
    
    const staff = await prisma.staff.update({
      where: { email: 'marigabiatti@hotmail.com' },
      data: {
        password: passwordHash,
        updatedAt: new Date()
      }
    });
    
    console.log('✅ New staff created:', staff.name);
    console.log('🔑 Password:', password);
    console.log('🔑 Hash:', passwordHash);
    
    // Test the password immediately
    const isValid = await bcrypt.compare(password, passwordHash);
    console.log('✅ Password test:', isValid);
    
    // Create JWT token
    const token = createJWTToken({
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
      businessId: staff.businessId,
      businessName: business.name,
      businessSlug: business.slug
    });
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        businessId: staff.businessId,
        businessName: business.name,
        businessSlug: business.slug
      },
      password: password,
      passwordTest: isValid
    });
    
    // Set cookie
    response.cookies.set('business-auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
    
  } catch (error: any) {
    console.error('❌ DEBUG create staff error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
