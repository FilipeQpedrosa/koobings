import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Fetching businesses for marketplace with visibility controls...');

    // First, get all ACTIVE businesses with services - simple and reliable
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        // Only include businesses that have at least one service
        Service: {
          some: {}
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

    console.log(`📊 Found ${businesses.length} businesses with services`);

    // Filter businesses based on their visibility settings in JavaScript
    const visibleBusinesses = businesses.filter((business: any) => {
      // Must have a slug to be accessible
      if (!business.slug) {
        return false;
      }
      
      // Check admin approval settings
      const settings = business.settings || {};
      const visibility = settings.visibility || {};
      
      // Must be admin approved AND have marketplace visibility enabled
      const isAdminApproved = visibility.adminApproved === true;
      const showInMarketplace = visibility.showInMarketplace === true;
      const hasServices = (business.Service || []).length > 0;
      
      return isAdminApproved && showInMarketplace && hasServices;
    });

    console.log(`📊 Marketplace visibility: ${visibleBusinesses.length}/${businesses.length} businesses approved with services`);

    // Format the businesses data
    const formattedBusinesses = visibleBusinesses.map((business: any) => ({
      id: business.id,
      name: business.name,
      slug: business.slug,
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

    console.log(`✅ Found ${formattedBusinesses.length} businesses for client portal`);

    return NextResponse.json({
      success: true,
      data: formattedBusinesses,
      total: formattedBusinesses.length
    });

  } catch (error) {
    console.error('❌ Error fetching businesses:', error);
    
    // Return a more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('❌ Error details:', {
      message: errorMessage,
      stack: errorStack
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch businesses',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 