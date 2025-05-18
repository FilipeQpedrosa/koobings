import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { BusinessStatus, BusinessType } from '@prisma/client';

// Validation schema for business registration
const businessRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  type: z.nativeEnum(BusinessType).default(BusinessType.OTHER),
  url: z.string().url('Invalid URL').optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = businessRegistrationSchema.parse(body);
    const { email, password, name, type, url } = validatedData;

    // Check if business already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { email },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        type,
        url,
        status: BusinessStatus.PENDING,
        settings: {
          timezone: 'UTC',
          businessHours: {},
          notificationPreferences: {
            email: true,
            sms: false,
          },
        },
        securitySettings: {
          create: {
            requireMFA: false,
            autoRevokeInactiveAccess: true,
            inactivityThreshold: 30,
            enforceIPRestriction: false,
            requireAccessReason: true,
            enableAccessLogs: true,
            defaultDataRetentionDays: 365,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        status: true,
        settings: true,
        securitySettings: {
          select: {
            requireMFA: true,
            enableAccessLogs: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...business,
        type: 'business',
      },
    });
  } catch (error) {
    console.error('Business registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register business' },
      { status: 500 }
    );
  }
} 