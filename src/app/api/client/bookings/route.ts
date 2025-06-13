import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addMinutes } from 'date-fns';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { serviceId, staffId, date, time, customerInfo } = data;

    if (!serviceId || !staffId || !date || !time) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Get the service to calculate endTime
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        business: true
      }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    // Create start date time from date and time strings
    const startDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Calculate end time based on service duration
    const endDateTime = addMinutes(startDateTime, service.duration);

    // First, ensure the client exists
    const clientData = session?.user?.email ? {
      email: session.user.email,
      name: session.user.name || 'Guest User',
      status: 'ACTIVE'
    } : {
      email: customerInfo.email,
      name: customerInfo.name,
      phone: customerInfo.phone,
      status: 'ACTIVE'
    };

    const client = await prisma.client.upsert({
      where: { email: clientData.email },
      create: {
        ...clientData,
        business: {
          connect: { id: service.businessId }
        }
      },
      update: {} // Don't update existing client data
    });

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        scheduledFor: startDateTime,
        duration: service.duration,
        status: 'PENDING',
        notes: customerInfo?.notes,
        service: {
          connect: { id: serviceId }
        },
        staff: {
          connect: { id: staffId }
        },
        client: {
          connect: { id: client.id }
        },
        business: {
          connect: { id: service.businessId }
        }
      },
      include: {
        service: true,
        staff: true,
        client: true,
        business: true
      }
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BOOKING_CREATE_ERROR', message: 'Failed to create booking' } },
      { status: 500 }
    );
  }
} 