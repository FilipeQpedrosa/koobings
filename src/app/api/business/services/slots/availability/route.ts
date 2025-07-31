import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/business/services/slots/availability POST - Starting...');
    
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

    // Input validation
    const schema = z.object({
      serviceId: z.string().min(1),
      date: z.string().min(1), // YYYY-MM-DD format
      staffId: z.string().min(1).optional(),
    });

    const body = await request.json();
    const parsed = schema.parse(body);
    const { serviceId, date, staffId } = parsed;

    console.log('📅 Checking slot availability:', { serviceId, date, staffId });

    // Get the service with slots
    const service = await prisma.service.findUnique({
      where: { 
        id: serviceId,
        businessId // Ensure service belongs to the business
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // If service doesn't have slots, return traditional availability
    if (!(service as any).slots || !Array.isArray((service as any).slots) || (service as any).slots.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          serviceType: 'traditional',
          message: 'Service uses traditional time slots'
        }
      });
    }

    // Parse the target date
    const targetDate = new Date(date + 'T00:00:00.000Z');
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    console.log('🗓️ Day filtering debug:', {
      date,
      targetDate: targetDate.toISOString(),
      dayOfWeek,
      serviceAvailableDays: (service as any).availableDays,
      includes: (service as any).availableDays?.includes(dayOfWeek),
      serviceId,
      serviceName: service.name
    });

    // Check if service is available on this day
    if ((service as any).availableDays && !(service as any).availableDays.includes(dayOfWeek)) {
      console.log('❌ Service not available on this day of week');
      return NextResponse.json({
        success: true,
        data: {
          serviceType: 'slots',
          availableSlots: [],
          message: 'Service not available on this day of week'
        }
      });
    }

    // Get existing appointments for this service/date to check slot capacity
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    const existingAppointments = await (prisma as any).appointments.findMany({
      where: {
        serviceId,
        scheduledFor: { gte: startOfDay, lte: endOfDay },
        ...(staffId && { staffId }),
        status: { not: 'CANCELLED' }
      },
      include: { Client: { select: { isDeleted: true } } }
    });

    // Filter out appointments for deleted clients
    const validAppointments = existingAppointments.filter((apt: any) => !apt.Client?.isDeleted);

    // Check availability for each slot
    const slotsWithAvailability = ((service as any).slots as any[]).map((slot: any, index: number) => {
      const slotCapacity = slot.capacity || (service as any).maxCapacity || 1;
      
      // Count bookings for this specific slot
      const slotBookings = validAppointments.filter((apt: any) => {
        if (apt.slotInfo && typeof apt.slotInfo === 'object') {
          const slotData = apt.slotInfo as any;
          return slotData.slotIndex === index;
        }
        return false;
      });

      const bookedCount = slotBookings.length;
      const availableSpots = slotCapacity - bookedCount;

      return {
        slotIndex: index,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity: slotCapacity,
        booked: bookedCount,
        available: availableSpots,
        isAvailable: availableSpots > 0
      };
    });

    console.log('🎯 Slot availability calculated:', slotsWithAvailability);

    return NextResponse.json({
      success: true,
      data: {
        serviceType: 'slots',
        serviceName: service.name,
        date,
        dayOfWeek,
        availableSlots: slotsWithAvailability.filter(slot => slot.isAvailable),
        allSlots: slotsWithAvailability
      }
    });

  } catch (error: any) {
    console.error('❌ Error in slot availability check:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'AVAILABILITY_CHECK_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
} 