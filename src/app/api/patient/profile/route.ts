import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/patient/profile - Get patient's profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email },
      include: {
        preferences: true,
        relationship: true,
        appointments: {
          take: 5,
          orderBy: { scheduledAt: 'desc' },
          include: {
            service: true,
            staff: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH /api/patient/profile - Update patient's profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: session.user.email }
    });

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      phone,
      preferredContactMethod,
      notificationPreferences,
      medicalInfo
    } = body;

    // Update patient profile
    const updatedPatient = await prisma.patient.update({
      where: { id: patient.id },
      data: {
        name,
        phone,
        preferredContactMethod,
        sensitiveInfo: medicalInfo ? {
          update: {
            medicalInfo
          }
        } : undefined,
        preferences: notificationPreferences ? {
          update: {
            emailNotifications: notificationPreferences.emailNotifications,
            smsNotifications: notificationPreferences.smsNotifications,
            reminderTime: notificationPreferences.reminderTime,
            marketingEmails: notificationPreferences.marketingEmails
          }
        } : undefined
      },
      include: {
        preferences: true,
        relationship: true
      }
    });

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 