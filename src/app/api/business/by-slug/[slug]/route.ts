import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching business by slug:', slug);

    const business = await prisma.business.findUnique({
      where: { 
        slug,
        status: 'ACTIVE' // Only active businesses
      },
      include: {
        services: {
          where: { 
            // Only include active services if there's a status field
            // For now, include all services
          },
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            category: {
              select: {
                name: true
              }
            }
          },
          orderBy: { name: 'asc' }
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true
          },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!business) {
      console.log('❌ Business not found:', slug);
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    console.log('✅ Business found:', business.name);
    console.log('📊 Services:', business.services.length);
    console.log('👥 Staff:', business.staff.length);

    // Return comprehensive business data
    const businessData = {
      id: business.id,
      name: business.name,
      slug: business.slug,
      description: business.description,
      logo: business.logo,
      phone: business.phone,
      address: business.address,
      website: business.website,
      email: business.email,
      type: business.type,
      settings: business.settings,
      services: business.services,
      staff: business.staff,
      createdAt: business.createdAt,
      updatedAt: business.updatedAt
    };

    return NextResponse.json({
      success: true,
      data: businessData
    });
  } catch (error) {
    console.error('❌ Error fetching business by slug:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 