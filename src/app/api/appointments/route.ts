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
import { z } from 'zod';

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

const appointmentService = new AppointmentService();

// Validation schema for creating appointments
const createAppointmentSchema = z.object({
  startTime: z.string().transform((str) => new Date(str)),
  patientId: z.string(),
  serviceId: z.string(),
  staffId: z.string(),
  businessId: z.string(),
  notes: z.string().optional(),
  recurringPattern: z.object({
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    interval: z.number().min(1),
    daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
    endDate: z.string().transform((str) => new Date(str)).optional()
  }).optional()
});

// Validation schema for updating appointments
const updateAppointmentSchema = z.object({
  startTime: z.string().transform((str) => new Date(str)).optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW', 'RESCHEDULED']).optional()
});

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
    const validatedData = createAppointmentSchema.parse(body);

    const appointment = await appointmentService.create(validatedData);
    return NextResponse.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create appointment' },
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateAppointmentSchema.parse(body);

    const appointment = await appointmentService.update(id, validatedData);
    return NextResponse.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Failed to update appointment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason') || 'No reason provided';
    
    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    await appointmentService.cancel(id, reason, session.user?.email || 'SYSTEM');
    return NextResponse.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to cancel appointment' },
      { status: 500 }
    );
  }
} 