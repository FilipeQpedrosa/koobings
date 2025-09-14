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

    // Find business by real slug field
    const business = await prisma.business.findUnique({
      where: { 
        slug: businessSlug,
        status: 'ACTIVE' // Only active businesses
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    
    if (!business) {
      console.log('❌ Business not found for slug:', businessSlug);
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    console.log('✅ Business found:', business.name, 'for slug:', businessSlug);

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
        price: true,
        // Add availability information
        availableDays: true,
        anyTimeAvailable: true,
        slots: true,
        startTime: true,
        endTime: true
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        business: {
          id: business.id,
          name: business.name,
          slug: business.slug
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