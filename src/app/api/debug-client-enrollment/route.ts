import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG CLIENT ENROLLMENT - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } 
      }, { status: 400 });
    }

    const slotId = request.nextUrl.searchParams.get('slotId');
    const studentId = request.nextUrl.searchParams.get('studentId');
    const date = request.nextUrl.searchParams.get('date');
    
    console.log('🔍 Debug params:', { slotId, studentId, date, businessId });

    if (!slotId || !studentId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'MISSING_PARAMS', message: 'SlotId and StudentId are required' } 
      }, { status: 400 });
    }

    // Parse slotId
    const slotIdParts = slotId.split('-');
    if (slotIdParts.length < 3) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    const serviceId = slotIdParts.slice(0, -2).join('-');
    const dayOfWeekStr = slotIdParts[slotIdParts.length - 2];
    const startTime = slotIdParts[slotIdParts.length - 1].replace('%3A', ':');
    const dayOfWeek = parseInt(dayOfWeekStr);

    console.log('🔍 Parsed slot info:', { serviceId, dayOfWeekStr, startTime, dayOfWeek });

    // Check if service exists
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true,
        maxCapacity: true
      }
    });

    console.log('🔍 Service found:', service ? 'YES' : 'NO');
    if (service) {
      console.log('🔍 Service details:', {
        id: service.id,
        name: service.name,
        slots: service.slots
      });
    }

    // Check if client exists
    const client = await prisma.client.findFirst({
      where: { 
        id: studentId,
        businessId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isEligible: true
      }
    });

    console.log('🔍 Client found:', client ? 'YES' : 'NO');
    if (client) {
      console.log('🔍 Client details:', {
        id: client.id,
        name: client.name,
        email: client.email,
        isEligible: client.isEligible
      });
    }

    // Check existing appointments for this client and service
    const existingAppointments = await prisma.appointments.findMany({
      where: {
        serviceId,
        clientId: studentId,
        businessId
      },
      select: {
        id: true,
        scheduledFor: true,
        status: true,
        createdAt: true
      }
    });

    console.log('🔍 Existing appointments:', existingAppointments.length);
    console.log('🔍 Appointment details:', existingAppointments.map(apt => ({
      id: apt.id,
      scheduledFor: apt.scheduledFor,
      status: apt.status,
      createdAt: apt.createdAt
    })));

    // Check all clients for this business
    const allClients = await prisma.client.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        isEligible: true
      },
      orderBy: { name: 'asc' }
    });

    console.log('🔍 All clients for business:', allClients.length);

    return NextResponse.json({
      success: true,
      data: {
        slotId,
        studentId,
        date,
        serviceId,
        dayOfWeek,
        startTime,
        service: service,
        client: client,
        existingAppointments: existingAppointments,
        allClients: allClients,
        debug: {
          slotIdParts,
          parsedServiceId: serviceId,
          parsedDayOfWeek: dayOfWeek,
          parsedStartTime: startTime,
          serviceFound: !!service,
          clientFound: !!client,
          clientEligible: client?.isEligible || false,
          existingAppointmentsCount: existingAppointments.length
        }
      }
    });

  } catch (error: any) {
    console.error('❌ DEBUG CLIENT ENROLLMENT ERROR:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'DEBUG_ERROR', 
        message: error.message || 'Internal Server Error',
        stack: error.stack
      } 
    }, { status: 500 });
  }
}
