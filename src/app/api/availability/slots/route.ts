import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse, format, addMinutes, setHours, setMinutes, setSeconds, getDay, isWithinInterval } from 'date-fns';
import { generateTimeSlots } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date');

    if (!serviceId || !dateStr) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Service ID and date are required' } },
        { status: 400 }
      );
    }

    // Parse the date string
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());

    // Fetch service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        business: {
          include: {
            businessHours: true,
          },
        },
        staff: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    // Get business hours for the given date
    const dayOfWeek = new Date(date).getDay();
    const businessHours = service.business.businessHours.find(
      (hours: { dayOfWeek: number }) => hours.dayOfWeek === dayOfWeek
    );

    if (!businessHours || !businessHours.isOpen) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Generate time slots
    const slots: { time: string; available: boolean }[] = [];
    let currentTime = businessHours.startTime ? parse(businessHours.startTime, 'HH:mm', new Date()) : setHours(setMinutes(new Date(), 0), 9);
    const closeTime = businessHours.endTime ? parse(businessHours.endTime, 'HH:mm', new Date()) : setHours(setMinutes(new Date(), 0), 17);

    while (currentTime < closeTime) {
      const timeSlot = format(currentTime, 'HH:mm:ss');

      // Check if any staff member is available at this time
      const isAvailable = await checkStaffAvailability(
        service.staff,
        date,
        timeSlot,
        service.duration
      );

      slots.push({
        time: timeSlot,
        available: isAvailable,
      });

      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    console.error('Error fetching time slots:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SLOTS_FETCH_ERROR', message: 'Failed to fetch time slots' } },
      { status: 500 }
    );
  }
}

async function checkStaffAvailability(
  staff: any[],
  date: Date,
  time: string,
  duration: number
) {
  // Convert appointment time to Date object
  const appointmentStart = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
  const appointmentEnd = addMinutes(appointmentStart, duration);

  // Check existing appointments for each staff member
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      staffId: {
        in: staff.map((s) => s.id),
      },
      scheduledFor: {
        gte: new Date(format(date, 'yyyy-MM-ddT00:00:00')),
        lt: new Date(format(date, 'yyyy-MM-ddT23:59:59')),
      },
      NOT: {
        status: 'CANCELLED',
      },
    },
    select: {
      staffId: true,
      scheduledFor: true,
      duration: true,
    },
  });

  // Check if at least one staff member is available
  return staff.some((staffMember) => {
    const staffAppointments = existingAppointments.filter(
      (apt: { staffId: string }) => apt.staffId === staffMember.id
    );

    // Check if the staff member has any conflicting appointments
    const hasConflict = staffAppointments.some((apt: { scheduledFor: Date | string; duration: number }) => {
      const existingStart = new Date(apt.scheduledFor);
      const existingEnd = addMinutes(existingStart, apt.duration);

      return (
        isWithinInterval(appointmentStart, { start: existingStart, end: existingEnd }) ||
        isWithinInterval(appointmentEnd, { start: existingStart, end: existingEnd }) ||
        isWithinInterval(existingStart, { start: appointmentStart, end: appointmentEnd })
      );
    });

    return !hasConflict;
  });
} 