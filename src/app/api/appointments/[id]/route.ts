import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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
        service: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reminders: true,
        cancellation: true,
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
      session.user.role === 'PATIENT' &&
      appointment.patientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (
      session.user.role === 'PROVIDER' &&
      appointment.staffId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, cancellationReason } = body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: params.id },
      include: {
        cancellation: true,
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
      session.user.role === 'PATIENT' &&
      appointment.patientId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (
      session.user.role === 'PROVIDER' &&
      appointment.staffId !== session.user.id
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle cancellation
    if (status === AppointmentStatus.CANCELLED) {
      if (appointment.cancellation) {
        return NextResponse.json(
          { error: 'Appointment is already cancelled' },
          { status: 400 }
        );
      }

      const updatedAppointment = await prisma.appointment.update({
        where: { id: params.id },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancellation: {
            create: {
              reason: cancellationReason,
              cancelledBy: session.user.role,
            },
          },
        },
        include: {
          service: true,
          staff: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          cancellation: true,
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
        service: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        patient: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        cancellation: true,
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

    // Only allow deletion by business admin or system admin
    if (!['BUSINESS_ADMIN', 'SYSTEM_ADMIN'].includes(session.user.role)) {
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