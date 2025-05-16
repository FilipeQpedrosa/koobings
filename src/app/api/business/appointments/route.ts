import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay, parseISO, addMinutes } from 'date-fns';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get the staff member and their business
    const staff = await prisma.staff.findUnique({
      where: { email: session.user?.email },
      include: { business: true }
    });

    if (!staff) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get date from query params
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    
    if (!dateParam) {
      return new NextResponse('Date parameter is required', { status: 400 });
    }

    const date = parseISO(dateParam);

    // Fetch appointments for the business on the specified date
    const appointments = await prisma.appointment.findMany({
      where: {
        businessId: staff.businessId,
        startTime: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
      },
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
      orderBy: {
        startTime: 'asc',
      },
    });

    // Transform the data to match the frontend interface
    const formattedAppointments = appointments.map(apt => ({
      id: apt.id,
      patientName: apt.patient.name,
      patientEmail: apt.patient.email,
      date: apt.startTime.toISOString(),
      time: apt.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: apt.status,
      notes: apt.notes || undefined,
      provider: {
        id: apt.staff.id,
        name: apt.staff.name,
      },
      service: {
        id: apt.service.id,
        name: apt.service.name,
        duration: apt.service.duration,
      },
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
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
    const { patientId, serviceId, startTime, notes } = body;

    // Get service to calculate endTime
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return new NextResponse('Service not found', { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        businessId: staff.businessId,
        patientId,
        serviceId,
        staffId: staff.id,
        startTime: new Date(startTime),
        endTime: addMinutes(new Date(startTime), service.duration),
        notes,
        status: 'PENDING',
      },
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
      id: appointment.id,
      patientName: appointment.patient.name,
      patientEmail: appointment.patient.email,
      date: appointment.startTime.toISOString(),
      time: appointment.startTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      status: appointment.status,
      notes: appointment.notes || undefined,
      provider: {
        id: appointment.staff.id,
        name: appointment.staff.name,
      },
      service: {
        id: appointment.service.id,
        name: appointment.service.name,
        duration: appointment.service.duration,
      },
    };

    return NextResponse.json(formattedAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 