import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMinutes } from 'date-fns';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, startTime, email, name } = body;

    if (!serviceId || !startTime || !email || !name) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } }, { status: 400 });
    }

    // Get or create client record
    let client = await prisma.client.findFirst({
      where: { email },
    });

    if (!client) {
      // Get the service to access businessId
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { businessId: true },
      });
      if (!service) {
        return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
      }
      client = await prisma.client.create({
        data: {
          email,
          name,
          status: 'ACTIVE',
          business: { connect: { id: service.businessId } },
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
              where: { role: 'STANDARD' },
              take: 1,
            },
          },
        },
      },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    if (!service.business.staff[0]) {
      return NextResponse.json({ success: false, error: { code: 'NO_PROVIDER', message: 'No available provider' } }, { status: 400 });
    }

    // Calculate scheduledFor based on startTime
    const scheduledFor = new Date(startTime);
    const duration = service.duration;

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointments.findFirst({
      where: {
        staffId: service.business.staff[0].id,
        scheduledFor: {
          gte: scheduledFor,
          lt: addMinutes(scheduledFor, duration),
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json({ success: false, error: { code: 'TIME_SLOT_UNAVAILABLE', message: 'Time slot no longer available' } }, { status: 409 });
    }

    // Create the appointment
    const appointment = await prisma.appointments.create({
      data: {
        scheduledFor,
        duration,
        status: 'PENDING',
        businessId: service.business.id,
        clientId: client.id,
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

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: { code: 'BOOKING_CREATE_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 