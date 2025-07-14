import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessSlug = searchParams.get('businessSlug');
    
    if (!businessSlug) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_SLUG_REQUIRED', message: 'Business slug is required' } },
        { status: 400 }
      );
    }

    // const business = await prisma.business.findUnique({
    //   where: { slug: businessSlug }, // COMMENTED - slug column doesn't exist
    // });
    
    // TEMPORARY: Skip business slug validation until slug is properly implemented
    console.log('⚠️ Business slug validation temporarily disabled');
    const business = { id: 'temp-business-id', name: 'Temporary Business' }; // Temporary placeholder

    // Get services for this business
    const services = await prisma.service.findMany({
      where: {
        businessId: business.id
      },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        price: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name
        },
        services: services
      }
    });
  } catch (error: any) {
    console.error('[CLIENT_SERVICES_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVICES_FETCH_ERROR', message: 'Internal error' } },
      { status: 500 }
    );
  }
} 