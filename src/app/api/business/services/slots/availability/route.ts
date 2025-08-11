import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET method - return error explaining only POST is allowed
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: {
      code: 'METHOD_NOT_ALLOWED',
      message: 'This endpoint only accepts POST requests. Use POST with serviceId, date, and optional staffId in the request body.'
    }
  }, { status: 405 });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/business/services/slots/availability POST - Starting...');
    
    // Debug: Check Prisma initialization
    console.log('🔍 Prisma client status:', !!prisma);
    console.log('🔍 Prisma type:', typeof prisma);
    // @ts-ignore - Schema model names are correct
    console.log('🔍 Prisma Service model:', !!prisma?.Service);
    // @ts-ignore - Schema model names are correct
    console.log('🔍 Prisma appointments model:', !!prisma?.appointments);
    
    // Test Prisma connection
    try {
      await prisma.$connect();
      console.log('🔍 Prisma connection successful');
    } catch (dbError) {
      console.error('🔍 Prisma connection failed:', dbError);
      throw new Error(`Database connection failed: ${dbError}`);
    }

    // Authentication check
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

    // Get the service with slots - Use exact schema model name
    // @ts-ignore - Schema uses Service model (singular, capitalized)
    const service = await prisma.Service.findUnique({
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

    // Parse the target date
    const targetDate = new Date(date + 'T00:00:00.000Z');
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Map day numbers to day names for slot lookup
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    console.log('🗓️ Day filtering debug:', {
      date,
      targetDate: targetDate.toISOString(),
      dayOfWeek,
      dayName,
      serviceAvailableDays: (service as any).availableDays,
      includes: (service as any).availableDays?.includes(dayOfWeek),
      serviceId,
      serviceName: service.name,
      hasSlots: !!(service as any).slots,
      slotsData: (service as any).slots,
      timestamp: new Date().toISOString()
    });

    console.log('🗓️ Looking for slots for day:', dayName);
    
    // NEW HYBRID APPROACH: Check for day-specific slots first, then fallback to general
    let dailySlots: any[] = [];
    let slotsSource = 'none';
    
    if ((service as any).slots) {
      const slotsData = (service as any).slots;
      
      // Try day-specific slots first (new format)
      if (typeof slotsData === 'object' && !Array.isArray(slotsData) && slotsData[dayName]) {
        dailySlots = slotsData[dayName];
        slotsSource = 'day-specific';
        console.log(`✅ Found ${dailySlots.length} day-specific slots for ${dayName}`);
      }
      // Fallback to general slots (old format or 'general' key)
      else if (Array.isArray(slotsData)) {
        // Old format: array of slots applies to all days (but respect availableDays)
        const hasAvailableDaysRestriction = (service as any).availableDays && Array.isArray((service as any).availableDays) && (service as any).availableDays.length > 0;
        
        if (!hasAvailableDaysRestriction || (service as any).availableDays.includes(dayOfWeek)) {
          dailySlots = slotsData;
          slotsSource = 'general-legacy';
          console.log(`✅ Using ${dailySlots.length} general slots (legacy format) for ${dayName}`);
        } else {
          console.log(`❌ Service not available on ${dayName} (availableDays restriction)`);
        }
      }
      // Check for 'general' key in new format
      else if (typeof slotsData === 'object' && slotsData['general']) {
        // Check availableDays restriction for general slots
        const hasAvailableDaysRestriction = (service as any).availableDays && Array.isArray((service as any).availableDays) && (service as any).availableDays.length > 0;
        
        if (!hasAvailableDaysRestriction || (service as any).availableDays.includes(dayOfWeek)) {
          dailySlots = slotsData['general'];
          slotsSource = 'general-new';
          console.log(`✅ Using ${dailySlots.length} general slots (new format) for ${dayName}`);
        } else {
          console.log(`❌ Service not available on ${dayName} (availableDays restriction)`);
        }
      }
    }

    console.log('🎯 Slots decision:', {
      dayName,
      dayOfWeek,
      slotsSource,
      slotsCount: dailySlots.length,
      availableDays: (service as any).availableDays
    });

    if (dailySlots.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          serviceType: 'slots',
          availableSlots: [],
          message: slotsSource === 'none' ? 'Service has no slots configured' : 'Service not available on this day'
        }
      });
    }

    // Get existing appointments for this service/date to check slot capacity
    const startOfDay = new Date(date + 'T00:00:00.000Z');
    const endOfDay = new Date(date + 'T23:59:59.999Z');

    // @ts-ignore - Schema uses appointments model (plural)
    const existingAppointments = await prisma.appointments.findMany({
      where: {
        serviceId,
        scheduledFor: { gte: startOfDay, lte: endOfDay },
        ...(staffId && { staffId }),
        status: { not: 'CANCELLED' }
      },
      include: {
        Client: {
          select: {
            isDeleted: true
          }
        }
      }
    });

    // Filter out appointments for deleted clients
    const validAppointments = existingAppointments.filter((apt: any) => !apt.Client?.isDeleted);

    // Check availability for each slot
    const slotsWithAvailability = dailySlots.map((slot: any, index: number) => {
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