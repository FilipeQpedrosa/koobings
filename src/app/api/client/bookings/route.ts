import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addMinutes } from 'date-fns';
import { PatientStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { serviceId, staffId, date, time, customerInfo } = data;

    if (!serviceId || !staffId || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Create start date time from date and time strings
    const startDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Calculate end time based on service duration
    const endDateTime = addMinutes(startDateTime, service.duration);

    // First, ensure the patient exists
    const patientData = session?.user?.email ? {
      email: session.user.email,
      name: session.user.name || 'Guest User',
      status: PatientStatus.ACTIVE
    } : {
      email: customerInfo.email,
      name: customerInfo.name,
      phone: customerInfo.phone,
      status: PatientStatus.ACTIVE
    };

    const patient = await prisma.patient.upsert({
      where: { email: patientData.email },
      create: {
        ...patientData,
        businesses: {
          connect: { id: service.businessId }
        }
      },
      update: {} // Don't update existing patient data
    });

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: startDateTime,
        endTime: endDateTime,
        status: 'PENDING',
        notes: customerInfo?.notes,
        service: {
          connect: { id: serviceId }
        },
        staff: {
          connect: { id: staffId }
        },
        patient: {
          connect: { id: patient.id }
        },
        business: {
          connect: { id: service.businessId }
        }
      },
      include: {
        service: true,
        staff: true,
        patient: true,
        business: true
      }
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
} 