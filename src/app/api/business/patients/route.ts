import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

// GET /api/business/patients - List all clients for a business
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
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
    console.error('GET /business/patients error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/business/patients - Create a new client
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
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

    // Input validation
    const schema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      preferredContactMethod: z.string().optional(),
      medicalInfo: z.any().optional(),
      notificationPreferences: z.any().optional(),
      notes: z.string().optional()
    });
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    let validatedData;
    try {
      validatedData = schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid client data', details: error.errors }, { status: 400 });
      }
      throw error;
    }
    const { name, email, phone, notes } = validatedData;

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
    console.error('POST /business/patients error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 