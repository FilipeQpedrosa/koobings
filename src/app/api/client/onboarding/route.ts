import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/client/onboarding - Handle client onboarding
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      insuranceInfo,
      preferences
    } = body;

    // Create the client with all related information
    const client = await prisma.client.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        status: 'ACTIVE',
        preferences: {
          emailNotifications: preferences?.email ?? true,
          smsNotifications: preferences?.sms ?? false,
          reminderTime: preferences?.reminderTime ?? 24,
          marketingEmails: preferences?.marketing ?? true,
          preferredContactMethod: preferences?.preferredContactMethod ?? 'EMAIL',
          servicePreferences: preferences?.servicePreferences ?? [],
        },
        business: {
          connect: { id: insuranceInfo?.businessId ?? '' }
        },
        clientRelationships: {
          create: {
            businessId: insuranceInfo?.businessId ?? '',
            status: 'ACTIVE',
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error('Error in client onboarding:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ONBOARDING_ERROR', message: 'Failed to complete onboarding' } },
      { status: 500 }
    );
  }
}

// GET /api/client/onboarding - Get onboarding requirements
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }

    // Get business configuration for onboarding
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        featureConfiguration: {
          include: {
            features: {
              include: {
                options: true,
              },
            },
          },
        },
        services: {
          include: {
            category: true,
            staff: true,
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Return onboarding requirements and available services
    return NextResponse.json({
      success: true,
      data: {
        business: {
          name: business.name,
          type: business.type,
        },
        features: business.featureConfiguration?.features || [],
        services: business.services,
        requirements: {
          requireMedicalInfo: business.type === 'PSYCHOLOGY',
          requirePreferences: true,
          requireContactMethod: true,
        },
      }
    });
  } catch (error) {
    console.error('Error fetching onboarding requirements:', error);
    return NextResponse.json(
      { success: false, error: { code: 'ONBOARDING_FETCH_ERROR', message: 'Failed to fetch onboarding requirements' } },
      { status: 500 }
    );
  }
} 