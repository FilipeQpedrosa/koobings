import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const timeSlotSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const dayScheduleSchema = z.object({
  isWorking: z.boolean(),
  timeSlots: z.array(timeSlotSchema),
});

const weeklyScheduleSchema = z.record(dayScheduleSchema);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user.email },
      include: {
        availability: true,
      },
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(staff.availability);
  } catch (error) {
    console.error('Error fetching staff availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate request body
    const validatedSchedule = weeklyScheduleSchema.parse(body);

    const staff = await prisma.staff.findUnique({
      where: { email: session.user.email },
    });

    if (!staff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Update availability
    const availability = await prisma.staffAvailability.upsert({
      where: {
        staffId: staff.id,
      },
      create: {
        staffId: staff.id,
        schedule: validatedSchedule,
      },
      update: {
        schedule: validatedSchedule,
      },
    });

    return NextResponse.json(availability);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid schedule format', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating staff availability:', error);
    return NextResponse.json(
      { error: 'Failed to update availability' },
      { status: 500 }
    );
  }
} 