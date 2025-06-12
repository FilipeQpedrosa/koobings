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
          availability: true,
          appointments: {
            where: {
              scheduledFor: {
                gte: dayStart,
                lte: dayEnd
              }
            },
            select: {
              scheduledFor: true,
              duration: true
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

    // Type the schedule JSON for safe access
    type DaySchedule = { start: string; end: string; [key: string]: any };
    type ScheduleJson = Record<string, DaySchedule>;
    const schedule = staff.availability?.schedule as ScheduleJson | undefined;
    const dayOfWeek = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySchedule = schedule?.[dayOfWeek];
    if (!daySchedule || !daySchedule.start || !daySchedule.end) {
      return NextResponse.json(
        { error: 'Staff member is not available on this day' },
        { status: 400 }
      );
    }

    // Generate all possible time slots for the day
    const timeSlots: TimeSlot[] = [];
    const startTime = parse(daySchedule.start, 'HH:mm', dayStart);
    const endTime = parse(daySchedule.end, 'HH:mm', dayStart);
    let currentTime = startTime;

    while (currentTime < endTime) {
      const timeString = format(currentTime, 'HH:mm');
      const slotEndTime = addMinutes(currentTime, service.duration);

      // Check if the time slot conflicts with any existing appointments
      const isConflicting = staff.appointments.some((appointment: { scheduledFor: Date | string; duration: number }) => {
        const appointmentStart = new Date(appointment.scheduledFor);
        const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
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