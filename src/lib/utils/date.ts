import { format as dateFnsFormat, formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

// Portuguese timezone
export const PORTUGAL_TIMEZONE = 'Europe/Lisbon';

/**
 * Formats a date to Portuguese timezone with Portuguese locale
 */
export function formatPortugueseDate(
  date: Date | string | number,
  formatStr: string = 'dd/MM/yyyy HH:mm'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  return formatInTimeZone(dateObj, PORTUGAL_TIMEZONE, formatStr, {
    locale: ptBR
  });
}

/**
 * Formats appointment time for staff portal
 */
export function formatAppointmentTime(scheduledFor: string | Date): string {
  return formatPortugueseDate(scheduledFor, 'dd/MM/yyyy HH:mm');
}

/**
 * Formats just the time portion
 */
export function formatTimeOnly(scheduledFor: string | Date): string {
  return formatPortugueseDate(scheduledFor, 'HH:mm');
}

/**
 * Formats just the date portion
 */
export function formatDateOnly(scheduledFor: string | Date): string {
  return formatPortugueseDate(scheduledFor, 'dd/MM/yyyy');
}

/**
 * Formats relative date (today, tomorrow, etc)
 */
export function formatRelativeDate(scheduledFor: string | Date): string {
  const dateObj = typeof scheduledFor === 'string' ? new Date(scheduledFor) : scheduledFor;
  const now = new Date();
  
  // Convert both to Portuguese timezone for comparison
  const appointmentDate = new Date(dateObj.toLocaleString("en-US", {timeZone: PORTUGAL_TIMEZONE}));
  const currentDate = new Date(now.toLocaleString("en-US", {timeZone: PORTUGAL_TIMEZONE}));
  
  const diffInDays = Math.floor((appointmentDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return `Hoje, ${formatTimeOnly(scheduledFor)}`;
  } else if (diffInDays === 1) {
    return `Amanhã, ${formatTimeOnly(scheduledFor)}`;
  } else if (diffInDays === -1) {
    return `Ontem, ${formatTimeOnly(scheduledFor)}`;
  } else {
    return formatPortugueseDate(scheduledFor, 'dd/MM/yyyy HH:mm');
  }
}

/**
 * Get current time in Portuguese timezone
 */
export function getPortugueseTime(): Date {
  return new Date(new Date().toLocaleString("en-US", {timeZone: PORTUGAL_TIMEZONE}));
} 