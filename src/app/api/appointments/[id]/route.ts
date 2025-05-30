import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

// GET /api/appointments/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
            email: true,
          },
        },
        service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role === 'CUSTOMER' && appointment.clientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (
      session.user.role === 'STAFF' && appointment.staffId !== session.user.id
    ) {
      // Optionally, allow staff to view/update only their own appointments
      // For delete, we allow any staff (see below)
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('PATCH /api/appointments/[id]: No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, cancellationReason } = body;
    console.log('PATCH /api/appointments/[id] payload:', body);
    console.log('PATCH /api/appointments/[id] session user:', session.user);

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
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
            email: true,
          },
        },
        service: true,
      },
    });
    console.log('PATCH /api/appointments/[id] found appointment:', appointment);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      session.user.role === 'CUSTOMER' && appointment.clientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (
      session.user.role === 'STAFF' && appointment.staffId !== session.user.id
    ) {
      // Optionally, allow staff to view/update only their own appointments
      // For delete, we allow any staff (see below)
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Strict status transition validation
    const currentStatus = appointment.status;
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // Handle cancellation
    if (status === AppointmentStatus.CANCELLED) {
      const updatedAppointment = await prisma.appointment.update({
        where: { id: params.id },
        data: {
          status: AppointmentStatus.CANCELLED,
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
              email: true,
            },
          },
          service: true,
        },
      });

      // TODO: Send cancellation notifications

      return NextResponse.json(updatedAppointment);
    }

    // Handle other status updates
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: {
        status,
        notes,
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
            email: true,
          },
        },
        service: true,
      },
    });

    // TODO: Send status update notifications

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Allow deletion by staff or business owner
    if (!['STAFF', 'BUSINESS_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.appointment.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
} 