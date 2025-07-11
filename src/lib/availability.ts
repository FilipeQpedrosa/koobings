import { prisma } from '@/lib/prisma';
import { format, parseISO, parse, addMinutes } from 'date-fns';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface AvailabilityCheck {
  isAvailable: boolean;
  conflicts?: Array<{
    type: 'OUT_OF_HOURS' | 'UNAVAILABLE' | 'BOOKED';
    startTime?: string;
    endTime?: string;
  }>;
}

function getDayName(day: number): string {
  return [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][day];
}

export async function checkStaffAvailability(
  staffId: string,
  date: string | Date,
  timeSlot: TimeSlot
): Promise<AvailabilityCheck> {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const dayName = getDayName(checkDate.getDay());

  // Get staff availability JSON
  const staffAvailability = await prisma.staffAvailability.findUnique({
    where: { staffId },
  });
  if (!staffAvailability) {
    throw new Error('Staff availability not found');
  }
  const schedule = staffAvailability.schedule as Record<string, { start: string; end: string; isWorking?: boolean; timeSlots?: { start: string; end: string }[] }>;
  const daySchedule = schedule[dayName];

  const conflicts: AvailabilityCheck['conflicts'] = [];

  // Check regular working hours
  if (!daySchedule || daySchedule.isWorking === false) {
    conflicts.push({ type: 'OUT_OF_HOURS' });
  } else {
    // If using timeSlots array (multiple shifts per day)
    const slots = daySchedule.timeSlots || [ { start: daySchedule.start, end: daySchedule.end } ];
    const slotStart = parse(timeSlot.startTime, 'HH:mm', checkDate);
    const slotEnd = parse(timeSlot.endTime, 'HH:mm', checkDate);
    const inAnySlot = slots.some(slot => {
      const slotRangeStart = parse(slot.start, 'HH:mm', checkDate);
      const slotRangeEnd = parse(slot.end, 'HH:mm', checkDate);
      return slotStart >= slotRangeStart && slotEnd <= slotRangeEnd;
    });
    if (!inAnySlot) {
      conflicts.push({
        type: 'OUT_OF_HOURS',
        startTime: daySchedule.start,
        endTime: daySchedule.end,
      });
    }
  }

  // Check unavailability (vacation, sick, etc.)
  const unavailabilities = await prisma.staffUnavailability.findMany({
    where: {
      staffId,
      start: { lte: checkDate },
      end: { gte: checkDate },
    },
  });
  if (unavailabilities.length > 0) {
    conflicts.push({ type: 'UNAVAILABLE' });
  }

  // Check existing appointments
  const appointments = await prisma.appointments.findMany({
    where: {
      staffId,
      scheduledFor: {
        gte: new Date(format(checkDate, 'yyyy-MM-ddT00:00:00')),
        lt: new Date(format(checkDate, 'yyyy-MM-ddT23:59:59')),
      },
      status: { not: 'CANCELLED' },
    },
  });
  const slotStart = parse(timeSlot.startTime, 'HH:mm', checkDate);
  const slotEnd = parse(timeSlot.endTime, 'HH:mm', checkDate);
  const conflictingAppointments = appointments.filter(appointment => {
    const apptStart = appointment.scheduledFor;
    const apptEnd = addMinutes(apptStart, appointment.duration);
    return (
      (slotStart >= apptStart && slotStart < apptEnd) ||
      (slotEnd > apptStart && slotEnd <= apptEnd) ||
      (slotStart <= apptStart && slotEnd >= apptEnd)
    );
  });
  if (conflictingAppointments.length > 0) {
    conflicts.push(...conflictingAppointments.map(appointment => ({
      type: 'BOOKED' as const,
      startTime: format(appointment.scheduledFor, 'HH:mm'),
      endTime: format(addMinutes(appointment.scheduledFor, appointment.duration), 'HH:mm'),
    })));
  }

  return {
    isAvailable: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
  };
}

export async function getStaffAvailableSlots(
  staffId: string,
  date: string | Date,
  duration: number // in minutes
): Promise<TimeSlot[]> {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const dayName = getDayName(checkDate.getDay());

  // Get staff availability JSON
  const staffAvailability = await prisma.staffAvailability.findUnique({
    where: { staffId },
  });
  if (!staffAvailability) {
    throw new Error('Staff availability not found');
  }
  const schedule = staffAvailability.schedule as Record<string, { start: string; end: string; isWorking?: boolean; timeSlots?: { start: string; end: string }[] }>;
  const daySchedule = schedule[dayName];
  if (!daySchedule || daySchedule.isWorking === false) {
    return [];
  }
  const slotsArr = daySchedule.timeSlots || [ { start: daySchedule.start, end: daySchedule.end } ];
  const slots: TimeSlot[] = [];
  for (const slot of slotsArr) {
    let currentTime = slot.start;
    while (true) {
      const endTimeDate = parse(currentTime, 'HH:mm', checkDate);
      const nextEndTime = format(new Date(endTimeDate.getTime() + duration * 60000), 'HH:mm');
      const nextEndTimeDate = parse(nextEndTime, 'HH:mm', checkDate);
      const slotRangeEnd = parse(slot.end, 'HH:mm', checkDate);
      if (nextEndTimeDate > slotRangeEnd) break;
      const isSlotAvailable = await checkStaffAvailability(staffId, checkDate, {
        startTime: currentTime,
        endTime: nextEndTime,
      });
      if (isSlotAvailable.isAvailable) {
        slots.push({ startTime: currentTime, endTime: nextEndTime });
      }
      const currentDate = parse(currentTime, 'HH:mm', checkDate);
      const nextTime = new Date(currentDate.getTime() + 30 * 60000);
      currentTime = format(nextTime, 'HH:mm');
      if (parse(currentTime, 'HH:mm', checkDate) >= slotRangeEnd) break;
    }
  }
  return slots;
} 