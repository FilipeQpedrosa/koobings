import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { addDays, addWeeks, addMonths, addYears, isBefore } from 'date-fns';

// POST /api/appointments/recurring
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
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
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
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
        case 'DAILY':
          currentDate = addDays(currentDate, interval);
          break;
        case 'WEEKLY':
          currentDate = addWeeks(currentDate, interval);
          break;
        case 'MONTHLY':
          currentDate = addMonths(currentDate, interval);
          break;
        case 'YEARLY':
          currentDate = addYears(currentDate, interval);
          break;
      }
    }

    // Create all appointments
    const createdAppointments = await prisma.appointments.createMany({
      data: appointments,
    });

    return NextResponse.json({
      success: true,
      data: {
        recurringPattern,
        appointmentsCreated: createdAppointments.count,
      },
    });
  } catch (error) {
    console.error('Error creating recurring appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'RECURRING_CREATE_ERROR', message: 'Failed to create recurring appointments' } },
      { status: 500 }
    );
  }
}

// GET /api/appointments/recurring
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patternId = searchParams.get('patternId');

    if (!patternId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PATTERN_ID', message: 'Missing pattern ID' } },
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
        { success: false, error: { code: 'PATTERN_NOT_FOUND', message: 'Recurring pattern not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recurringPattern });
  } catch (error) {
    console.error('Error fetching recurring appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'RECURRING_FETCH_ERROR', message: 'Failed to fetch recurring appointments' } },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/recurring
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const patternId = searchParams.get('patternId');

    if (!patternId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PATTERN_ID', message: 'Missing pattern ID' } },
        { status: 400 }
      );
    }

    // Delete all associated appointments
    await prisma.appointments.deleteMany({
      where: { recurringAppointmentId: patternId },
    });

    // Delete the recurring pattern
    await prisma.recurringAppointment.delete({
      where: { id: patternId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recurring appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'RECURRING_DELETE_ERROR', message: 'Failed to delete recurring appointments' } },
      { status: 500 }
    );
  }
} 