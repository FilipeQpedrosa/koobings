import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/features - Get feature configuration for the business
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const featureConfig = await prisma.featureConfiguration.findUnique({
      where: {
        businessId: session.user.businessId,
      },
      include: {
        features: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!featureConfig) {
      return NextResponse.json({ success: false, error: { code: 'NOT_FOUND', message: 'Feature configuration not found' } }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: featureConfig });
  } catch (error) {
    console.error('Error fetching feature configuration:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FEATURES_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// PUT /api/features - Update feature configuration
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.businessId) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { features } = body;

    // Validate the request body
    if (!features || !Array.isArray(features)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_BODY', message: 'Invalid request body' } },
        { status: 400 }
      );
    }

    // Update or create feature configuration
    const featureConfig = await prisma.featureConfiguration.upsert({
      where: {
        businessId: session.user.businessId,
      },
      create: {
        businessId: session.user.businessId,
        features: {
          create: features.map((feature: any) => ({
            key: feature.key,
            name: feature.name,
            description: feature.description,
            enabled: feature.enabled,
            requiresApproval: feature.requiresApproval,
            options: {
              create: feature.options?.map((option: any) => ({
                key: option.key,
                name: option.name,
                enabled: option.enabled,
              })),
            },
          })),
        },
      },
      update: {
        features: {
          deleteMany: {}, // Remove existing features
          create: features.map((feature: any) => ({
            key: feature.key,
            name: feature.name,
            description: feature.description,
            enabled: feature.enabled,
            requiresApproval: feature.requiresApproval,
            options: {
              create: feature.options?.map((option: any) => ({
                key: option.key,
                name: option.name,
                enabled: option.enabled,
              })),
            },
          })),
        },
      },
      include: {
        features: {
          include: {
            options: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: featureConfig });
  } catch (error) {
    console.error('Error updating feature configuration:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FEATURES_UPDATE_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 