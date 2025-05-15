import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/client/appointments - Get client appointments
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: session.user.id,
      },
      include: {
        service: true,
        staff: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// POST /api/client/appointments - Create new appointment
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, staffId, date, startTime, endTime, notes } = body;

    // Validate required fields
    if (!serviceId || !staffId || !date || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check staff availability
    const staffAvailability = await prisma.staffAvailability.findFirst({
      where: {
        staffId,
        date: new Date(date),
        isAvailable: true,
        startTime: {
          lte: startTime,
        },
        endTime: {
          gte: endTime,
        },
      },
    });

    if (!staffAvailability) {
      return NextResponse.json(
        { error: 'Staff is not available at selected time' },
        { status: 400 }
      );
    }

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId,
        date: new Date(date),
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 400 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: session.user.id,
        serviceId,
        staffId,
        date: new Date(date),
        startTime,
        endTime,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        service: true,
        staff: true,
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/client/appointments - Update appointment status
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    // Verify appointment belongs to client
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patientId: session.user.id,
      },
    });

    if (!existingAppointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
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

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 