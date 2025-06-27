import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, isWithinInterval, areIntervalsOverlapping, parse } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');
    const time = searchParams.get('time'); // Expected format: "HH:mm"

    if (!serviceId || !date) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Service ID and date are required' } },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const dayStart = startOfDay(bookingDate);
    const dayEnd = endOfDay(bookingDate);
    const dayOfWeek = bookingDate.getDay();

    // If time is provided, set it on the booking date
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);
    }

    // Get service details including duration and staff
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        duration: true,
        staff: {
          include: {
            availability: true,
            appointments: {
              where: {
                scheduledFor: {
                  gte: dayStart,
                  lte: dayEnd
                },
                status: {
                  not: 'CANCELLED'
                }
              },
              select: {
                scheduledFor: true,
                duration: true
              }
            }
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    // Process each staff's availability using the new availability JSON
    const availableStaff = service.staff.map((staff: any) => {
      // Use the availability JSON to get the working hours for the day
      type DaySchedule = { start: string; end: string; [key: string]: any };
      type ScheduleJson = Record<string, DaySchedule>;
      const schedule = staff.availability?.schedule as ScheduleJson | undefined;
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      const dayKey = days[dayOfWeek];
      const daySchedule = schedule?.[dayKey];

      let isAvailable = !!daySchedule && !!daySchedule.start && !!daySchedule.end;

      if (isAvailable && time && daySchedule && daySchedule.start && daySchedule.end) {
        const scheduleStart = parse(daySchedule.start, 'HH:mm', bookingDate);
        const scheduleEnd = parse(daySchedule.end, 'HH:mm', bookingDate);
        const requestedTime = parse(time, 'HH:mm', bookingDate);
        const serviceEndTime = addMinutes(requestedTime, service.duration);

        isAvailable = isWithinInterval(requestedTime, { start: scheduleStart, end: scheduleEnd }) &&
                     isWithinInterval(serviceEndTime, { start: scheduleStart, end: scheduleEnd });

        // Check for appointment conflicts
        if (isAvailable && staff.appointments.length > 0) {
          isAvailable = !staff.appointments.some((appointment: { scheduledFor: Date | string; duration: number }) => {
            const appointmentStart = new Date(appointment.scheduledFor);
            const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
            return areIntervalsOverlapping(
              { start: requestedTime, end: serviceEndTime },
              { start: appointmentStart, end: appointmentEnd }
            );
          });
        }
      }

      let scheduleObj = null;
      if (daySchedule?.start && daySchedule?.end) {
        scheduleObj = {
          start: daySchedule.start,
          end: daySchedule.end
        };
      }
      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        isAvailable,
        schedule: scheduleObj
      };
    });

    return NextResponse.json({ success: true, data: availableStaff });
  } catch (error) {
    console.error('Error checking staff availability:', error);
    return NextResponse.json(
      { success: false, error: { code: 'STAFF_AVAILABILITY_ERROR', message: 'Failed to check availability' } },
      { status: 500 }
    );
  }
} 