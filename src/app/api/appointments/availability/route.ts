import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';
import { Appointment, AppointmentStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const providerId = searchParams.get('providerId');
    const businessId = searchParams.get('businessId');

    if (!date || !providerId || !businessId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const selectedDate = parseISO(date);
    const dayOfWeek = selectedDate.getDay();

    // Get provider's schedule for the day
    const schedule = await prisma.schedule.findFirst({
      where: {
        staffId: providerId,
        dayOfWeek,
      },
    });

    if (!schedule) {
      return NextResponse.json(
        { error: 'Provider is not available on this day' },
        { status: 404 }
      );
    }

    // Get provider's availability exceptions
    const availability = await prisma.staffAvailability.findFirst({
      where: {
        staffId: providerId,
        date: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
      },
    });

    // Get existing appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId: providerId,
        businessId,
        startTime: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Generate time slots
    const timeSlots = [];
    let currentTime = parseISO(`${date}T${schedule.startTime}`);
    const endTime = parseISO(`${date}T${schedule.endTime}`);

    while (currentTime < endTime) {
      const timeSlot = format(currentTime, 'HH:mm');
      const isBooked = appointments.some(
        (apt: { startTime: Date; endTime: Date }) =>
          format(apt.startTime, 'HH:mm') <= timeSlot &&
          format(apt.endTime, 'HH:mm') > timeSlot
      );

      const isAvailable =
        !isBooked &&
        (!availability || availability.isAvailable) &&
        currentTime > new Date();

      timeSlots.push({
        time: timeSlot,
        available: isAvailable,
      });

      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
    }

    return NextResponse.json({
      schedule,
      availability,
      timeSlots,
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
} 