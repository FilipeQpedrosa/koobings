import { parse, isWithinInterval } from 'date-fns';

/**
 * Check if a time slot conflicts with lunch break
 */
export function isTimeSlotDuringLunchBreak(
  timeSlot: { start: string; end: string },
  lunchBreak: { start: string | null; end: string | null },
  date: Date
): boolean {
  // If no lunch break is defined, no conflict
  if (!lunchBreak.start || !lunchBreak.end) {
    return false;
  }

  try {
    const slotStart = parse(timeSlot.start, 'HH:mm', date);
    const slotEnd = parse(timeSlot.end, 'HH:mm', date);
    const lunchStart = parse(lunchBreak.start, 'HH:mm', date);
    const lunchEnd = parse(lunchBreak.end, 'HH:mm', date);

    // Check if there's any overlap between the time slot and lunch break
    return (
      // Slot starts during lunch break
      isWithinInterval(slotStart, { start: lunchStart, end: lunchEnd }) ||
      // Slot ends during lunch break
      isWithinInterval(slotEnd, { start: lunchStart, end: lunchEnd }) ||
      // Slot completely encompasses lunch break
      (slotStart <= lunchStart && slotEnd >= lunchEnd)
    );
  } catch (error) {
    console.error('Error checking lunch break conflict:', error);
    return false;
  }
}

/**
 * Check if a specific time conflicts with lunch break
 */
export function isTimeDuringLunchBreak(
  time: string,
  lunchBreak: { start: string | null; end: string | null },
  date: Date
): boolean {
  // If no lunch break is defined, no conflict
  if (!lunchBreak.start || !lunchBreak.end) {
    return false;
  }

  try {
    const checkTime = parse(time, 'HH:mm', date);
    const lunchStart = parse(lunchBreak.start, 'HH:mm', date);
    const lunchEnd = parse(lunchBreak.end, 'HH:mm', date);

    return isWithinInterval(checkTime, { start: lunchStart, end: lunchEnd });
  } catch (error) {
    console.error('Error checking lunch break conflict:', error);
    return false;
  }
}

/**
 * Split working hours around lunch break to create available time slots
 */
export function splitWorkingHoursAroundLunchBreak(
  workingHours: { start: string; end: string },
  lunchBreak: { start: string | null; end: string | null }
): { start: string; end: string }[] {
  // If no lunch break, return original working hours
  if (!lunchBreak.start || !lunchBreak.end) {
    return [workingHours];
  }

  const slots: { start: string; end: string }[] = [];

  // Morning slot (before lunch)
  if (workingHours.start < lunchBreak.start) {
    slots.push({
      start: workingHours.start,
      end: lunchBreak.start
    });
  }

  // Afternoon slot (after lunch)
  if (lunchBreak.end < workingHours.end) {
    slots.push({
      start: lunchBreak.end,
      end: workingHours.end
    });
  }

  return slots;
}
