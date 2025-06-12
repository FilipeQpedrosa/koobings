import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO, format } from 'date-fns';

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

    // Get provider's weekly schedule (JSON)
    const staffAvailability = await prisma.staffAvailability.findFirst({
      where: {
        staffId: providerId,
      },
    });

    if (!staffAvailability || !staffAvailability.schedule) {
      return NextResponse.json(
        { error: 'Provider has no schedule set' },
        { status: 404 }
      );
    }

    // Extract the day's schedule from the JSON (0=Sunday, 6=Saturday)
    const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const dayKey = days[dayOfWeek];
    const scheduleObj = staffAvailability.schedule as Record<string, any>;
    const daySchedule = scheduleObj[dayKey];

    if (!daySchedule || !daySchedule.isWorking) {
      return NextResponse.json(
        { error: 'Provider is not available on this day' },
        { status: 404 }
      );
    }

    // Get provider's availability exceptions
    const availability = await prisma.staffAvailability.findFirst({
      where: {
        staffId: providerId,
      },
    });

    // Get existing appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId: providerId,
        businessId,
        scheduledFor: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        scheduledFor: true,
        duration: true,
      },
    });

    // Generate time slots
    const timeSlots = [];
    let currentTime = parseISO(`${date}T${daySchedule.timeSlots[0]?.start}`);
    const endTime = parseISO(`${date}T${daySchedule.timeSlots[0]?.end}`);

    while (currentTime < endTime) {
      const timeSlot = format(currentTime, 'HH:mm');
      const isBooked = appointments.some(
        (apt: { scheduledFor: Date; duration: number }) => {
          const aptStart = apt.scheduledFor;
          const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
          return (
            format(aptStart, 'HH:mm') <= timeSlot &&
            format(aptEnd, 'HH:mm') > timeSlot
          );
        }
      );

      const isAvailable =
        !isBooked &&
        currentTime > new Date();

      timeSlots.push({
        time: timeSlot,
        available: isAvailable,
      });

      currentTime = new Date(currentTime.getTime() + 30 * 60000); // Add 30 minutes
    }

    return NextResponse.json({
      schedule: daySchedule,
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