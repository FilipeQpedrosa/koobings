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

    // SIMPLIFIED: Just get basic business data without complex relations
    const business = await prisma.business.findUnique({
      where: { 
        // slug, // COMMENTED - column does not exist in database
        id: slug, // TEMPORARY: using id instead of slug
        status: 'ACTIVE' // Only active businesses
      },
      select: {
        id: true,
        name: true,
        description: true,
        logo: true,
        phone: true,
        address: true,
        email: true,
        type: true,
        settings: true,
        createdAt: true,
        updatedAt: true
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

    // Return simplified business data
    return NextResponse.json({
      success: true,
      data: business
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