import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const timeSlotSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const dayScheduleSchema = z.object({
  isWorking: z.boolean(),
  timeSlots: z.array(timeSlotSchema),
});

const weeklyScheduleSchema = z.record(dayScheduleSchema);

export async function GET(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_SUBDOMAIN_MISSING', message: 'Business subdomain missing' } }, { status: 400 });
  }
  const staffId = request.nextUrl.searchParams.get('staffId');
  if (!staffId) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_STAFF_ID', message: 'Missing staffId' } }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } }, include: { availability: true } });
  if (!staff) {
    return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found for this business' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: staff.availability });
}

export async function PUT(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_SUBDOMAIN_MISSING', message: 'Business subdomain missing' } }, { status: 400 });
  }
  const staffId = request.nextUrl.searchParams.get('staffId');
  if (!staffId) {
    return NextResponse.json({ success: false, error: { code: 'MISSING_STAFF_ID', message: 'Missing staffId' } }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } } });
  if (!staff) {
    return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found for this business' } }, { status: 404 });
  }
  const body = await request.json();
  // Validate request body
  const validatedSchedule = weeklyScheduleSchema.parse(body);
  // Update availability
  const availability = await prisma.staffAvailability.upsert({
    where: { staffId },
    create: { staffId, schedule: validatedSchedule },
    update: { schedule: validatedSchedule },
  });
  return NextResponse.json({ success: true, data: availability });
} 