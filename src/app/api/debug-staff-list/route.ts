import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Listing all staff...');
    
    const staff = await prisma.staff.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      take: 10
    });
    
    console.log('🔧 DEBUG: Found staff:', staff);

    return NextResponse.json({ 
      success: true, 
      staff: staff,
      count: staff.length
    });
  } catch (error: any) {
    console.error('❌ DEBUG: Error listing staff:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
