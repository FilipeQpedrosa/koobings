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

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = businessInfoSchema.parse(body);

    // Find the business by email
    const business = await prisma.business.findUnique({
      where: { email: session.user.email },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Update business information
    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: {
        description: validatedData.description,
        logo: validatedData.logo,
        coverImage: validatedData.coverImage,
        phone: validatedData.phone,
        address: validatedData.address,
        settings: {
          ...business.settings,
          socialLinks: validatedData.socialLinks,
        },
      },
    });

    return NextResponse.json({
      success: true,
      business: {
        id: updatedBusiness.id,
        description: updatedBusiness.description,
        logo: updatedBusiness.logo,
        coverImage: updatedBusiness.coverImage,
        phone: updatedBusiness.phone,
        address: updatedBusiness.address,
        socialLinks: (updatedBusiness.settings as any)?.socialLinks,
      },
    });
  } catch (error) {
    console.error('Error updating business info:', error);
    return NextResponse.json(
      { error: 'Failed to update business information' },
      { status: 500 }
    );
  }
} 