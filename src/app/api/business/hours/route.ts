import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const businessHoursSchema = z.object({
  hours: z.array(z.object({
    day: z.number(),
    isOpen: z.boolean(),
    start: z.string().regex(timeRegex, 'Invalid time format'),
    end: z.string().regex(timeRegex, 'Invalid time format')
  })).refine((hours) => {
    return hours.every(hour => {
      if (!hour.isOpen) return true;
      const start = new Date(`1970-01-01T${hour.start}`);
      const end = new Date(`1970-01-01T${hour.end}`);
      return end > start;
    });
  }, 'End time must be after start time')
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const hours = await prisma.businessHours.findMany({
      where: { businessId: session.user.id },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({
      hours: hours.map(hour => ({
        day: hour.dayOfWeek,
        isOpen: !hour.isClosed,
        start: hour.startTime,
        end: hour.endTime,
      }))
    });
  } catch (error) {
    console.error('Error fetching business hours:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const validatedData = businessHoursSchema.parse(body);

    // Delete existing hours
    await prisma.businessHours.deleteMany({
      where: { businessId: session.user.id },
    });

    // Create new hours
    await prisma.businessHours.createMany({
      data: validatedData.hours.map(hour => ({
        businessId: session.user.id,
        dayOfWeek: hour.day,
        startTime: hour.start,
        endTime: hour.end,
        isClosed: !hour.isOpen,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error('Error saving business hours:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 