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

    // Find business by slug
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      select: { id: true, name: true }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

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