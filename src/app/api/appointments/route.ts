import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET handler
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
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
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.scheduledFor = { gte: start, lte: end };
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          client: {
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
        client: {
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
        scheduledFor: 'desc',
      },
    });

    // Map scheduledFor to date and time for dashboard compatibility
    const mappedAppointments = appointments.map((apt) => {
      const scheduled = apt.scheduledFor instanceof Date ? apt.scheduledFor : new Date(apt.scheduledFor);
      return {
        ...apt,
        customer: apt.client,
        date: scheduled.toISOString().slice(0, 10),
        time: scheduled.toISOString().slice(11, 16),
      };
    });
    return NextResponse.json({ success: true, data: mappedAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: 'Failed to fetch appointments' } },
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
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.clientId || !data.serviceId || !data.date || !data.time) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Ensure businessId is present
    if (!session.user.businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_REQUIRED', message: 'Business ID is required to create an appointment.' } },
        { status: 400 }
      );
    }

    // Fetch the service to get its duration
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { duration: true },
    });
    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    // Combine date and time into a single Date object for scheduledFor
    const scheduledFor = new Date(`${data.date}T${data.time}`);
    const appointment = await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        serviceId: data.serviceId,
        staffId: data.staffId || session.user.id,
        businessId: session.user.businessId,
        scheduledFor,
        duration: service.duration,
        status: 'PENDING',
        notes: data.notes,
      },
      include: {
        client: true,
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

// PATCH handler
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !['BUSINESS_OWNER', 'STAFF'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'APPOINTMENT_ID_REQUIRED', message: 'Appointment ID is required' } },
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
        { success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (
      session.user.role === 'STAFF' &&
      appointment.staffId !== session.user.id
    ) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED_UPDATE', message: 'Unauthorized to update this appointment' } },
        { status: 403 }
      );
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        service: true,
        staff: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Failed to update appointment' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const reason = searchParams.get('reason') || 'No reason provided';
    
    if (!id) {
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_ID_REQUIRED', message: 'Appointment ID is required' } }, { status: 400 });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED', notes: reason },
    });
    return NextResponse.json({ success: true, data: { message: 'Appointment cancelled successfully' } });
  } catch (error) {
    console.error('Failed to cancel appointment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_CANCEL_ERROR', message: error instanceof Error ? error.message : 'Failed to cancel appointment' } },
      { status: 500 }
    );
  }
} 