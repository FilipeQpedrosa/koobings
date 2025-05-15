import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, format, parse } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const staffId = searchParams.get('staffId');
    const date = searchParams.get('date');

    if (!serviceId || !staffId || !date) {
      return NextResponse.json(
        { error: 'Service ID, staff ID, and date are required' },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const dayStart = startOfDay(bookingDate);
    const dayEnd = endOfDay(bookingDate);

    // Get service duration and staff schedule
    const [service, staff] = await Promise.all([
      prisma.service.findUnique({
        where: { id: serviceId },
        select: { duration: true }
      }),
      prisma.staff.findUnique({
        where: { id: staffId },
        include: {
          schedules: {
            where: {
              dayOfWeek: bookingDate.getDay()
            }
          },
          appointments: {
            where: {
              startTime: {
                gte: dayStart,
                lte: dayEnd
              }
            },
            select: {
              startTime: true,
              endTime: true
            }
          }
        }
      })
    ]);

    if (!service || !staff) {
      return NextResponse.json(
        { error: 'Service or staff member not found' },
        { status: 404 }
      );
    }

    const schedule = staff.schedules[0];
    if (!schedule) {
      return NextResponse.json(
        { error: 'Staff member is not available on this day' },
        { status: 400 }
      );
    }

    // Generate all possible time slots for the day
    const timeSlots: TimeSlot[] = [];
    const startTime = parse(schedule.startTime, 'HH:mm', dayStart);
    const endTime = parse(schedule.endTime, 'HH:mm', dayStart);
    let currentTime = startTime;

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const slotEndTime = addMinutes(currentTime, service.duration);

      // Check if the time slot conflicts with any existing appointments
      const isConflicting = staff.appointments.some(appointment => {
        const appointmentStart = new Date(appointment.startTime);
        const appointmentEnd = new Date(appointment.endTime);
        return (
          (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
          (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd)
        );
      });

      timeSlots.push({
        time: timeString,
        available: !isConflicting
      });

      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return NextResponse.json(timeSlots);
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 