import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';


// GET: List all services for a business
export async function GET(req: NextRequest) {
  try {
    console.log('🔍 /api/business/services GET - Starting...');
    
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('❌ Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      console.error('❌ Missing business ID for user:', user.email);
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    console.log('✅ User authenticated:', user.email, 'Business ID:', businessId);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    console.log('🔧 DEBUG: Include inactive services:', includeInactive);

    // Use raw SQL to fetch all fields including the new ones
    let rawServices;
    
    try {
      // First, try with isActive field (new approach)
      if (includeInactive) {
        rawServices = await prisma.$queryRaw`
          SELECT * FROM "Service" 
          WHERE "businessId" = ${businessId} 
          ORDER BY "isActive" DESC, "createdAt" DESC
        ` as any[];
      } else {
        rawServices = await prisma.$queryRaw`
          SELECT * FROM "Service" 
          WHERE "businessId" = ${businessId} 
          AND "isActive" = true
          ORDER BY "createdAt" DESC
        ` as any[];
      }
    } catch (error) {
      console.log('⚠️ isActive field not available, falling back to basic query:', error.message);
      
      // Fallback: Use basic query without isActive field
      rawServices = await prisma.$queryRaw`
        SELECT * FROM "Service" 
        WHERE "businessId" = ${businessId} 
        ORDER BY "createdAt" DESC
      ` as any[];
      
      // If not including inactive, filter out services that might be inactive
      if (!includeInactive) {
        rawServices = rawServices.filter((service: any) => service.isActive !== false);
      }
    }
    
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
    
    console.log('✅ Services API completed successfully');
    return response;
  } catch (error: any) {
    console.error('❌ GET /business/services error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n')
    });
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      console.error('❌ Unauthorized: No JWT token or invalid token.');
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
      description: z.string().optional().nullable(),
      duration: z.number().int().positive(),
      price: z.number().nonnegative(),
      categoryId: z.string().optional().nullable(),
      image: z.string().optional().nullable(),
      // New location and slot fields
      location: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      maxCapacity: z.number().int().positive().optional(),
      availableDays: z.array(z.number().int().min(0).max(6)).optional(),
      startTime: z.string().optional().nullable(),
      endTime: z.string().optional().nullable(),
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
      ]).optional().nullable(),
      // ✅ NEW FIELDS FROM FRONTEND (only if they exist in database)
      // eventType: z.enum(['INDIVIDUAL', 'GROUP']).optional(), // ❌ Column doesn't exist
      // capacity: z.number().int().positive().optional(), // ❌ Column doesn't exist
      // availabilitySchedule: z.record(z.string(), z.any()).optional(), // ❌ Column doesn't exist
      // slotsNeeded: z.number().int().positive().optional(), // ❌ Column doesn't exist
      // isActive: z.boolean().optional(), // ❌ Column doesn't exist
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

    // Create clean data object with only valid fields
    const cleanData: any = {
      updatedAt: new Date(),
      businessId,
      name: validatedData.name,
      description: validatedData.description,
      duration: Number(validatedData.duration), // Ensure it's a number
      price: Number(validatedData.price), // Ensure it's a number (Float in Prisma)
    };

    // Add optional fields only if they exist and have valid values
    if (validatedData.categoryId) cleanData.categoryId = validatedData.categoryId;
    if (validatedData.image) cleanData.image = validatedData.image;
    if (validatedData.location) cleanData.location = validatedData.location;
    if (validatedData.address) cleanData.address = validatedData.address;
    if (validatedData.maxCapacity) cleanData.maxCapacity = validatedData.maxCapacity;
    if (validatedData.availableDays) cleanData.availableDays = validatedData.availableDays;
    if (validatedData.startTime) cleanData.startTime = validatedData.startTime;
    if (validatedData.endTime) cleanData.endTime = validatedData.endTime;
    if (validatedData.minAdvanceHours) cleanData.minAdvanceHours = validatedData.minAdvanceHours;
    if (validatedData.maxAdvanceDays) cleanData.maxAdvanceDays = validatedData.maxAdvanceDays;
    if (validatedData.anyTimeAvailable !== undefined) cleanData.anyTimeAvailable = validatedData.anyTimeAvailable;
    if (processedSlots !== undefined) cleanData.slots = processedSlots;
    
    // Add new fields with defaults (only if they exist in the database)
    // cleanData.eventType = validatedData.eventType || 'INDIVIDUAL'; // ❌ Column doesn't exist
    // cleanData.capacity = validatedData.capacity || 1; // ❌ Column doesn't exist  
    // cleanData.slotsNeeded = validatedData.slotsNeeded || 1; // ❌ Column doesn't exist
    // cleanData.isActive = validatedData.isActive !== undefined ? validatedData.isActive : true; // ❌ Column doesn't exist
    // cleanData.availabilitySchedule = validatedData.availabilitySchedule || {}; // ❌ Column doesn't exist

    // Validate required fields before creating
    if (!cleanData.businessId) {
      throw new Error('businessId is required');
    }
    if (!cleanData.name) {
      throw new Error('name is required');
    }
    if (!cleanData.duration || isNaN(cleanData.duration)) {
      throw new Error('duration must be a valid number');
    }
    if (!cleanData.price || isNaN(cleanData.price)) {
      throw new Error('price must be a valid number');
    }
    if (!cleanData.updatedAt) {
      throw new Error('updatedAt is required');
    }

    console.log('🔧 DEBUG: Clean data for Prisma:', cleanData);
    console.log('🔧 DEBUG: Data types:', {
      businessId: typeof cleanData.businessId,
      name: typeof cleanData.name,
      duration: typeof cleanData.duration,
      price: typeof cleanData.price,
      updatedAt: typeof cleanData.updatedAt
    });

    const service = await prisma.service.create({
      data: cleanData,
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
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error',
        details: process.env.NODE_ENV === 'development' ? {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace'
        } : undefined
      }
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 PUT /business/services - Starting service update...');
    
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

    // Get service ID from URL
    const url = new URL(request.url);
    const serviceId = url.searchParams.get('id');
    
    if (!serviceId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_ID_MISSING', message: 'Service ID is required' } 
      }, { status: 400 });
    }

    // Input validation (same schema as POST)
    const schema = z.object({
      name: z.string().min(1),
      description: z.string().optional().nullable(),
      duration: z.number().int().positive(),
      price: z.number().nonnegative(),
      categoryId: z.string().optional().nullable(),
      image: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
      address: z.string().optional().nullable(),
      maxCapacity: z.number().int().positive().optional(),
      availableDays: z.array(z.number().int().min(0).max(6)).optional(),
      startTime: z.string().optional().nullable(),
      endTime: z.string().optional().nullable(),
      minAdvanceHours: z.number().int().positive().optional(),
      maxAdvanceDays: z.number().int().positive().optional(),
      anyTimeAvailable: z.boolean().optional(),
      slots: z.union([
        z.array(z.object({
          startTime: z.string(),
          endTime: z.string(),
          capacity: z.number().int().positive().optional(),
          availableDays: z.array(z.number().int().min(0).max(6)).optional()
        })),
        z.record(z.string(), z.array(z.object({
          startTime: z.string(),
          endTime: z.string(),
          capacity: z.number().int().positive().optional()
        })))
      ]).optional().nullable(),
    });

    const body = await request.json();
    const validatedData = schema.parse(body);

    console.log('🔄 PUT /business/services - Validated data:', validatedData);

    // Check if service exists and belongs to business
    const existingService = await prisma.service.findUnique({
      where: { 
        id: serviceId,
        businessId 
      }
    });

    if (!existingService) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Convert slots from old format to new format if needed
    let processedSlots = validatedData.slots;
    if (validatedData.slots && Array.isArray(validatedData.slots)) {
      console.log('🔄 Converting slots from old format to new day-specific format');
      
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const convertedSlots: any = {};
      
      validatedData.slots.forEach((slot: any) => {
        if (slot.availableDays && Array.isArray(slot.availableDays)) {
          slot.availableDays.forEach((dayNum: number) => {
            const dayName = dayNames[dayNum];
            if (!convertedSlots[dayName]) {
              convertedSlots[dayName] = [];
            }
            convertedSlots[dayName].push({
              startTime: slot.startTime,
              endTime: slot.endTime,
              capacity: slot.capacity || 1
            });
          });
        }
      });
      
      processedSlots = convertedSlots;
      console.log('🔄 Converted slots:', processedSlots);
    }

    // Create clean data object with only valid fields
    const cleanData: any = {
      updatedAt: new Date(),
      name: validatedData.name,
      description: validatedData.description,
      duration: Number(validatedData.duration),
      price: Number(validatedData.price),
    };

    // Add optional fields only if they exist and have valid values
    if (validatedData.categoryId) cleanData.categoryId = validatedData.categoryId;
    if (validatedData.image) cleanData.image = validatedData.image;
    if (validatedData.location) cleanData.location = validatedData.location;
    if (validatedData.address) cleanData.address = validatedData.address;
    if (validatedData.maxCapacity) cleanData.maxCapacity = validatedData.maxCapacity;
    if (validatedData.availableDays) cleanData.availableDays = validatedData.availableDays;
    if (validatedData.startTime) cleanData.startTime = validatedData.startTime;
    if (validatedData.endTime) cleanData.endTime = validatedData.endTime;
    if (validatedData.minAdvanceHours) cleanData.minAdvanceHours = validatedData.minAdvanceHours;
    if (validatedData.maxAdvanceDays) cleanData.maxAdvanceDays = validatedData.maxAdvanceDays;
    if (validatedData.anyTimeAvailable !== undefined) cleanData.anyTimeAvailable = validatedData.anyTimeAvailable;
    if (processedSlots !== undefined) cleanData.slots = processedSlots;

    console.log('🔄 PUT /business/services - Clean data for Prisma:', cleanData);

    // Update the service
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: cleanData,
    });

    console.log('✅ PUT /business/services - Service updated successfully:', updatedService.id);

    return NextResponse.json({
      success: true,
      data: updatedService
    });

  } catch (error) {
    console.error('❌ PUT /business/services error:', error);
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