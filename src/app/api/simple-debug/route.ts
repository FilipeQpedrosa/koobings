import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 SIMPLE DEBUG - Starting...');
    
    const slotId = request.nextUrl.searchParams.get('slotId');
    const studentId = request.nextUrl.searchParams.get('studentId');
    const date = request.nextUrl.searchParams.get('date');
    
    console.log('🔍 Debug params:', { slotId, studentId, date });

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

    // Get all businesses to test with
    const businesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        slug: true
      },
      take: 3
    });

    console.log('🔍 Found businesses:', businesses.length);

    if (businesses.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          message: 'No businesses found to test with',
          slotId,
          studentId,
          date,
          parsed: {
            serviceId,
            dayOfWeek,
            startTime
          }
        }
      });
    }

    const testBusiness = businesses[0];
    console.log('🔍 Using business:', testBusiness.name);

    // Check if service exists
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId: testBusiness.id,
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
        businessId: testBusiness.id
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

    // Get all clients for this business
    const allClients = await prisma.client.findMany({
      where: { businessId: testBusiness.id },
      select: {
        id: true,
        name: true,
        email: true,
        isEligible: true
      },
      orderBy: { name: 'asc' },
      take: 5
    });

    console.log('🔍 All clients for business:', allClients.length);

    // Get all services for this business
    const allServices = await prisma.service.findMany({
      where: { 
        businessId: testBusiness.id,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true
      },
      orderBy: { name: 'asc' },
      take: 5
    });

    console.log('🔍 All services for business:', allServices.length);

    return NextResponse.json({
      success: true,
      data: {
        slotId,
        studentId,
        date,
        business: testBusiness,
        parsed: {
          serviceId,
          dayOfWeek,
          startTime
        },
        service: service,
        client: client,
        allClients: allClients,
        allServices: allServices,
        debug: {
          slotIdParts,
          parsedServiceId: serviceId,
          parsedDayOfWeek: dayOfWeek,
          parsedStartTime: startTime,
          serviceFound: !!service,
          clientFound: !!client,
          clientEligible: client?.isEligible || false,
          allClientsCount: allClients.length,
          allServicesCount: allServices.length
        }
      }
    });

  } catch (error: any) {
    console.error('❌ SIMPLE DEBUG ERROR:', error);
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
