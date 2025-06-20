import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO, addMinutes } from 'date-fns';
import { z } from 'zod';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Get the staff member and their business
    const staff = await prisma.staff.findUnique({
      where: { email: session.user.email },
      include: { business: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get date from query params
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const dateParam = searchParams.get('date');
    const staffId = searchParams.get('staffId');
    const limit = parseInt(searchParams.get('limit') || '0', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    let where: any = {
      businessId: staff.businessId,
    };
    // Restrict staff to only view their own bookings if business setting is false
    if (session.user.role === 'STAFF') {
      // Only restrict STANDARD staff, not ADMINs
      if (staff.role !== 'ADMIN' && !staff.business.allowStaffToViewAllBookings) {
        where.staffId = staff.id;
      } else if (staffId && staffId !== 'all') {
        where.staffId = staffId;
      }
    } else if (staffId && staffId !== 'all') {
      where.staffId = staffId;
    }

    if (startDateParam) {
      const startDate = startOfDay(parseISO(startDateParam));
      const endDate = endDateParam ? endOfDay(parseISO(endDateParam)) : endOfDay(startDate);
      where.scheduledFor = {
        gte: startDate,
        lte: endDate,
      };
    } else if (dateParam) {
      const date = parseISO(dateParam);
      if (!isNaN(date.getTime())) {
        where.scheduledFor = {
          gte: startOfDay(date),
          lte: endOfDay(date),
        };
      }
    }

    // Fetch total count for pagination
    const total = await prisma.appointment.count({ where });

    // Fetch appointments for the business (optionally filtered by date and/or staff)
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        service: true,
      },
      orderBy: {
        scheduledFor: 'asc',
      },
      ...(limit ? { take: limit } : {}),
      ...(offset ? { skip: offset } : {}),
    });

    // Define the type for an appointment from Prisma
    type AppointmentWithDetails = (typeof appointments)[0];

    // Transform the data to match the frontend interface
    const formattedAppointments = appointments.map((apt: AppointmentWithDetails) => ({
      id: apt.id,
      client: apt.client ? {
        id: apt.client.id,
        name: apt.client.name,
      } : null,
      scheduledFor: apt.scheduledFor.toISOString(),
      status: apt.status,
      notes: apt.notes || undefined,
      staff: apt.staff ? {
        id: apt.staff.id,
        name: apt.staff.name,
      } : null,
      service: apt.service ? {
        id: apt.service.id,
        name: apt.service.name,
        duration: apt.service.duration,
      } : null,
      duration: apt.duration,
    }));

    // The dashboard component expects a direct array of appointments
    return NextResponse.json({
      success: true,
      data: {
        appointments: formattedAppointments,
        total,
      }
    });
  } catch (error: any) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user.email },
      include: { business: true }
    });

    if (!staff) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Input validation
    const schema = z.object({
      clientId: z.string().min(1),
      serviceId: z.string().min(1),
      startTime: z.string().min(1),
      notes: z.string().optional(),
      staffId: z.string().optional()
    });
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    let parsed;
    try {
      parsed = schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
      }
      throw error;
    }
    const { clientId, serviceId, startTime, notes, staffId: staffIdFromPayload } = parsed;
    console.log('[POST /api/business/appointments] body:', parsed, 'staffId used:', staffIdFromPayload || staff.id);

    if (!clientId || !serviceId || !startTime) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields: clientId, serviceId, startTime' } }, { status: 400 });
    }

    // Get service to calculate endTime
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    let start;
    try {
      start = new Date(startTime);
      if (isNaN(start.getTime())) throw new Error('Invalid startTime');
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_STARTTIME', message: 'Invalid startTime format' } }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        businessId: staff.businessId,
        clientId: clientId,
        serviceId,
        staffId: staffIdFromPayload || staff.id,
        scheduledFor: start,
        duration: service.duration,
        notes,
        status: 'PENDING',
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        service: true,
      },
    });

    const formattedAppointment = {
      id: appointment.id,
      client: {
        id: appointment.client?.id,
        name: appointment.client?.name,
        email: appointment.client?.email,
      },
      scheduledFor: appointment.scheduledFor.toISOString(),
      status: appointment.status,
      notes: appointment.notes || undefined,
      staff: appointment.staff ? {
        id: appointment.staff.id,
        name: appointment.staff.name,
      } : undefined,
      services: appointment.service ? [{
        id: appointment.service.id,
        name: appointment.service.name,
        duration: appointment.service.duration,
      }] : [],
    };

    return NextResponse.json({ success: true, data: formattedAppointment });
  } catch (error: any) {
    console.error('POST /business/appointments error:', error);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_CREATE_ERROR', message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}

// New endpoint: /api/business/appointments/check-availability
export async function PUT(request: Request) {
  // This is a convention for a custom endpoint, since Next.js API routes don't support subroutes easily
  // The frontend should call this with method PUT and the correct payload
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user?.email },
      include: { business: true }
    });

    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 });
    }
    const { staffId, date, startTime, duration } = body;
    if (!staffId || !date || !startTime || !duration) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields: staffId, date, startTime, duration' } }, { status: 400 });
    }
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    // Find overlapping appointments for this staff
    const overlapping = await prisma.appointment.findFirst({
      where: {
        staffId,
        scheduledFor: {
          lt: end,
          gte: new Date(date + 'T00:00:00'),
        },
        // End time of existing appointment must be after start
        // (scheduledFor + duration) > start
      },
    });
    let isAvailable = true;
    if (overlapping) {
      // Calculate end time of existing appointment
      const existingEnd = new Date(overlapping.scheduledFor.getTime() + overlapping.duration * 60000);
      if (existingEnd > start) {
        isAvailable = false;
      }
    }
    return NextResponse.json({ success: true, data: { available: isAvailable } });
  } catch (error) {
    console.error('Error checking staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'AVAILABILITY_CHECK_ERROR', message: error instanceof Error ? error.message : 'Internal Server Error' } }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 