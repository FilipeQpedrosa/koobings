import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [GET /api/customer/marketplace/businesses] Getting public businesses');
    
    // This endpoint should be public - no authentication required
    // Get ONLY businesses that are visible in marketplace
    const businesses = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        // Must have visibility settings allowing marketplace display
        settings: {
          path: ['visibility', 'showInMarketplace'],
          equals: true
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        address: true,
        phone: true,
        website: true,
        type: true,
        settings: true, // Include settings to double-check visibility
        Service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            image: true
          },
          take: 3 // Just show a few services for preview
        },
        Staff: {
          select: {
            id: true,
            name: true,
            role: true
          },
          take: 2 // Just show a few staff members
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Additional filtering to ensure visibility settings are correct
    const visibleBusinesses = businesses.filter(business => {
      const settings = business.settings as any || {};
      const visibility = settings.visibility || {};
      
      // Must be visible in marketplace AND public
      return visibility.showInMarketplace === true && 
             visibility.isPublic !== false;
    });

    console.log(`✅ [GET /api/customer/marketplace/businesses] Found ${businesses.length} active businesses, ${visibleBusinesses.length} are visible in marketplace`);

    return NextResponse.json({
      success: true,
      data: visibleBusinesses.map(business => ({
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        logo: business.logo,
        address: business.address,
        phone: business.phone,
        website: business.website,
        type: business.type,
        services: business.Service,
        staff: business.Staff
      }))
    });

  } catch (error) {
    console.error('❌ [GET /api/customer/marketplace/businesses] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
} 