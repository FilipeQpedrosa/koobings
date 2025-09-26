import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Testing appointments query...');
    
    // Authentication check
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'No user found'
      }, { status: 401 });
    }
    
    console.log('✅ User authenticated:', user.email);
    
    // Test simple query first
    try {
      const count = await prisma.appointments.count({
        where: { businessId: user.businessId }
      });
      
      console.log('✅ Count query successful:', count);
      
      // Test actual query
      const appointments = await prisma.appointments.findMany({
        where: { businessId: user.businessId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      
      console.log('✅ FindMany query successful:', appointments.length);
      
      return NextResponse.json({
        success: true,
        count: count,
        appointments: appointments.length,
        sample: appointments[0] || null
      });
      
    } catch (queryError) {
      console.error('❌ Query error:', queryError);
      return NextResponse.json({
        success: false,
        error: queryError.message,
        type: queryError.constructor.name
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ DEBUG appointments test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
