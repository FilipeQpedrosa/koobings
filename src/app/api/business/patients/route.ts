import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/business/patients - List all patients for a business
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the business ID from the authenticated user's staff record
    const staff = await prisma.staff.findFirst({
      where: { email: session.user.email },
      select: { businessId: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const patients = await prisma.patient.findMany({
      where: {
        businesses: {
          some: {
            id: staff.businessId
          }
        }
      },
      include: {
        preferences: true,
        relationships: {
          where: {
            businessId: staff.businessId
          }
        },
        appointments: {
          where: {
            businessId: staff.businessId
          },
          take: 1,
          orderBy: {
            startTime: 'desc'
          }
        }
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/business/patients - Create a new patient
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the business ID from the authenticated user's staff record
    const staff = await prisma.staff.findFirst({
      where: { email: session.user.email },
      select: { businessId: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      phone,
      preferredContactMethod,
      medicalInfo,
      notificationPreferences,
      notes
    } = body;

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        preferredContactMethod,
        notes,
        status: 'PENDING',
        businesses: {
          connect: {
            id: staff.businessId
          }
        },
        sensitiveInfo: {
          create: {
            email,
            medicalInfo
          }
        },
        preferences: {
          create: {
            emailNotifications: notificationPreferences?.emailNotifications ?? true,
            smsNotifications: notificationPreferences?.smsNotifications ?? false,
            reminderTime: notificationPreferences?.reminderTime ?? 24,
            marketingEmails: notificationPreferences?.marketingEmails ?? true
          }
        },
        relationships: {
          create: {
            businessId: staff.businessId,
            status: 'PENDING',
            relationshipStartDate: new Date()
          }
        }
      },
      include: {
        preferences: true,
        relationships: {
          where: {
            businessId: staff.businessId
          }
        }
      }
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 