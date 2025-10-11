import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG SLOT ERROR - Starting...');
    
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
    const date = request.nextUrl.searchParams.get('date');
    
    console.log('🔍 Debug params:', { slotId, date, businessId });

    if (!slotId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SLOT_ID_MISSING', message: 'Slot ID is required' } 
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

    // Check appointments for this service
    const appointments = await prisma.appointments.findMany({
      where: {
        serviceId,
        businessId
      },
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isEligible: true
          }
        }
      }
    });

    console.log('🔍 Appointments found:', appointments.length);
    console.log('🔍 Appointment details:', appointments.map(apt => ({
      id: apt.id,
      clientName: apt.Client?.name,
      scheduledFor: apt.scheduledFor,
      status: apt.status
    })));

    // Check clients for this business
    const clients = await prisma.client.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        isEligible: true
      }
    });

    console.log('🔍 Clients found:', clients.length);

    return NextResponse.json({
      success: true,
      data: {
        slotId,
        serviceId,
        dayOfWeek,
        startTime,
        service: service,
        appointments: appointments,
        clients: clients,
        debug: {
          slotIdParts,
          parsedServiceId: serviceId,
          parsedDayOfWeek: dayOfWeek,
          parsedStartTime: startTime
        }
      }
    });

  } catch (error: any) {
    console.error('❌ DEBUG SLOT ERROR:', error);
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
