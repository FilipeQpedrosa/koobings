import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/business';

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

    const business = await getBusinessBySlug(slug);

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Return only public business info (no sensitive data)
    const publicBusinessData = {
      id: business.id,
      name: business.name,
      slug: (business as any).slug,
      logo: business.logo,
      settings: business.settings
    };

    return NextResponse.json(publicBusinessData);
  } catch (error) {
    console.error('Error fetching business by slug:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 