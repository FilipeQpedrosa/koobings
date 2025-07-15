import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Fetching all businesses for marketplace...');

    // Get all active businesses with their services (only businesses with slugs)
    const businesses = await (prisma as any).business.findMany({
      where: {
        status: 'ACTIVE',
        slug: {
          not: null // Only businesses with slugs
        }
      },
      include: {
        Service: {
          take: 5
        },
        Staff: {
          take: 10
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the businesses data - only include those with valid slugs
    const formattedBusinesses = businesses
      .filter((business: any) => business.slug) // Extra filter to ensure slug exists
      .map((business: any) => ({
        id: business.id,
        name: business.name,
        slug: business.slug, // Use real slug from database
        description: business.description,
        logo: business.logo,
        address: business.address,
        type: business.type,
        email: business.email,
        phone: business.phone,
        website: business.website,
        services: (business.Service || []).map((service: any) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration
        })),
        staff: (business.Staff || []).map((staff: any) => ({
          id: staff.id,
          name: staff.name
        })),
        rating: null, // TODO: Calculate from reviews
        reviewCount: 0
      }));

    console.log(`✅ Found ${formattedBusinesses.length} businesses with valid slugs`);

    return NextResponse.json({
      success: true,
      data: formattedBusinesses,
      total: formattedBusinesses.length
    });

  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch businesses',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 