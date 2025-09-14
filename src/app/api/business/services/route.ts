import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';
import { randomUUID } from 'crypto';


// GET: List all services for a business
export async function GET(req: NextRequest) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    console.log('🔧 DEBUG: Fetching services for businessId:', businessId);

    // Use raw SQL to fetch all fields including the new ones
    const rawServices = await prisma.$queryRaw`
      SELECT * FROM "Service" 
      WHERE "businessId" = ${businessId} 
      ORDER BY "createdAt" DESC
    ` as any[];
    
    const services = rawServices as any[];

    console.log('🔧 DEBUG: Found', services.length, 'services for business');
    console.log('🔧 DEBUG: Latest service:', services[0] ? {
      id: services[0].id,
      name: services[0].name,
      createdAt: services[0].createdAt,
      slots: services[0].slots
    } : 'No services found');

    const response = NextResponse.json({ success: true, data: services });
    
    // Add anti-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('GET /business/services error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Error' } }, { status: 500 });
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    console.log('🔧 DEBUG: Creating service for businessId:', businessId);

    // Input validation
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      duration: z.number().int().positive(),
      price: z.number().nonnegative(),
      categoryId: z.string().optional(),
      image: z.string().optional(),
      // New location and slot fields
      location: z.string().optional(),
      address: z.string().optional(),
      maxCapacity: z.number().int().positive().optional(),
      availableDays: z.array(z.number().int().min(0).max(6)).optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      minAdvanceHours: z.number().int().positive().optional(),
      maxAdvanceDays: z.number().int().positive().optional(),
      anyTimeAvailable: z.boolean().optional(),
      slots: z.union([
        // Old format: array of slots with availableDays
        z.array(z.object({
          startTime: z.string(),
          endTime: z.string(),
          capacity: z.number().int().positive().optional(),
          availableDays: z.array(z.number().int().min(0).max(6)).optional()
        })),
        // New format: object with day names as keys
        z.record(z.string(), z.array(z.object({
          startTime: z.string(),
          endTime: z.string(),
          capacity: z.number().int().positive().optional()
        })))
      ]).optional(),
    });

    let body;
    try {
      body = await request.json();
      console.log('🔧 DEBUG: Request body:', body);
    } catch (err) {
      console.error('🔧 DEBUG: Invalid JSON body:', err);
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 });
    }

    let validatedData;
    try {
      validatedData = schema.parse(body);
      console.log('🔧 DEBUG: Validated data:', validatedData);
    } catch (error) {
      console.error('🔧 DEBUG: Validation error:', error);
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_SERVICE_DATA', message: 'Invalid service data', details: error.errors } }, { status: 400 });
      }
      throw error;
    }

    console.log('🔧 DEBUG: Creating service with data:', validatedData);

    // Convert slots from old format to new format if needed
    let processedSlots = validatedData.slots;
    if (validatedData.slots && Array.isArray(validatedData.slots)) {
      console.log('🔄 Converting slots from old format to new day-specific format');
      
      // Map day numbers to day names
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const convertedSlots: Record<string, any[]> = {};
      
      validatedData.slots.forEach((slot: any) => {
        if (slot.availableDays && Array.isArray(slot.availableDays)) {
          // This slot has specific days - add it to each specified day
          slot.availableDays.forEach((dayNumber: number) => {
            const dayName = dayNames[dayNumber];
            if (!convertedSlots[dayName]) {
              convertedSlots[dayName] = [];
            }
            convertedSlots[dayName].push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              capacity: slot.capacity
            });
          });
        } else {
          // This slot has no specific days - add it to all days (legacy behavior)
          dayNames.forEach(dayName => {
            if (!convertedSlots[dayName]) {
              convertedSlots[dayName] = [];
            }
            convertedSlots[dayName].push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              capacity: slot.capacity
            });
          });
        }
      });
      
      processedSlots = convertedSlots;
      console.log('🔄 Converted slots:', processedSlots);
    }

    const service = await prisma.service.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        businessId,
        ...validatedData,
        slots: processedSlots as any, // Cast as any for JSON field - override after spread
      } as any, // Cast the entire data object to bypass TypeScript issues
    });

    console.log('🔧 DEBUG: Service created successfully:', {
      id: service.id,
      name: service.name,
      businessId: service.businessId,
      createdAt: service.createdAt,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('POST /business/services error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future.