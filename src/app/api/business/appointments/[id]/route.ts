import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: Request, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('No session');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user?.email },
      include: { business: true }
    });

    if (!staff) {
      console.error('No staff found for session', session.user?.email);
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { status, scheduledFor, notes, staffId } = body;
    console.log('PATCH /api/business/appointments/[id]', {
      params,
      body,
      staffEmail: staff.email,
      staffBusinessId: staff.businessId,
    });

    // Validate status value
    const allowedStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
    if (status && !allowedStatuses.includes(status)) {
      console.error('Invalid status value:', status);
      return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Invalid status value' } }, { status: 400 });
    }

    // Verify the appointment belongs to the staff's business
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        businessId: staff.businessId,
      },
    });

    if (!appointment) {
      console.error('Appointment not found or does not belong to staff business', params.id, staff.businessId);
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (scheduledFor) updateData.scheduledFor = new Date(scheduledFor);
    if (notes !== undefined) updateData.notes = notes;
    if (staffId) updateData.staffId = staffId;

    // Update the appointment
    let updatedAppointment;
    try {
      updatedAppointment = await prisma.appointment.update({
        where: { id: params.id },
        data: updateData,
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
    } catch (err) {
      console.error('Error updating appointment in Prisma:', err);
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Failed to update appointment', details: String(err) } }, { status: 500 });
    }

    const formattedAppointment = {
      id: updatedAppointment.id,
      client: {
        id: updatedAppointment.client.id,
        name: updatedAppointment.client.name,
        email: updatedAppointment.client.email,
      },
      staff: {
        id: updatedAppointment.staff.id,
        name: updatedAppointment.staff.name,
      },
      services: updatedAppointment.service ? [{ id: updatedAppointment.service.id, name: updatedAppointment.service.name }] : [],
      scheduledFor: updatedAppointment.scheduledFor.toISOString(),
      duration: updatedAppointment.service?.duration,
      status: updatedAppointment.status,
      notes: updatedAppointment.notes || undefined,
    };

    return NextResponse.json({ success: true, data: formattedAppointment });
  } catch (error) {
    console.error('Error updating appointment (outer catch):', error);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 