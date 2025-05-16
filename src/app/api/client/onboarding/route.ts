import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// POST /api/client/onboarding - Handle client onboarding
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      businessId,
      preferredContactMethod,
      notificationPreferences,
      servicePreferences,
      medicalInfo,
    } = body;

    // Create the client with all related information
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        businessId,
        status: 'ACTIVE',
        preferredContactMethod,
        sensitiveInfo: {
          create: {
            email,
            medicalInfo,
          },
        },
        preferences: {
          create: {
            emailNotifications: notificationPreferences?.email ?? true,
            smsNotifications: notificationPreferences?.sms ?? false,
            reminderTime: notificationPreferences?.reminderTime ?? 24,
            marketingEmails: notificationPreferences?.marketing ?? true,
          },
        },
        relationship: {
          create: {
            businessId,
            status: 'ACTIVE',
            preferences: {
              communicationPreference: preferredContactMethod,
              servicePreferences,
            },
          },
        },
      },
      include: {
        preferences: true,
        sensitiveInfo: true,
        relationship: true,
      },
    });

    return NextResponse.json(client);
  } catch (error) {
    console.error('Error in client onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
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
        { error: 'Business ID is required' },
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
          where: { isActive: true },
          include: {
            category: true,
            staff: true,
          },
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Return onboarding requirements and available services
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error fetching onboarding requirements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding requirements' },
      { status: 500 }
    );
  }
} 