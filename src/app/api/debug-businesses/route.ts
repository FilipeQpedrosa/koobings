import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Listing all businesses...');
    
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        status: true
      },
      take: 10
    });
    
    console.log('🔧 DEBUG: Found businesses:', businesses);

    return NextResponse.json({ 
      success: true, 
      businesses: businesses,
      count: businesses.length
    });
  } catch (error: any) {
    console.error('❌ DEBUG: Error listing businesses:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
