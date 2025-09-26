import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const serviceDayConfigSchema = z.object({
  serviceId: z.string(),
  date: z.string(), // "2025-01-15"
  description: z.string(),
  slots: z.array(z.object({
    startTime: z.string(),
    endTime: z.string(),
    staffId: z.string(),
    capacity: z.number().int().positive().optional()
  }))
});

// GET: Get service configuration for a specific day
export async function GET(request: NextRequest) {
  try {
    console.log('📅 GET /api/business/services/day-config - Starting...');

    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!date) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_DATE', message: 'Date parameter is required' } }, { status: 400 });
    }

    console.log('📅 Fetching config for date:', date, 'serviceId:', serviceId);

    // Get all services for the business
    const services = await prisma.service.findMany({
      where: {
        businessId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        slots: true,
        maxCapacity: true
      }
    });

    console.log('📅 Found services:', services.length);

    // Get staff for the business
    const staff = await prisma.staff.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log('📅 Found staff:', staff.length);

    // For now, return basic structure
    // TODO: Implement actual day-specific configuration storage
    const dayConfigs = services.map(service => {
      const serviceSlots = service.slots as any;
      const dayOfWeek = new Date(date).getDay();
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const dayName = dayNames[dayOfWeek];
      
      let slots = [];
      if (serviceSlots && serviceSlots[dayName]) {
        slots = serviceSlots[dayName].map((slot: any) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          staffId: slot.staffId || '',
          capacity: slot.capacity || service.maxCapacity || 1
        }));
      } else {
        // If no slots configured for this specific day, generate slots based on service configuration
        // This ensures the interface shows slots that match the service's actual configuration
        const serviceStartTime = service.startTime || '09:00';
        const serviceEndTime = service.endTime || '18:00';
        const serviceDuration = service.duration || 60; // Default 60 minutes
        
        // Generate slots based on service times and duration
        const startHour = parseInt(serviceStartTime.split(':')[0]);
        const startMinute = parseInt(serviceStartTime.split(':')[1]);
        const endHour = parseInt(serviceEndTime.split(':')[0]);
        const endMinute = parseInt(serviceEndTime.split(':')[1]);
        
        const startMinutes = startHour * 60 + startMinute;
        const endMinutes = endHour * 60 + endMinute;
        
        const generatedSlots = [];
        for (let minutes = startMinutes; minutes < endMinutes; minutes += serviceDuration) {
          const slotHour = Math.floor(minutes / 60);
          const slotMinute = minutes % 60;
          const slotStartTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
          
          const slotEndMinutes = minutes + serviceDuration;
          const slotEndHour = Math.floor(slotEndMinutes / 60);
          const slotEndMinute = slotEndMinutes % 60;
          const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;
          
          // Only add slot if it fits within the end time
          if (slotEndMinutes <= endMinutes) {
            generatedSlots.push({
              startTime: slotStartTime,
              endTime: slotEndTime,
              staffId: '',
              capacity: service.maxCapacity || 1
            });
          }
        }
        
        slots = generatedSlots.length > 0 ? generatedSlots : [
          // Fallback: if no slots can be generated, show at least one default slot
          { startTime: serviceStartTime, endTime: serviceEndTime, staffId: '', capacity: service.maxCapacity || 1 }
        ];
      }

      return {
        serviceId: service.id,
        serviceName: service.name,
        date: date,
        description: service.description || '',
        slots: slots
      };
    });

    console.log('📅 Found', dayConfigs.length, 'service configurations');

    return NextResponse.json({
      success: true,
      data: {
        date: date,
        services: dayConfigs,
        staff: staff
      }
    });

  } catch (error: any) {
    console.error('❌ Error fetching day config:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

// POST: Update service configuration for a specific day
export async function POST(request: NextRequest) {
  try {
    console.log('📅 POST /api/business/services/day-config - Starting...');

    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = serviceDayConfigSchema.parse(body);

    console.log('📅 Updating config for service:', validatedData.serviceId, 'date:', validatedData.date);

    // Get the service
    const service = await prisma.service.findFirst({
      where: {
        id: validatedData.serviceId,
        businessId
      }
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    // Update the service slots with the new configuration
    const currentSlots = service.slots as any || {};
    const dayOfWeek = new Date(validatedData.date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Update slots for this day
    currentSlots[dayName] = validatedData.slots.map(slot => ({
      startTime: slot.startTime,
      endTime: slot.endTime,
      staffId: slot.staffId,
      capacity: slot.capacity || service.maxCapacity || 1
    }));

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: validatedData.serviceId },
      data: {
        slots: currentSlots,
        updatedAt: new Date()
      }
    });

    console.log('✅ Service configuration updated successfully');

    return NextResponse.json({
      success: true,
      data: {
        serviceId: updatedService.id,
        date: validatedData.date,
        description: validatedData.description,
        slots: validatedData.slots
      }
    });

  } catch (error: any) {
    console.error('❌ Error updating day config:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid request body', 
          details: error.issues 
        } 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}
