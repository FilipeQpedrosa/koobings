import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get staff member's schedule
    const staff = await prisma.staff.findFirst({
      where: {
        id,
        businessId: user.businessId
      },
      include: {
        availability: true,
      }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff member not found' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dayOfWeek, startTime, endTime } = body;

    const schedule = await prisma.staffAvailability.create({
      data: {
        staffId: id,
        dayOfWeek,
        startTime,
        endTime,
      }
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error creating staff schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.staffAvailability.deleteMany({
      where: { staffId: id }
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 