import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AppointmentService } from '@/lib/services/appointment';
import { createApiHandler, ApiError } from '@/lib/api-handler';
import * as yup from 'yup';
import { AppointmentStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { CustomUser } from '@/lib/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { sendAppointmentConfirmation, type AppointmentWithRelations } from '@/lib/email';

// Schema for appointment creation
const appointmentSchema = yup.object({
  serviceId: yup.string().required(),
  staffId: yup.string().required(),
  patientId: yup.string().required(),
  startTime: yup.date().required(),
  notes: yup.string(),
});

// Schema for appointment status update
const statusUpdateSchema = yup.object({
  status: yup.string().oneOf(Object.values(AppointmentStatus)).required(),
  reason: yup.string(),
});

type AppointmentInput = yup.InferType<typeof appointmentSchema>;
type StatusUpdateInput = yup.InferType<typeof statusUpdateSchema>;

// GET handler
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
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    const staffId = searchParams.get('staffId');

    if (date && serviceId && staffId && (businessId || session.user.businessId)) {
      // Get available time slots for a specific service and staff
      const slots = await AppointmentService.getAvailableTimeSlots(
        serviceId,
        staffId,
        date,
        businessId || session.user.businessId || ''
      );
      return NextResponse.json(slots);
    }

    const where: any = {};

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
    if (session.user.role.toUpperCase() === 'PATIENT') {
      where.patientId = session.user.id;
    } else if (session.user.role.toUpperCase() === 'PROVIDER') {
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

// POST handler
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startTime, serviceId, staffId, notes, patientId } = body;

    // Validate required fields
    if (!startTime || !serviceId || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const businessId = session.user.role === 'business' ? session.user.id : session.user.businessId || '';

    // Create the appointment using the service
    const appointment = await AppointmentService.createAppointment({
      serviceId,
      staffId,
      businessId,
      patientId: patientId || session.user.id,
      startTime,
      notes,
      createdBy: session.user.id,
    });

    // Send confirmation email
    if (appointment) {
      await sendAppointmentConfirmation({
        appointment: appointment as AppointmentWithRelations,
      });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { appointmentId, status, reason } = body;

    if (!appointmentId || !status) {
      return NextResponse.json(
        { error: 'Appointment ID and status are required' },
        { status: 400 }
      );
    }

    const appointment = await AppointmentService.updateAppointmentStatus(
      appointmentId,
      status as AppointmentStatus,
      session.user.id,
      reason
    );

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 