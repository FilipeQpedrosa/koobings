import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJWTToken } from '@/lib/jwt-safe';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing login for Mari Nails...');
    
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password required'
      }, { status: 400 });
    }
    
    // Find staff member
    const staff = await prisma.staff.findUnique({
      where: { email },
      include: {
        Business: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    if (!staff) {
      return NextResponse.json({
        success: false,
        error: 'Staff not found'
      }, { status: 404 });
    }
    
    console.log('👤 Found staff:', staff.name, 'Business:', staff.Business?.name);
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, staff.password);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
    
    // Create JWT token
    const token = createJWTToken({
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
      businessId: staff.businessId,
      businessName: staff.Business?.name,
      businessSlug: staff.Business?.slug
    });
    
    console.log('🔑 Token created for:', staff.email);
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
        businessId: staff.businessId,
        businessName: staff.Business?.name,
        businessSlug: staff.Business?.slug
      }
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
    console.error('❌ DEBUG login error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
