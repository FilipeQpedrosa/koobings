// CACHE BUSTER - 04/08/2025 15:01 - FORCE ENDPOINT CACHE INVALIDATION
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { z } from 'zod';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { randomUUID } from 'crypto';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/business/appointments GET - Starting...');
    console.log('🔍 Runtime:', process.env.VERCEL_REGION, 'Node version:', process.version);
    
    // More aggressive Prisma initialization check
    if (!prisma) {
      console.error('🔍 Prisma client is null/undefined!');
      return NextResponse.json({
        success: false,
        error: { code: 'PRISMA_NOT_INITIALIZED', message: 'Database client not initialized' }
      }, { status: 500 });
    }

    // Check for Prisma models - use the correct plural form
    console.log('🔍 Available Prisma models:', Object.keys(prisma));
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    console.log('🔍 Checking appointments (plural):', !!prisma.appointments);
    
    // Use the correct model name that actually exists
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    if (!prisma.appointments) {
      console.error('🔍 Appointments model not found!');
      return NextResponse.json({
        success: false,
        error: { code: 'PRISMA_MODEL_MISSING', message: 'Appointments model not available' }
      }, { status: 500 });
    }
    
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    console.log('🔍 Using appointments model:', !!prisma.appointments);
    
    // Test basic Prisma functionality
    try {
      await prisma.$connect();
      console.log('🔍 Prisma connection successful');
      
      // Test if we can query anything at all
      const testQuery = await prisma.$queryRaw`SELECT 1 as test`;
      console.log('🔍 Raw query test successful:', testQuery);
      
    } catch (dbError) {
      console.error('🔍 Prisma connection/query failed:', dbError);
      return NextResponse.json({
        success: false,
        error: { code: 'DATABASE_CONNECTION_ERROR', message: 'Database connection failed' }
      }, { status: 500 });
    }
    
    // Debug: Check if Prisma is initialized
    console.log('🔍 Prisma client status:', !!prisma);
    console.log('🔍 Prisma type:', typeof prisma);
    console.log('🔍 Prisma appointment model:', !!prisma?.appointment);
    
    // Get authenticated user
    const user = getRequestAuthUser(request);
    console.log('🔍 User found:', !!user);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }
    
    // Get business ID from authenticated user
    let businessId: string;
    
    if (user.role === 'BUSINESS_OWNER') {
      businessId = user.businessId!;
    } else if (user.role === 'STAFF') {
      businessId = user.businessId!;
    } else {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid user role' } },
        { status: 401 }
      );
    }
    
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } },
        { status: 400 }
      );
    }
    
    // Query with proper relationships
    console.log('🔍 Querying appointments for businessId:', businessId);
    
    let appointments;
    try {
      // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
      appointments = await prisma.appointments.findMany({
        where: { businessId },
        include: {
          Client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          Service: {
            select: {
              id: true,
              name: true,
              duration: true,
              price: true
            }
          },
          Staff: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      console.log('🔍 Query with relations successful, found:', appointments.length);
    } catch (queryError) {
      console.error('🔍 Appointment query failed:', queryError);
      return NextResponse.json({
        success: false,
        error: { code: 'QUERY_FAILED', message: 'Database query failed' }
      }, { status: 500 });
    }
    
    // Return properly formatted response with all necessary data
    return NextResponse.json({
      success: true,
      data: {
        appointments: appointments.map((apt: any) => ({
          id: apt.id,
          client: {
            id: apt.Client?.id || null,
            name: apt.Client?.name || 'Cliente Desconhecido',
            email: apt.Client?.email || null,
            phone: apt.Client?.phone || null
          },
          scheduledFor: apt.scheduledFor,
          status: apt.status,
          notes: apt.notes,
          services: apt.Service ? [{
            id: apt.Service.id,
            name: apt.Service.name,
            duration: apt.Service.duration,
            price: apt.Service.price
          }] : [{ name: 'Serviço Desconhecido' }],
          staff: {
            id: apt.Staff?.id || null,
            name: apt.Staff?.name || 'Staff Desconhecido'
          },
          duration: apt.duration || apt.Service?.duration || 60,
        })),
        total: appointments.length,
      }
    });
  } catch (error: any) {
    console.error('❌ Error in appointments API:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'APPOINTMENTS_FETCH_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/business/appointments POST - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user || !user.email) {
      console.error('Unauthorized: No user or email.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Get the staff member and their business or use business from session
    let staff;
    let businessId = user.businessId;
    
    if (user.role === 'BUSINESS_OWNER') {
      // For business owners, we already have businessId from session
      if (!businessId) {
        return NextResponse.json({ error: 'Business not found' }, { status: 401 });
      }
    } else {
      // For staff members, find them in database
      staff = await prisma.staff.findUnique({
        where: { email: user.email }
      });

      if (!staff) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      businessId = staff.businessId;
    }

    // Input validation - updated to match modal data structure
    const schema = z.object({
      clientId: z.string().min(1),
      serviceIds: z.array(z.string()).min(1), // Changed from serviceId to serviceIds array
      scheduledFor: z.string().min(1), // Changed from startTime to scheduledFor
      notes: z.string().optional(),
      staffId: z.string().min(1), // Made required since modal always sends it
      // Add slot information for slot-based services
      slotInfo: z.object({
        startTime: z.string(),
        endTime: z.string(),
        slotIndex: z.number().int().nonnegative(),
        capacity: z.number().int().positive().optional()
      }).optional()
    });
    
    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    
    let parsed;
    try {
      parsed = schema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
      }
      throw error;
    }
    
    const { clientId, serviceIds, scheduledFor, notes, staffId, slotInfo } = parsed;
    console.log('[POST /api/business/appointments] body:', parsed);
    console.log('[POST /api/business/appointments] slotInfo:', slotInfo);

    // For now, we'll just use the first service ID (can be enhanced later for multiple services)
    const serviceId = serviceIds[0];

    // Get service to calculate duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    let scheduledDateTime;
    try {
      scheduledDateTime = new Date(scheduledFor);
      if (isNaN(scheduledDateTime.getTime())) throw new Error('Invalid scheduledFor');
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_DATETIME', message: 'Invalid scheduledFor format' } }, { status: 400 });
    }

    // Prepare appointment data
    const appointmentData: any = {
      id: randomUUID(), // Add explicit ID generation
      businessId: businessId,
      clientId: clientId,
      serviceId,
      staffId: staffId,
      scheduledFor: scheduledDateTime,
      duration: service.duration,
      notes: notes || '',
      status: 'PENDING',
      updatedAt: new Date(), // Add explicit updatedAt
    };

    // If this is a slot-based booking, store slot information
    if (slotInfo) {
      appointmentData.slotInfo = slotInfo;
      console.log('[POST /api/business/appointments] Added slot info:', slotInfo);
    }

    // Create appointment with correct schema capitalization
    // @ts-ignore - Schema uses 'appointments' but TypeScript expects 'appointment'
    const appointment = await prisma.appointments.create({
      data: appointmentData,
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        Staff: {
          select: {
            id: true,
            name: true,
          },
        },
        Service: {
          select: {
            id: true,
            name: true,
            duration: true,
          },
        },
      },
    });

    console.log('[POST /api/business/appointments] Appointment created successfully:', appointment.id);

    // 🔔 SEND AUTOMATIC NOTIFICATIONS FOR NEW APPOINTMENT
    try {
      console.log('[POST /api/business/appointments] Sending automatic notifications...');
      
      const notificationResponse = await fetch(`https://koobings.com/api/appointments/${appointment.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'PENDING',
          sendEmail: true
        })
      });
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('[POST /api/business/appointments] ✅ Notifications sent successfully:', notificationResult.data);
      } else {
        console.log('[POST /api/business/appointments] ⚠️ Notification sending failed:', notificationResponse.status);
      }
    } catch (error) {
      console.log('[POST /api/business/appointments] ⚠️ Notification error (non-blocking):', error);
      // Non-blocking error - don't fail the appointment creation
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error: any) {
    console.error('POST /business/appointments error:', error);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_CREATE_ERROR', message: error.message || 'Internal Server Error' } }, { status: 500 });
  }
}

// New endpoint: /api/business/appointments/check-availability
export async function PUT(request: NextRequest) {
  // This is a convention for a custom endpoint, since Next.js API routes don't support subroutes easily
  // The frontend should call this with method PUT and the correct payload
  try {
    const user = getRequestAuthUser(request);
    if (!user || !user.email) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Get the staff member and their business or use business from session
    let staff;
    let businessId = user.businessId;
    
    if (user.role === 'BUSINESS_OWNER') {
      // For business owners, we already have businessId from session
      if (!businessId) {
        return NextResponse.json({ error: 'Business not found' }, { status: 401 });
      }
    } else {
      // For staff members, find them in database
      staff = await prisma.staff.findUnique({
        where: { email: user.email }
      });

      if (!staff) {
        return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
      }
      businessId = staff.businessId;
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } }, { status: 400 });
    }
    const { staffId, date, startTime, duration } = body;
    if (!staffId || !date || !startTime || !duration) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields: staffId, date, startTime, duration' } }, { status: 400 });
    }
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    // Find overlapping appointments for this staff
    // @ts-ignore - Schema uses 'appointments' but TypeScript expects 'appointment'
    const overlapping = await prisma.appointments.findFirst({
      where: {
        staffId,
        scheduledFor: {
          lt: end,
          gte: new Date(date + 'T00:00:00'),
        },
        // End time of existing appointment must be after start
        // (scheduledFor + duration) > start
      },
    });
    let isAvailable = true;
    if (overlapping) {
      // Calculate end time of existing appointment
      const existingEnd = new Date(overlapping.scheduledFor.getTime() + overlapping.duration * 60000);
      if (existingEnd > start) {
        isAvailable = false;
      }
    }
    return NextResponse.json({ success: true, data: { available: isAvailable } });
  } catch (error) {
    console.error('Error checking staff availability:', error);
    return NextResponse.json({ success: false, error: { code: 'AVAILABILITY_CHECK_ERROR', message: error instanceof Error ? error.message : 'Internal Server Error' } }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 