import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Checking Mari Nails staff...');
    
    // Check if staff exists
    const staff = await prisma.staff.findUnique({
      where: { email: 'marigabiatti@hotmail.com' },
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
        error: 'Staff not found',
        debug: 'No staff member found with email marigabiatti@hotmail.com'
      });
    }
    
    return NextResponse.json({
      success: true,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        businessId: staff.businessId,
        businessName: staff.Business?.name,
        businessSlug: staff.Business?.slug,
        createdAt: staff.createdAt
      }
    });
    
  } catch (error: any) {
    console.error('❌ DEBUG staff check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
