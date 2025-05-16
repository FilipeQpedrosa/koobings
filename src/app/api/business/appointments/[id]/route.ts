import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const staff = await prisma.staff.findUnique({
      where: { email: session.user?.email },
      include: { business: true }
    });

    if (!staff) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Verify the appointment belongs to the staff's business
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: params.id,
        businessId: staff.businessId,
      },
    });

    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    // Update the appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: params.id },
      data: { status },
      include: {
        patient: {
          select: {
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
      id: updatedAppointment.id,
      patientName: updatedAppointment.patient.name,
      patientEmail: updatedAppointment.patient.email,
      date: updatedAppointment.startTime.toISOString(),
      time: updatedAppointment.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: updatedAppointment.status,
      notes: updatedAppointment.notes || undefined,
      provider: {
        id: updatedAppointment.staff.id,
        name: updatedAppointment.staff.name,
      },
      service: {
        id: updatedAppointment.service.id,
        name: updatedAppointment.service.name,
        duration: updatedAppointment.service.duration,
      },
    };

    return NextResponse.json(formattedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 