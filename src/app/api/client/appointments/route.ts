import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// GET /api/client/appointments - Get client appointments
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        clientId: session.user.id,
      },
      include: {
        service: true,
        staff: true,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: 'Failed to fetch appointments' } },
      { status: 500 }
    );
  }
}

// POST /api/client/appointments - Create new appointment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, staffId, date, startTime, endTime, notes } = body;

    // Validate required fields
    if (!serviceId || !staffId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Combine date and startTime into scheduledFor
    const scheduledFor = new Date(`${date}T${startTime}`);
    // Calculate duration in minutes
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId,
        scheduledFor: {
          gte: scheduledFor,
          lt: new Date(scheduledFor.getTime() + duration * 60000),
        },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, error: { code: 'TIME_SLOT_BOOKED', message: 'Time slot is already booked' } },
        { status: 400 }
      );
    }

    // Fetch the service to get the businessId
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { businessId: true },
    });
    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: session.user.id,
        serviceId,
        staffId,
        businessId: service.businessId,
        scheduledFor,
        duration,
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_CREATE_ERROR', message: 'Failed to create appointment' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/appointments - Update appointment status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Appointment ID and status are required' } },
        { status: 400 }
      );
    }

    // Verify appointment belongs to client
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        clientId: session.user.id,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } },
        { status: 404 }
      );
    }

    // Update appointment status
    const appointment = await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status,
      },
      include: {
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Failed to update appointment' } },
      { status: 500 }
    );
  }
} 