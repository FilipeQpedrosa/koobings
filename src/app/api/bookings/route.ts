import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { addMinutes } from 'date-fns';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, startTime, email, name } = body;

    if (!serviceId || !startTime || !email || !name) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    // Get or create patient record
    let patient = await prisma.patient.findFirst({
      where: { email },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          email,
          name,
          status: 'ACTIVE',
        },
      });
    }

    // Get the service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        business: {
          include: {
            staff: {
              where: { role: 'PROVIDER' },
              take: 1,
            },
          },
        },
      },
    });

    if (!service) {
      return new NextResponse('Service not found', { status: 404 });
    }

    if (!service.business.staff[0]) {
      return new NextResponse('No available provider', { status: 400 });
    }

    // Calculate end time based on service duration
    const startDateTime = new Date(startTime);
    const endDateTime = addMinutes(startDateTime, service.duration);

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        OR: [
          {
            AND: [
              { startTime: { lte: startDateTime } },
              { endTime: { gt: startDateTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endDateTime } },
              { endTime: { gte: endDateTime } },
            ],
          },
        ],
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    if (conflictingAppointment) {
      return new NextResponse('Time slot no longer available', { status: 409 });
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'PENDING',
        businessId: service.business.id,
        patientId: patient.id,
        serviceId: service.id,
        staffId: service.business.staff[0].id,
      },
      include: {
        service: true,
        staff: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating booking:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 