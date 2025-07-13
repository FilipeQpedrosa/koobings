import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { z } from 'zod';
import { getRequestAuthUser } from '@/lib/jwt';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/business/appointments GET - Starting...');
    
    // Get authenticated user
    const user = getRequestAuthUser(request);
    console.log('🔍 User found:', !!user);
    console.log('🔍 User role:', user?.role);
    console.log('🔍 User businessId:', user?.businessId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }
    
    // Get business ID from authenticated user
    let businessId: string;
    
    if (user.role === 'BUSINESS_OWNER') {
      // For business owners, use their business ID
      businessId = user.businessId!;
      console.log('🏢 Business owner - using businessId:', businessId);
    } else if (user.role === 'STAFF') {
      // For staff members, use their business ID
      businessId = user.businessId!;
      console.log('👤 Staff member - using businessId:', businessId);
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
    
    // Query with includes to get related data for the authenticated user's business
    const appointments = await (prisma as any).appointments.findMany({
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
      orderBy: { scheduledFor: 'desc' },
      take: 50, // Limit to 50 for performance
    });
    
    console.log('🔍 Found appointments for business', businessId, ':', appointments.length);
    
    // Proper transformation with real data
    const formattedAppointments = appointments.map((apt: any) => ({
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
    }));
    
    return NextResponse.json({
      success: true,
      data: {
        appointments: formattedAppointments,
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
      staffId: z.string().min(1) // Made required since modal always sends it
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
    
    const { clientId, serviceIds, scheduledFor, notes, staffId } = parsed;
    console.log('[POST /api/business/appointments] body:', parsed);

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

    // Create appointment with correct schema capitalization
    const appointment = await (prisma as any).appointments.create({
      data: {
        id: randomUUID(), // Add explicit ID generation
        businessId: businessId,
        clientId: clientId,
        serviceId,
        staffId: staffId,
        scheduledFor: scheduledDateTime,
        duration: service.duration,
        notes,
        status: 'PENDING',
        updatedAt: new Date(), // Add explicit updatedAt
      },
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

    const formattedAppointment = {
      id: appointment.id,
      client: {
        id: appointment.Client?.id,
        name: appointment.Client?.name,
        email: appointment.Client?.email,
      },
      scheduledFor: appointment.scheduledFor.toISOString(),
      status: appointment.status,
      notes: appointment.notes || undefined,
      staff: appointment.Staff ? {
        id: appointment.Staff.id,
        name: appointment.Staff.name,
      } : undefined,
      services: appointment.Service ? [{
        id: appointment.Service.id,
        name: appointment.Service.name,
        duration: appointment.Service.duration,
      }] : [],
    };

    return NextResponse.json({ success: true, data: formattedAppointment });
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
    const overlapping = await (prisma as any).appointments.findFirst({
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