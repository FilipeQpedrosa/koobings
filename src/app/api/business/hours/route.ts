import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

const businessHoursSchema = z.object({
  hours: z.array(z.object({
    day: z.number().int().min(0).max(6), // 0 = Sunday, 6 = Saturday
    isOpen: z.boolean(),
    start: z.string().regex(timeRegex, 'Invalid time format').nullable(),
    end: z.string().regex(timeRegex, 'Invalid time format').nullable(),
    lunchBreakStart: z.string().regex(timeRegex, 'Invalid time format').nullable().optional(),
    lunchBreakEnd: z.string().regex(timeRegex, 'Invalid time format').nullable().optional(),
  })).refine((hours) => {
    return hours.every(hour => {
      if (!hour.isOpen) return true;
      if (!hour.start || !hour.end) return false;
      const start = new Date(`1970-01-01T${hour.start}`);
      const end = new Date(`1970-01-01T${hour.end}`);
      
      // Validate lunch break times if provided
      if (hour.lunchBreakStart && hour.lunchBreakEnd) {
        const lunchStart = new Date(`1970-01-01T${hour.lunchBreakStart}`);
        const lunchEnd = new Date(`1970-01-01T${hour.lunchBreakEnd}`);
        
        // Lunch break must be within business hours and end after start
        return end > start && 
               lunchEnd > lunchStart && 
               lunchStart >= start && 
               lunchEnd <= end;
      }
      
      return end > start;
    });
  }, 'Invalid time configuration')
});

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      console.error('Unauthorized: No user or email.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Get business ID from authenticated user
    let businessId: string;
    
    if (user.role === 'BUSINESS_OWNER') {
      businessId = user.businessId!;
    } else if (user.role === 'STAFF') {
      businessId = user.businessId!;
    } else {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid user role' } }, { status: 401 });
    }

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
    }

    const hours = await prisma.businessHours.findMany({
      where: { businessId: businessId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: hours.map(hour => ({
        day: hour.dayOfWeek,
        isOpen: hour.isOpen,
        start: hour.startTime,
        end: hour.endTime,
        lunchBreakStart: (hour as any).lunchBreakStart,
        lunchBreakEnd: (hour as any).lunchBreakEnd,
      }))
    });
  } catch (error) {
    console.error('GET /business/hours error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      console.error('Unauthorized: No user or email.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    // Get business ID from authenticated user
    let businessId: string;
    
    if (user.role === 'BUSINESS_OWNER') {
      businessId = user.businessId!;
    } else if (user.role === 'STAFF') {
      businessId = user.businessId!;
    } else {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid user role' } }, { status: 401 });
    }

    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
    }

    const body = await request.json();
    const validation = businessHoursSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error);
      return NextResponse.json({ success: false, error: { code: 'INVALID_BUSINESS_HOURS', message: 'Validation error', details: validation.error.errors } }, { status: 400 });
    }
    const validatedData = validation.data;

    // Delete existing hours
    await prisma.businessHours.deleteMany({
      where: { businessId: businessId },
    });

    // Create new hours
    const createData = validatedData.hours.map(hour => ({
      id: `${businessId}_${hour.day}_${Date.now()}`, // Generate unique ID
      businessId: businessId,
      dayOfWeek: hour.day,
      isOpen: hour.isOpen,
      startTime: hour.start,
      endTime: hour.end,
      lunchBreakStart: hour.lunchBreakStart || null,
      lunchBreakEnd: hour.lunchBreakEnd || null,
    }));

    await prisma.businessHours.createMany({
      data: createData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_BUSINESS_HOURS', message: 'Validation error', details: error.errors } }, { status: 400 });
    }
    console.error('POST /business/hours error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 