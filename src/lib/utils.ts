import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("pt-PT", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function formatPhoneNumber(phone: string) {
  // Format Portuguese phone number
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]}`;
  }
  return phone;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number
) {
  const slots: Date[] = [];
  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    slots.push(new Date(currentTime));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  return slots;
} 