import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const enrollSchema = z.object({
  slotId: z.string(),
  date: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 POST /api/slots/enroll - Client enrollment...');
    
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

    const body = await request.json();
    const validatedData = enrollSchema.parse(body);

    console.log('🎯 Enrollment data:', validatedData);

    // Check if client is eligible
    const client = await prisma.client.findUnique({
      where: { 
        id: user.id,
        businessId 
      },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        isEligible: true 
      }
    });

    if (!client) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } 
      }, { status: 404 });
    }

    if (!client.isEligible) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CLIENT_NOT_ELIGIBLE', message: 'Client is not eligible for classes' } 
      }, { status: 403 });
    }

    // Parse slot ID format: serviceId-day-startTime
    // Example: 8668d111-ea39-47f0-a799-e382a903dc47-22-09:00
    const slotIdParts = validatedData.slotId.split('-');
    if (slotIdParts.length < 3) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    const serviceId = slotIdParts.slice(0, -2).join('-');
    const day = slotIdParts[slotIdParts.length - 2];
    const startTime = slotIdParts[slotIdParts.length - 1].replace('%3A', ':'); // Decode URL-encoded colon

    console.log('🎯 Parsed slot components:', { serviceId, day, startTime });

    // Find the service
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Get slot information from service.slots
    const slots = service.slots as any;
    let slotInfo = null;

    if (slots && typeof slots === 'object') {
      if (Array.isArray(slots)) {
        // Old format: array of slots
        slotInfo = slots.find((slot: any) => slot.startTime === startTime);
      } else {
        // New format: object with day names as keys
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayOfWeek = parseInt(day);
        const dayName = dayNames[dayOfWeek];
        
        if (slots[dayName] && Array.isArray(slots[dayName])) {
          slotInfo = slots[dayName].find((slot: any) => slot.startTime === startTime);
        }
      }
    }

    if (!slotInfo) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SLOT_NOT_FOUND', message: 'Slot not found in service' } 
      }, { status: 404 });
    }

    // Check if already enrolled
    const slotDate = new Date(validatedData.date);
    const existingEnrollment = await prisma.appointments.findFirst({
      where: {
        clientId: client.id,
        serviceId: service.id,
        scheduledFor: {
          gte: new Date(slotDate.setHours(0, 0, 0, 0)),
          lt: new Date(slotDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'ALREADY_ENROLLED', message: 'Already enrolled in this slot' } 
      }, { status: 400 });
    }

    // 🕐 TIME LIMIT VALIDATION: Check if enrollment is still allowed
    const slotDateTime = new Date(`${validatedData.date}T${startTime}:00`);
    const now = new Date();
    
    // If the slot time has passed, don't allow enrollment
    if (now >= slotDateTime) {
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'ENROLLMENT_CLOSED', 
          message: 'Enrollment is no longer available for this time slot' 
        } 
      }, { status: 400 });
    }

    // Create appointment
    const appointment = await prisma.appointments.create({
      data: {
        id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clientId: client.id,
        serviceId: service.id,
        scheduledFor: new Date(`${validatedData.date}T${startTime}:00`),
        status: 'CONFIRMED',
        notes: `Auto-enrolled in ${service.name}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Client enrolled successfully:', appointment.id);

    return NextResponse.json({
      success: true,
      data: {
        appointmentId: appointment.id,
        message: 'Successfully enrolled in class'
      }
    });

  } catch (error) {
    console.error('❌ POST /api/slots/enroll error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
