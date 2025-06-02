import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/staff/profile - Get staff member profile
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
  const staff = await prisma.staff.findFirst({ where: { id: staffId, business: { name: businessName } }, include: { services: true, schedules: true, availability: true, permissions: true } });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found for this business' }, { status: 404 });
  }
  return NextResponse.json(staff);
}

// POST /api/staff/profile - Create or update staff profile
export async function POST(request: NextRequest) {
  const businessName = request.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const body = await request.json();
  const { id, email, name, role, services } = body;
  if (!email || !name || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Find business
  const business = await prisma.business.findFirst({ where: { name: businessName } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  // Upsert staff for this business
  const staff = await prisma.staff.upsert({
    where: { id: id || 'new' },
    update: {
      email,
      name,
      role,
      businessId: business.id,
      services: { set: services || [] },
    },
    create: {
      email,
      name,
      role,
      businessId: business.id,
      services: { connect: services || [] },
    },
  });
  return NextResponse.json(staff);
}

// DELETE /api/staff/profile - Delete staff profile
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
  await prisma.staff.delete({ where: { id: staffId } });
  return NextResponse.json({ message: 'Staff profile deleted successfully' });
} 