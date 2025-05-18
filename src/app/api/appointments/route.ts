import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
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
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Base query
    const where: any = {
      isDeleted: false,
    };

    // Add filters based on role
    if (session.user.role === 'STAFF') {
      where.staffId = session.user.id;
    } else if (session.user.role === 'BUSINESS_OWNER') {
      where.business = {
        id: session.user.businessId,
      };
    }

    // Add date filter
    if (date) {
      where.date = new Date(date);
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          customer: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          service: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
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
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.customerId || !data.serviceId || !data.date || !data.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        customerId: data.customerId,
        serviceId: data.serviceId,
        staffId: data.staffId || session.user.id,
        businessId: session.user.businessId,
        date: new Date(data.date),
        time: data.time,
        status: 'SCHEDULED',
        notes: data.notes,
      },
      include: {
        customer: true,
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

// PATCH handler
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Verify appointment access
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: {
        staffId: true,
        businessId: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (
      session.user.role === 'STAFF' &&
      appointment.staffId !== session.user.id
    ) {
      return NextResponse.json(
        { error: 'Unauthorized to update this appointment' },
        { status: 403 }
      );
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        service: true,
        staff: true,
      },
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
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