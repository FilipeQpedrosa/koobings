import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const businessInfoSchema = z.object({
  description: z.string(),
  logo: z.string().nullable(),
  coverImage: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  socialLinks: z.object({
    website: z.string(),
    facebook: z.string(),
    instagram: z.string(),
  }),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = businessInfoSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: validation.error.errors } },
        { status: 400 }
      );
    }
    const validatedData = validation.data;

    // Find the business by email
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Update business information
    let updatedBusiness;
    try {
      // Parse current settings or use empty object
      let currentSettings: any = {};
      if (business.settings) {
        try {
          currentSettings = typeof business.settings === 'string' ? JSON.parse(business.settings) : business.settings;
        } catch (e) {
          console.error('Failed to parse business.settings:', e);
          currentSettings = {};
        }
      }
      // Update socialLinks in settings
      const newSettings = {
        ...currentSettings,
        socialLinks: validatedData.socialLinks,
      };
      updatedBusiness = await prisma.business.update({
        where: { id: business.id },
        data: {
          description: validatedData.description,
          logo: validatedData.logo,
          phone: validatedData.phone,
          address: validatedData.address,
          settings: newSettings,
        },
      });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_UPDATE_ERROR', message: 'Failed to update business information' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedBusiness.id,
        description: updatedBusiness.description,
        logo: updatedBusiness.logo,
        phone: updatedBusiness.phone,
        address: updatedBusiness.address,
        socialLinks: (updatedBusiness.settings as any)?.socialLinks,
      },
    });
  } catch (error) {
    console.error('POST /business/info error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BUSINESS_UPDATE_ERROR', message: 'Failed to update business information' } },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.businessId) {
    return NextResponse.json({ error: 'Not authenticated or no business associated' }, { status: 401 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { id: session.user.businessId },
      select: {
        name: true,
        logo: true,
      },
    });

    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('Failed to fetch business info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 