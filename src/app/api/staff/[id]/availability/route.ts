import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parse, format, addMinutes, isAfter, isBefore } from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const duration = parseInt(searchParams.get('duration') || '30');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const staffId = params.id;

    // Parse the date
    const selectedDate = new Date(date);
    const dayStart = startOfDay(selectedDate);
    const dayEnd = endOfDay(selectedDate);

    // Get existing appointments for the staff on this date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        staffId: staffId,
        scheduledFor: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        scheduledFor: true,
        duration: true,
      },
    });

    // Generate all possible time slots (8:00 to 20:00, every 30 minutes)
    const allSlots: string[] = [];
    for (let h = 8; h <= 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Don't create slots that would end after 20:30
        const slotStart = new Date(selectedDate);
        slotStart.setHours(h, m, 0, 0);
        const slotEnd = addMinutes(slotStart, duration);
        
        if (slotEnd.getHours() > 20 || (slotEnd.getHours() === 20 && slotEnd.getMinutes() > 30)) {
          continue;
        }

        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        allSlots.push(`${hour}:${min}`);
      }
    }

    // Filter out past slots if it's today
    const now = new Date();
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
    
    let availableSlots = allSlots;
    
    if (isToday) {
      availableSlots = allSlots.filter((timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        const slotTime = new Date(selectedDate);
        slotTime.setHours(h, m, 0, 0);
        return isAfter(slotTime, now);
      });
    }

    // Filter out slots that conflict with existing appointments
    availableSlots = availableSlots.filter((timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      const slotStart = new Date(selectedDate);
      slotStart.setHours(h, m, 0, 0);
      const slotEnd = addMinutes(slotStart, duration);

      // Check if this slot conflicts with any existing appointment
      return !existingAppointments.some((appointment) => {
        const appointmentStart = new Date(appointment.scheduledFor);
        const appointmentEnd = addMinutes(appointmentStart, appointment.duration);

        // Check for overlap: slot overlaps with appointment if:
        // - slot starts before appointment ends AND
        // - slot ends after appointment starts
        return (
          isBefore(slotStart, appointmentEnd) && 
          isAfter(slotEnd, appointmentStart)
        );
      });
    });

    return NextResponse.json({
      success: true,
      availableSlots,
      totalSlots: availableSlots.length,
      date,
      staffId,
    });

  } catch (error) {
    console.error('Error fetching staff availability:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 