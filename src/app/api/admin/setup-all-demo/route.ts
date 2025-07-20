import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🏗️ Configuring ALL businesses with services for client portal...');

    // Check if there's a confirmation
    const { confirm } = await request.json();
    
    if (confirm !== 'SETUP_ALL_BUSINESSES') {
      return NextResponse.json({ 
        error: 'Send POST with {"confirm": "SETUP_ALL_BUSINESSES"} to setup all businesses'
      }, { status: 400 });
    }

    // Get all businesses that have services
    const businessesWithServices = await prisma.business.findMany({
      where: {
        status: 'ACTIVE',
        Service: {
          some: {} // Only businesses with at least one service
        }
      },
      include: {
        Service: true,
        _count: {
          select: { Service: true }
        }
      }
    });

    console.log(`📋 Found ${businessesWithServices.length} businesses with services`);

    if (businessesWithServices.length === 0) {
      return NextResponse.json({ 
        message: 'No businesses with services found'
      });
    }

    const results = [];

    // Configure visibility settings for each business
    for (const business of businessesWithServices) {
      console.log(`⚙️ Configuring ${business.name} (${business._count.Service} services)...`);
      
      const visibilitySettings = {
        visibility: {
          adminApproved: true,
          showInMarketplace: true,
          showInSearch: true,
          allowOnlineBooking: true,
          isPublic: true,
          adminNotes: `Auto-configured business with ${business._count.Service} services`,
          lastUpdatedBy: 'admin-bulk-api',
          lastUpdatedAt: new Date().toISOString()
        }
      };

      await prisma.business.update({
        where: { id: business.id },
        data: {
          settings: visibilitySettings
        }
      });

      results.push({
        id: business.id,
        name: business.name,
        slug: business.slug,
        serviceCount: business._count.Service,
        configured: true
      });

      console.log(`✅ ${business.name} configured`);
    }

    console.log(`🎉 Configured ${results.length} businesses for client portal`);

    return NextResponse.json({
      success: true,
      message: `Successfully configured ${results.length} businesses`,
      businesses: results
    });

  } catch (error) {
    console.error('❌ Bulk setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup businesses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 