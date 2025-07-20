import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🏗️ Setting up demo business for client portal...');

    // Check if there's a confirmation
    const { confirm } = await request.json();
    
    if (confirm !== 'SETUP_DEMO_BUSINESS') {
      return NextResponse.json({ 
        error: 'Send POST with {"confirm": "SETUP_DEMO_BUSINESS"} to setup demo business'
      }, { status: 400 });
    }

    // Get the first business
    const business = await prisma.business.findFirst({
      where: { status: 'ACTIVE' },
      include: {
        Service: true,
        _count: {
          select: { Service: true }
        }
      }
    });

    if (!business) {
      return NextResponse.json({ 
        error: 'No businesses found'
      }, { status: 404 });
    }

    console.log(`📋 Configuring business: ${business.name} (${business.slug})`);
    console.log(`📊 Current services: ${business._count.Service}`);

    let serviceAdded = false;

    // 1. Add a service if none exist
    if (business._count.Service === 0) {
      console.log('➕ Adding demo service...');
      
      const now = new Date();
      await prisma.service.create({
        data: {
          id: `service_${Date.now()}`,
          name: 'Serviço de Demonstração',
          description: 'Serviço de exemplo para testar o portal cliente',
          duration: 60,
          price: 50.00,
          businessId: business.id,
          createdAt: now,
          updatedAt: now
        }
      });
      
      serviceAdded = true;
      console.log('✅ Demo service added');
    }

    // 2. Configure visibility settings
    console.log('⚙️ Configuring visibility settings...');
    
    const visibilitySettings = {
      visibility: {
        adminApproved: true,
        showInMarketplace: true,
        showInSearch: true,
        allowOnlineBooking: true,
        isPublic: true,
        adminNotes: 'Demo business configured via API',
        lastUpdatedBy: 'admin-api',
        lastUpdatedAt: new Date().toISOString()
      }
    };

    await prisma.business.update({
      where: { id: business.id },
      data: {
        settings: visibilitySettings
      }
    });

    console.log('✅ Visibility settings configured');

    // 3. Verify the setup
    const updatedBusiness = await prisma.business.findUnique({
      where: { id: business.id },
      include: {
        Service: true,
        _count: {
          select: { Service: true }
        }
      }
    });

    if (!updatedBusiness) {
      return NextResponse.json({ 
        error: 'Failed to retrieve updated business'
      }, { status: 500 });
    }

    const businessSettings = updatedBusiness.settings as any;
    const visibility = businessSettings?.visibility || {};

    return NextResponse.json({
      success: true,
      message: 'Demo business configured successfully',
      business: {
        id: updatedBusiness.id,
        name: updatedBusiness.name,
        slug: updatedBusiness.slug,
        serviceCount: updatedBusiness._count.Service,
        serviceAdded: serviceAdded,
        visibility: visibility
      }
    });

  } catch (error) {
    console.error('❌ Demo setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup demo business',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 