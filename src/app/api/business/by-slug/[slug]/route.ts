import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// HEAD method for efficient existence checking (used by middleware)
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if middleware is calling (avoid infinite loops)
    const isMiddlewareCheck = request.headers.get('x-middleware-check');
    if (!isMiddlewareCheck) {
      return new NextResponse(null, { status: 400 });
    }

    console.log('🔍 Middleware checking business existence:', slug);

    const business = await prisma.business.findUnique({
      where: { 
        slug: slug,
        status: 'ACTIVE'
      },
      select: { id: true } // Minimal data for existence check
    });

    return new NextResponse(null, { 
      status: business ? 200 : 404 
    });

  } catch (error) {
    console.error('❌ Business existence check error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

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

    // Use the real slug field from database
    const business = await prisma.business.findUnique({
      where: { 
        slug: slug, // Use real slug field
        status: 'ACTIVE' // Only active businesses
      },
      select: {
        id: true,
        name: true,
        slug: true,
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

    // Return business data with slug
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