import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/staff/schedule - Get staff member's schedule
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const schedule = await prisma.staffAvailability.findMany({
      where: {
        staffId: staffId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
        },
      },
      include: {
        staff: true,
      },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching staff schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule' },
      { status: 500 }
    );
  }
}

// POST /api/staff/schedule - Create or update staff schedule
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { staffId, date, startTime, endTime, isAvailable } = body;

    if (!staffId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const availability = await prisma.staffAvailability.upsert({
      where: {
        staffId_date: {
          staffId: staffId,
          date: new Date(date),
        },
      },
      update: {
        startTime,
        endTime,
        isAvailable,
      },
      create: {
        staffId,
        date: new Date(date),
        startTime,
        endTime,
        isAvailable,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error updating staff schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update schedule' },
      { status: 500 }
    );
  }
}

// DELETE /api/staff/schedule - Delete staff schedule
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');

    if (!staffId || !date) {
      return NextResponse.json(
        { error: 'Staff ID and date are required' },
        { status: 400 }
      );
    }

    await prisma.staffAvailability.delete({
      where: {
        staffId_date: {
          staffId: staffId,
          date: new Date(date),
        },
      },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule' },
      { status: 500 }
    );
  }
} 