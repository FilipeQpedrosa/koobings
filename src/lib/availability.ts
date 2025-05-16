import { prisma } from '@/lib/prisma';
import { format, parseISO, isSameDay, parse } from 'date-fns';
import { Staff, Schedule, StaffAvailability, Appointment } from '@prisma/client';

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

interface StaffWithRelations extends Staff {
  schedules: Schedule[];
  availability: StaffAvailability[];
  appointments: Appointment[];
}

export async function checkStaffAvailability(
  staffId: string,
  date: string | Date,
  timeSlot: TimeSlot
): Promise<AvailabilityCheck> {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const formattedDate = format(checkDate, 'yyyy-MM-dd');

  // Get staff member with their regular schedule and availability exceptions
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      schedules: true,
      availability: {
        where: {
          date: checkDate
        }
      },
      appointments: {
        where: {
          startTime: {
            gte: checkDate,
            lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }
    }
  }) as StaffWithRelations | null;

  if (!staff) {
    throw new Error('Staff member not found');
  }

  const conflicts: AvailabilityCheck['conflicts'] = [];

  // Check regular schedule
  const dayOfWeek = checkDate.getDay();
  const regularSchedule = staff.schedules.find(s => s.dayOfWeek === dayOfWeek);
  
  if (!regularSchedule) {
    conflicts.push({ type: 'OUT_OF_HOURS' });
  } else {
    if (timeSlot.startTime < regularSchedule.startTime || 
        timeSlot.endTime > regularSchedule.endTime) {
      conflicts.push({
        type: 'OUT_OF_HOURS',
        startTime: regularSchedule.startTime,
        endTime: regularSchedule.endTime
      });
    }
  }

  // Check availability exceptions
  const availabilityException = staff.availability.find(a => {
    if (!isSameDay(a.date, checkDate)) return false;

    const slotStart = parse(timeSlot.startTime, 'HH:mm', checkDate);
    const slotEnd = parse(timeSlot.endTime, 'HH:mm', checkDate);
    const availStart = parse(a.startTime, 'HH:mm', checkDate);
    const availEnd = parse(a.endTime, 'HH:mm', checkDate);

    return (
      (slotStart >= availStart && slotStart < availEnd) ||
      (slotEnd > availStart && slotEnd <= availEnd) ||
      (slotStart <= availStart && slotEnd >= availEnd)
    );
  });

  if (availabilityException && !availabilityException.isAvailable) {
    conflicts.push({
      type: 'UNAVAILABLE',
      startTime: availabilityException.startTime,
      endTime: availabilityException.endTime
    });
  }

  // Check existing appointments
  const conflictingAppointments = staff.appointments.filter(appointment => {
    const slotStart = parse(timeSlot.startTime, 'HH:mm', checkDate);
    const slotEnd = parse(timeSlot.endTime, 'HH:mm', checkDate);
    const apptStart = appointment.startTime;
    const apptEnd = appointment.endTime;

    return (
      (slotStart >= apptStart && slotStart < apptEnd) ||
      (slotEnd > apptStart && slotEnd <= apptEnd) ||
      (slotStart <= apptStart && slotEnd >= apptEnd)
    );
  });

  if (conflictingAppointments.length > 0) {
    conflicts.push(...conflictingAppointments.map(appointment => ({
      type: 'BOOKED' as const,
      startTime: format(appointment.startTime, 'HH:mm'),
      endTime: format(appointment.endTime, 'HH:mm')
    })));
  }

  return {
    isAvailable: conflicts.length === 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
}

export async function getStaffAvailableSlots(
  staffId: string,
  date: string | Date,
  duration: number // in minutes
): Promise<TimeSlot[]> {
  const checkDate = typeof date === 'string' ? parseISO(date) : date;
  const formattedDate = format(checkDate, 'yyyy-MM-dd');

  // Get staff member with their schedule and availability
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    include: {
      schedules: {
        where: {
          dayOfWeek: checkDate.getDay()
        }
      },
      availability: {
        where: {
          date: checkDate
        }
      },
      appointments: {
        where: {
          startTime: {
            gte: checkDate,
            lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
          },
          status: {
            not: 'CANCELLED'
          }
        }
      }
    }
  }) as StaffWithRelations | null;

  if (!staff) {
    throw new Error('Staff member not found');
  }

  const schedule = staff.schedules[0];
  if (!schedule) {
    return []; // Not working on this day
  }

  const slots: TimeSlot[] = [];
  let currentTime = schedule.startTime;
  const scheduleEnd = schedule.endTime;

  while (currentTime < scheduleEnd) {
    const endTimeDate = parse(currentTime, 'HH:mm', checkDate);
    const nextEndTime = format(new Date(endTimeDate.getTime() + duration * 60000), 'HH:mm');

    if (nextEndTime > scheduleEnd) break;

    const isSlotAvailable = await checkStaffAvailability(staffId, checkDate, {
      startTime: currentTime,
      endTime: nextEndTime
    });

    if (isSlotAvailable.isAvailable) {
      slots.push({ startTime: currentTime, endTime: nextEndTime });
    }

    const currentDate = parse(currentTime, 'HH:mm', checkDate);
    currentTime = format(new Date(currentDate.getTime() + 30 * 60000), 'HH:mm'); // 30-minute intervals
  }

  return slots;
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
} 