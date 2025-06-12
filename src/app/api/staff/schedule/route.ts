import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/staff/schedule - Get staff member's schedule
export async function GET(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');
  if (!staffId) {
    return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } } });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found for this business' }, { status: 404 });
  }
  const availability = await prisma.staffAvailability.findUnique({
    where: { staffId },
    include: { staff: true },
  });
  return NextResponse.json(availability);
}

// POST /api/staff/schedule - Create or update staff schedule
export async function POST(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const body = await request.json();
  const { staffId, schedule } = body;
  if (!staffId || !schedule) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } } });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found for this business' }, { status: 404 });
  }
  const availability = await prisma.staffAvailability.upsert({
    where: { staffId },
    update: { schedule },
    create: { staffId, schedule },
  });
  return NextResponse.json(availability);
}

// DELETE /api/staff/schedule - Delete staff schedule
export async function DELETE(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get('staffId');
  if (!staffId) {
    return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
  }
  // Ensure staff belongs to business
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } } });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found for this business' }, { status: 404 });
  }
  await prisma.staffAvailability.delete({
    where: { staffId },
  });
  return NextResponse.json({ message: 'Schedule deleted successfully' });
}