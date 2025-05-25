import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/business/patients - List all clients for a business
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

    const clients = await prisma.client.findMany({
      where: { businessId: staff.businessId },
      include: {
        appointments: true,
        reviews: true,
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/business/patients - Create a new client
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

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        businessId: staff.businessId,
        notes,
        status: 'PENDING',
      },
      include: {
        appointments: true,
        reviews: true,
        relationshipNotes: true,
      }
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 