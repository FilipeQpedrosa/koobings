import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BusinessStatus } from '@prisma/client';

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

    // Update business status to ACTIVE
    let updatedBusiness;
    try {
      updatedBusiness = await prisma.business.update({
        where: { id: business.id },
        data: {
          status: BusinessStatus.ACTIVE,
        },
      });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { success: false, error: { code: 'ONBOARDING_UPDATE_ERROR', message: 'Failed to complete onboarding' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedBusiness.id,
        status: updatedBusiness.status,
      },
    });
  } catch (error) {
    console.error('POST /business/complete-onboarding error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ONBOARDING_ERROR', message: 'Failed to complete onboarding' } },
      { status: 500 }
    );
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 