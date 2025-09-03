import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, format, parse } from 'date-fns';
import { isTimeSlotDuringLunchBreak, isTimeDuringLunchBreak } from '@/lib/lunch-break-utils';

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
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Service ID, staff ID, and date are required' } },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const dayStart = startOfDay(bookingDate);
    const dayEnd = endOfDay(bookingDate);

    console.log(`🔍 [AVAILABILITY] Checking availability for service ${serviceId}, staff ${staffId}, date ${date}`);

    // First get staff to find business ID
    const staffMember = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { businessId: true }
    });

    if (!staffMember) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Staff member not found' } },
        { status: 404 }
      );
    }

    // Get service with ALL configuration fields and staff schedule
    const [service, staff, businessHours] = await Promise.all([
      prisma.service.findUnique({
        where: { id: serviceId },
        select: { 
          duration: true,
          availableDays: true,
          anyTimeAvailable: true,
          slots: true,
          startTime: true,
          endTime: true,
          name: true,
          Business: {
            select: {
              id: true
            }
          }
        }
      }),
      prisma.staff.findUnique({
        where: { id: staffId },
        include: {
          StaffAvailability: true,
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
          },
          Business: {
            select: {
              id: true
            }
          }
        }
      }),
      prisma.businessHours.findMany({
        where: {
          businessId: staffMember.businessId // Use the correct business ID
        },
        orderBy: { dayOfWeek: 'asc' }
      })
    ]);

    if (!service || !staff) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Service or staff member not found' } },
        { status: 404 }
      );
    }

    // Get business hours for today
    const dayOfWeek = bookingDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todayBusinessHours = businessHours.find(h => h.dayOfWeek === dayOfWeek);
    
    console.log(`📋 [AVAILABILITY] Business hours for ${dayOfWeek}:`, todayBusinessHours);

    // Check if business is open today
    if (!todayBusinessHours || !todayBusinessHours.isOpen) {
      console.log(`❌ [AVAILABILITY] Business is closed on ${dayOfWeek} (${bookingDate.toLocaleDateString('en-US', { weekday: 'long' })})`);
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: `Business is closed on ${bookingDate.toLocaleDateString('en-US', { weekday: 'long' })}`
      });
    }

    // Get business operating hours for today
    const businessStartTime = todayBusinessHours.startTime;
    const businessEndTime = todayBusinessHours.endTime;
    
    console.log(`🕒 [AVAILABILITY] Business hours today: ${businessStartTime} - ${businessEndTime}`);

    console.log(`📋 [AVAILABILITY] Service "${service.name}" config:`, {
      duration: service.duration,
      availableDays: service.availableDays,
      anyTimeAvailable: service.anyTimeAvailable,
      hasSlots: !!service.slots,
      startTime: service.startTime,
      endTime: service.endTime
    });

    // 1. CHECK DAY AVAILABILITY
    // If service has specific available days configured, check if today is allowed
    if (service.availableDays && service.availableDays.length > 0) {
      if (!service.availableDays.includes(dayOfWeek)) {
        console.log(`❌ [AVAILABILITY] Service not available on ${dayOfWeek} (${bookingDate.toLocaleDateString('en-US', { weekday: 'long' })}). Available days: ${service.availableDays}`);
        return NextResponse.json({ 
          success: true, 
          data: [],
          message: `Service not available on ${bookingDate.toLocaleDateString('en-US', { weekday: 'long' })}`
        });
      }
    }

    console.log(`✅ [AVAILABILITY] Day ${dayOfWeek} is allowed for this service`);

    // 2. DETERMINE TIME SLOTS BASED ON SERVICE CONFIGURATION
    let timeSlots: TimeSlot[] = [];

    if (service.slots && !service.anyTimeAvailable) {
      // SERVICE HAS SPECIFIC SLOTS CONFIGURED
      console.log(`🎯 [AVAILABILITY] Using configured slots for service`);
      
      try {
        let slotsArray: Array<{ startTime: string; endTime: string; availableDays?: number[] }> = [];
        
        if (typeof service.slots === 'object' && service.slots !== null) {
          if (Array.isArray(service.slots)) {
            // Old format: array of slots with optional availableDays
            slotsArray = service.slots as Array<{ startTime: string; endTime: string; availableDays?: number[] }>;
          } else {
            // New format: object with day names as keys
            const dayName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const daySlots = (service.slots as any)[dayName];
            if (daySlots && Array.isArray(daySlots)) {
              slotsArray = daySlots.map((slot: any) => ({
                startTime: slot.startTime,
                endTime: slot.endTime
              }));
            }
          }
        }

        console.log(`📅 [AVAILABILITY] Found ${slotsArray.length} configured slots`);

        for (const slot of slotsArray) {
          // If slot has specific availableDays, check if today is allowed
          if (slot.availableDays && slot.availableDays.length > 0) {
            if (!slot.availableDays.includes(dayOfWeek)) {
              console.log(`⏭️ [AVAILABILITY] Skipping slot ${slot.startTime}-${slot.endTime} (not available on day ${dayOfWeek})`);
              continue;
            }
          }

          const slotStart = parse(slot.startTime, 'HH:mm', dayStart);
          const slotEnd = parse(slot.endTime, 'HH:mm', dayStart);

          // Check if this slot conflicts with existing appointments
          const isConflicting = staff.appointments.some((appointment: { scheduledFor: Date | string; duration: number }) => {
            const appointmentStart = new Date(appointment.scheduledFor);
            const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
            return (
              (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
              (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
              (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
            );
          });

          timeSlots.push({
            time: slot.startTime,
            available: !isConflicting
          });

          console.log(`📌 [AVAILABILITY] Slot ${slot.startTime}: ${isConflicting ? 'BUSY' : 'AVAILABLE'}`);
        }

      } catch (error) {
        console.error(`❌ [AVAILABILITY] Error parsing slots:`, error);
        console.log(`🔄 [AVAILABILITY] Falling back to any-time availability`);
        // Fall back to any-time availability if slots parsing fails
      }
    }

    if (timeSlots.length === 0 && (service.anyTimeAvailable || !service.slots)) {
      // SERVICE ALLOWS ANY TIME WITHIN BUSINESS HOURS
      console.log(`🕐 [AVAILABILITY] Generating flexible time slots`);

      // Use business hours as the primary constraint, then service/staff times
      let finalStartTime = businessStartTime || '09:00';
      let finalEndTime = businessEndTime || '18:00';
      
      console.log(`🏢 [AVAILABILITY] Business hours constraint: ${finalStartTime} - ${finalEndTime}`);
      
      // Get staff schedule for this day
      type DaySchedule = { start: string; end: string; [key: string]: any };
      type ScheduleJson = Record<string, DaySchedule>;
      const schedule = staff.StaffAvailability?.schedule as ScheduleJson | undefined;
      const dayOfWeekName = bookingDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      let daySchedule = schedule?.[dayOfWeekName];
      
      // Use service-specific times if available, but constrain to business hours
      const serviceStart = service.startTime;
      const serviceEnd = service.endTime;
      
      if (serviceStart && serviceEnd) {
        console.log(`🎯 [AVAILABILITY] Service hours: ${serviceStart} - ${serviceEnd}`);
        // Use the most restrictive time range (intersection of business and service hours)
        finalStartTime = serviceStart > finalStartTime ? serviceStart : finalStartTime;
        finalEndTime = serviceEnd < finalEndTime ? serviceEnd : finalEndTime;
      } else if (daySchedule && daySchedule.start && daySchedule.end) {
        console.log(`👤 [AVAILABILITY] Staff schedule: ${daySchedule.start} - ${daySchedule.end}`);
        // Use the most restrictive time range (intersection of business and staff hours)
        finalStartTime = daySchedule.start > finalStartTime ? daySchedule.start : finalStartTime;
        finalEndTime = daySchedule.end < finalEndTime ? daySchedule.end : finalEndTime;
      }
      
      console.log(`⏰ [AVAILABILITY] Final operating hours: ${finalStartTime} - ${finalEndTime}`);
      
      // Validate that we have valid hours
      if (!finalStartTime || !finalEndTime) {
        console.log(`❌ [AVAILABILITY] Invalid operating hours - no slots available`);
        return NextResponse.json({ 
          success: true, 
          data: [],
          message: 'No operating hours configured for this day'
        });
      }

      // Generate flexible time slots within the constrained hours
      const startTime = parse(finalStartTime, 'HH:mm', dayStart);
      const endTime = parse(finalEndTime, 'HH:mm', dayStart);
      let currentTime = startTime;

      while (currentTime < endTime) {
        const timeString = format(currentTime, 'HH:mm');
        const slotEndTime = addMinutes(currentTime, service.duration);

        // Skip if slot would extend beyond end time
        if (slotEndTime > endTime) {
          break;
        }

        // Check if the time slot conflicts with any existing appointments
        const isConflicting = staff.appointments.some((appointment: { scheduledFor: Date | string; duration: number }) => {
          const appointmentStart = new Date(appointment.scheduledFor);
          const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
          return (
            (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
            (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
            (currentTime <= appointmentStart && slotEndTime >= appointmentEnd)
          );
        });

        // Check if the time slot conflicts with business lunch break
        const slotEndTimeString = format(slotEndTime, 'HH:mm');
        const isDuringBusinessLunchBreak = isTimeSlotDuringLunchBreak(
          { start: timeString, end: slotEndTimeString },
          { start: (todayBusinessHours as any).lunchBreakStart, end: (todayBusinessHours as any).lunchBreakEnd },
          bookingDate
        );

        // Check if the time slot conflicts with staff lunch break (if staff has individual schedule)
        let isDuringStaffLunchBreak = false;
        if (staff.StaffAvailability?.schedule) {
          const schedule = staff.StaffAvailability.schedule as Record<string, any>;
          const dayKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][dayOfWeek];
          const daySchedule = schedule[dayKey];
          
          if (daySchedule?.lunchBreakStart && daySchedule?.lunchBreakEnd) {
            isDuringStaffLunchBreak = isTimeSlotDuringLunchBreak(
              { start: timeString, end: slotEndTimeString },
              { start: daySchedule.lunchBreakStart, end: daySchedule.lunchBreakEnd },
              bookingDate
            );
          }
        }

        const isAvailable = !isConflicting && !isDuringBusinessLunchBreak && !isDuringStaffLunchBreak;

        timeSlots.push({
          time: timeString,
          available: isAvailable
        });

        if (isDuringBusinessLunchBreak || isDuringStaffLunchBreak) {
          console.log(`🍽️ [AVAILABILITY] Time slot ${timeString} blocked due to lunch break`);
        }

        currentTime = addMinutes(currentTime, 30); // 30-minute intervals
      }

      console.log(`📋 [AVAILABILITY] Generated ${timeSlots.length} flexible time slots`);
    }

    console.log(`✅ [AVAILABILITY] Final result: ${timeSlots.length} total slots, ${timeSlots.filter(s => s.available).length} available`);

    return NextResponse.json({ success: true, data: timeSlots });
  } catch (error) {
    console.error('❌ [AVAILABILITY] Error fetching available time slots:', error);
    return NextResponse.json(
      { success: false, error: { code: 'AVAILABILITY_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 