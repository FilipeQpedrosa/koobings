import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/client/profile - Get patient profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.client.findUnique({
      where: { email: session.user.email },
      include: {
        appointments: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/client/profile - Update patient profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, emailNotifications, smsNotifications, reminderTime, marketingEmails } = body;

    // First find the patient to ensure they exist
    const client = await prisma.client.findUnique({
      where: { email: session.user.email },
    });

    if (!client) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // Update patient profile
    const profile = await prisma.client.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        preferences: {
          upsert: {
            where: {
              clientId: client.id
            },
            create: {
              emailNotifications,
              smsNotifications,
              reminderTime,
              marketingEmails,
            },
            update: {
              emailNotifications,
              smsNotifications,
              reminderTime,
              marketingEmails,
            },
          },
        },
      },
      include: {
        appointments: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 