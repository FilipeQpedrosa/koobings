import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/staff/services - Get staff member's services
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const services = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        services: {
          include: {
            category: true,
          },
        },
      },
    });

    if (!services) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(services.services);
  } catch (error) {
    console.error('Error fetching staff services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST /api/staff/services - Update staff service assignments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { staffId, serviceIds } = body;

    if (!staffId || !serviceIds) {
      return NextResponse.json(
        { error: 'Staff ID and service IDs are required' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.update({
      where: { id: staffId },
      data: {
        services: {
          set: serviceIds.map((id: string) => ({ id })),
        },
      },
      include: {
        services: true,
      },
    });

    return NextResponse.json(staff.services);
  } catch (error) {
    console.error('Error updating staff services:', error);
    return NextResponse.json(
      { error: 'Failed to update services' },
      { status: 500 }
    );
  }
} 