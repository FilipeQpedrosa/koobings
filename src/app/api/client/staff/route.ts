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

    // Get staff for this business
    const staff = await prisma.staff.findMany({
      where: {
        businessId: business.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
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
        staff: staff
      }
    });
  } catch (error: any) {
    console.error('[CLIENT_STAFF_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_FETCH_ERROR', message: 'Internal error' } },
      { status: 500 }
    );
  }
} 