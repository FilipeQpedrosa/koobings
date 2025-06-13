import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/client/profile - Get client profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { email: session.user.email },
      include: {
        clientRelationships: true, // replaces relationship
        appointments: {
          take: 5,
          orderBy: { scheduledFor: 'desc' },
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

    if (!client) {
      return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
    }

    // Optionally, parse preferences JSON for FE convenience
    let preferences = {};
    if (client.preferences) {
      try {
        preferences = typeof client.preferences === 'string' ? JSON.parse(client.preferences) : client.preferences;
      } catch (e) {
        preferences = {};
      }
    }

    return NextResponse.json({ success: true, data: { ...client, preferences } });
  } catch (error) {
    console.error('Error fetching client profile:', error);
    return NextResponse.json({ success: false, error: { code: 'PROFILE_FETCH_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

// PATCH /api/client/profile - Update client profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const client = await prisma.client.findUnique({
      where: { email: session.user.email }
    });

    if (!client) {
      return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
    }

    const body = await request.json();
    const {
      name,
      phone,
      preferredContactMethod,
      notificationPreferences,
      medicalInfo
    } = body;

    // Merge new preferences into existing preferences JSON
    let newPreferences: Record<string, any> = {};
    if (client.preferences) {
      try {
        newPreferences = typeof client.preferences === 'string' ? JSON.parse(client.preferences) : client.preferences;
      } catch (e) {
        newPreferences = {};
      }
    }
    if (preferredContactMethod !== undefined) newPreferences["preferredContactMethod"] = preferredContactMethod;
    if (notificationPreferences !== undefined) newPreferences["notificationPreferences"] = notificationPreferences;
    if (medicalInfo !== undefined) newPreferences["medicalInfo"] = medicalInfo;

    // Update client profile
    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        name,
        phone,
        preferences: newPreferences
      },
      include: {
        clientRelationships: true
      }
    });

    return NextResponse.json({ success: true, data: updatedClient });
  } catch (error) {
    console.error('Error updating client profile:', error);
    return NextResponse.json({ success: false, error: { code: 'PROFILE_UPDATE_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 