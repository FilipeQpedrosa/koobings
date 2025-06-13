import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseISO, addMinutes, format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date || !serviceId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_PARAMETERS', message: 'Missing required parameters' } }, { status: 400 });
    }

    // Get service details
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    // Get business hours (assuming 9 AM to 5 PM for now)
    const startHour = 9;
    const endHour = 17;

    // Get existing appointments for the date
    const appointments = await prisma.appointment.findMany({
      where: {
        scheduledFor: {
          gte: new Date(`${date}T00:00:00Z`),
          lt: new Date(`${date}T23:59:59Z`),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        scheduledFor: true,
        duration: true,
      },
    });

    // Generate all possible time slots
    const timeSlots = [];
    const startTime = new Date(`${date}T${startHour.toString().padStart(2, '0')}:00:00Z`);
    const endTime = new Date(`${date}T${endHour.toString().padStart(2, '0')}:00:00Z`);
    let currentSlot = startTime;

    while (currentSlot < endTime) {
      const slotEnd = addMinutes(currentSlot, service.duration);
      
      // Check if slot overlaps with any existing appointment
      const isAvailable = !appointments.some((apt: { scheduledFor: Date | string; duration: number }) => {
        const appointmentStart = new Date(apt.scheduledFor);
        const appointmentEnd = addMinutes(appointmentStart, apt.duration);
        return (
          (currentSlot >= appointmentStart && currentSlot < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd)
        );
      });

      timeSlots.push({
        time: format(currentSlot, 'HH:mm'),
        available: isAvailable,
      });

      currentSlot = addMinutes(currentSlot, 30); // 30-minute intervals
    }

    return NextResponse.json({ success: true, data: timeSlots });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json({ success: false, error: { code: 'AVAILABILITY_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 