import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parse, format, addMinutes, setHours, setMinutes, setSeconds, getDay, isWithinInterval } from 'date-fns';
import { AppointmentService } from '@/lib/services/appointment';

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

    // The user has clarified that staff are available 24/7 unless constrained.
    // We will generate slots for the entire day and check against constraints,
    // ignoring general business hours.
    const dayStart = setHours(setMinutes(setSeconds(date, 0), 0), 0);
    const dayEnd = setHours(setMinutes(setSeconds(date, 59), 59), 23);
    
    // Generate time slots every 30 minutes for the entire day
    const slots: { time: string; available: boolean }[] = [];
    let currentTime = dayStart;

    while (currentTime < dayEnd) {
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
  const appointmentStart = new Date(`${format(date, 'yyyy-MM-dd')}T${time}`);
  const appointmentEnd = addMinutes(appointmentStart, duration);
  const staffIds = staff.map((s) => s.id);

  // 1. Fetch all conflicting appointments for the involved staff on that day
  const existingAppointments = await prisma.appointment.findMany({
    where: {
      staffId: { in: staffIds },
      scheduledFor: {
        gte: new Date(format(appointmentStart, "yyyy-MM-dd'T'00:00:00")),
        lt: new Date(format(appointmentStart, "yyyy-MM-dd'T'23:59:59")),
      },
      NOT: { status: 'CANCELLED' },
    },
  });

  // 2. Fetch all unavailability blocks for the involved staff that overlap the slot
  const unavailabilities = await prisma.staffUnavailability.findMany({
    where: {
      staffId: { in: staffIds },
      start: { lte: appointmentEnd },
      end: { gte: appointmentStart },
    },
  });

  // Find at least one staff member who is available
  for (const staffMember of staff) {
    // Check for conflicting appointments
    const hasAppointmentConflict = existingAppointments.some((apt: any) => {
      if (apt.staffId !== staffMember.id) return false;
      const existingStart = new Date(apt.scheduledFor);
      const existingEnd = addMinutes(existingStart, apt.duration);
      // Check for overlap
      return appointmentStart < existingEnd && appointmentEnd > existingStart;
    });

    if (hasAppointmentConflict) {
      continue; // This staff member is busy, try next one
    }

    // Check for an unavailability block
    const hasUnavailability = unavailabilities.some(
      (unav: any) => unav.staffId === staffMember.id
    );

    if (hasUnavailability) {
      continue; // This staff member is unavailable, try next one
    }

    // If we reach here, we found an available staff member
    return true;
  }

  // If the loop completes without finding anyone, the slot is unavailable
  return false;
} 