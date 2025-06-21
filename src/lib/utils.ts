import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateTimeSlots(start: Date, end: Date, interval: number): Date[] {
  const slots = [];
  let current = new Date(start);

  while (current < end) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + interval);
  }

  return slots;
}
