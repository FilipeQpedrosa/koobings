import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { sendAppointmentConfirmation, type AppointmentWithRelations } from '@/lib/email';

// POST /api/appointments
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startTime, endTime, serviceId, staffId, businessId, notes } = body;

    // Validate required fields
    if (!startTime || !endTime || !serviceId || !staffId || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for scheduling conflicts
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        staffId,
        businessId,
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED],
        },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'Time slot is not available' },
        { status: 409 }
      );
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: AppointmentStatus.PENDING,
        notes,
        business: { connect: { id: businessId } },
        patient: { connect: { id: session.user.id } },
        service: { connect: { id: serviceId } },
        staff: { connect: { id: staffId } },
      },
      include: {
        service: true,
        staff: true,
        patient: true,
        business: true,
        reminders: true,
        cancellation: true,
      },
    }) as AppointmentWithRelations;

    // Send confirmation email
    await sendAppointmentConfirmation({
      appointment,
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

// GET /api/appointments
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    const where: Prisma.AppointmentWhereInput = {};

    if (businessId) {
      where.businessId = businessId;
    }

    if (startDate) {
      where.startTime = {
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      where.endTime = {
        lte: new Date(endDate),
      };
    }

    if (status) {
      where.status = status as AppointmentStatus;
    }

    // Filter based on user role
    if (session.user.role === 'PATIENT') {
      where.patientId = session.user.id;
    } else if (session.user.role === 'PROVIDER') {
      where.staffId = session.user.id;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        staff: true,
        patient: true,
        business: true,
        reminders: true,
        cancellation: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    }) as AppointmentWithRelations[];

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
} 