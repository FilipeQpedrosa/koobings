import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createJWTToken } from '@/lib/jwt-safe';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Testing staff login...');
    
    const body = await request.json();
    const { email, password, businessSlug } = body;
    
    console.log('🔧 DEBUG: Login attempt:', { email, businessSlug });
    
    // Find staff by email and business slug
    const staff = await prisma.staff.findFirst({
      where: {
        email: email,
        business: {
          slug: businessSlug
        }
      },
      include: {
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            email: true
          }
        }
      }
    });
    
    console.log('🔧 DEBUG: Found staff:', staff);
    
    if (!staff) {
      return NextResponse.json({ 
        success: false, 
        error: 'Staff not found',
        debug: { email, businessSlug }
      }, { status: 404 });
    }
    
    // Create JWT token
    const token = createJWTToken({
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: 'STAFF',
      businessId: staff.business.id,
      businessName: staff.business.name,
      businessSlug: staff.business.slug,
      staffRole: staff.role,
      isAdmin: staff.role === 'ADMIN'
    });
    
    console.log('🔧 DEBUG: Token created:', token);
    
    return NextResponse.json({ 
      success: true, 
      token: token,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        business: staff.business
      }
    });
  } catch (error: any) {
    console.error('❌ DEBUG: Staff login error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
