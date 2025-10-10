import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 DEBUG: Service creation debug - Starting...');
    
    const user = getRequestAuthUser(request);
    console.log('🔧 DEBUG: User:', user);
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'No user found' }, { status: 401 });
    }

    const businessId = user.businessId;
    console.log('🔧 DEBUG: Business ID:', businessId);
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: 'No business ID' }, { status: 400 });
    }

    const body = await request.json();
    console.log('🔧 DEBUG: Request body:', body);

    // Test database connection
    console.log('🔧 DEBUG: Testing database connection...');
    const testQuery = await prisma.service.findFirst({
      where: { businessId },
      take: 1
    });
    console.log('🔧 DEBUG: Database test query result:', testQuery);

    // Test creating a simple service
    console.log('🔧 DEBUG: Testing service creation...');
    const testService = await prisma.service.create({
      data: {
        name: 'Test Service Debug',
        description: 'Debug test',
        duration: 30,
        price: 0,
        businessId,
        updatedAt: new Date(),
      },
    });
    console.log('🔧 DEBUG: Test service created:', testService);

    // Clean up test service
    await prisma.service.delete({
      where: { id: testService.id }
    });
    console.log('🔧 DEBUG: Test service deleted');

    return NextResponse.json({ 
      success: true, 
      debug: {
        user: user,
        businessId: businessId,
        body: body,
        testQuery: testQuery,
        testService: testService
      }
    });
  } catch (error: any) {
    console.error('❌ DEBUG: Service creation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
