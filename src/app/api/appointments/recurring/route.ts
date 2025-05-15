import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { RecurringFrequency } from '@prisma/client';
import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';

// POST /api/appointments/recurring
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      frequency,
      interval,
      daysOfWeek,
      startDate,
      endDate,
      appointmentDetails,
    } = body;

    // Validate required fields
    if (!frequency || !interval || !startDate || !appointmentDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create recurring pattern
    const recurringPattern = await prisma.recurringAppointment.create({
      data: {
        frequency,
        interval,
        daysOfWeek: daysOfWeek || [],
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    // Generate recurring appointments
    const appointments = [];
    let currentDate = new Date(startDate);
    const maxDate = endDate ? new Date(endDate) : addYears(currentDate, 1); // Default to 1 year if no end date

    while (isBefore(currentDate, maxDate)) {
      // Check if the current day is in daysOfWeek (if specified)
      if (!daysOfWeek || daysOfWeek.includes(currentDate.getDay())) {
        appointments.push({
          ...appointmentDetails,
          startTime: currentDate,
          endTime: new Date(currentDate.getTime() + appointmentDetails.duration * 60000),
          recurringId: recurringPattern.id,
        });
      }

      // Calculate next date based on frequency
      switch (frequency) {
        case RecurringFrequency.DAILY:
          currentDate = addDays(currentDate, interval);
          break;
        case RecurringFrequency.WEEKLY:
          currentDate = addWeeks(currentDate, interval);
          break;
        case RecurringFrequency.MONTHLY:
          currentDate = addMonths(currentDate, interval);
          break;
        case RecurringFrequency.YEARLY:
          currentDate = addYears(currentDate, interval);
          break;
      }
    }

    // Create all appointments
    const createdAppointments = await prisma.appointment.createMany({
      data: appointments,
    });

    return NextResponse.json({
      recurringPattern,
      appointmentsCreated: createdAppointments.count,
    });
  } catch (error) {
    console.error('Error creating recurring appointments:', error);
    return NextResponse.json(
      { error: 'Failed to create recurring appointments' },
      { status: 500 }
    );
  }
}

// GET /api/appointments/recurring
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patternId = searchParams.get('patternId');

    if (!patternId) {
      return NextResponse.json(
        { error: 'Missing pattern ID' },
        { status: 400 }
      );
    }

    const recurringPattern = await prisma.recurringAppointment.findUnique({
      where: { id: patternId },
      include: {
        appointments: true,
      },
    });

    if (!recurringPattern) {
      return NextResponse.json(
        { error: 'Recurring pattern not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(recurringPattern);
  } catch (error) {
    console.error('Error fetching recurring appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recurring appointments' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/recurring
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patternId = searchParams.get('patternId');

    if (!patternId) {
      return NextResponse.json(
        { error: 'Missing pattern ID' },
        { status: 400 }
      );
    }

    // Delete all associated appointments
    await prisma.appointment.deleteMany({
      where: { recurringId: patternId },
    });

    // Delete the recurring pattern
    await prisma.recurringAppointment.delete({
      where: { id: patternId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recurring appointments:', error);
    return NextResponse.json(
      { error: 'Failed to delete recurring appointments' },
      { status: 500 }
    );
  }
} 