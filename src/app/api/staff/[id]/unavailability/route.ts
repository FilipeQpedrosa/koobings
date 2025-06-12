import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET: List all unavailability periods for a staff member
export async function GET(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split('/');
  const staffId = segments[segments.indexOf('staff') + 1];
  
  // Optionally: check session/permissions
  const unavailability = await prisma.staffUnavailability.findMany({
    where: { staffId },
    orderBy: { start: 'asc' },
  });
  return NextResponse.json({ success: true, data: unavailability });
}

// POST: Create a new unavailability period for a staff member
export async function POST(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split('/');
  const staffId = segments[segments.indexOf('staff') + 1];
  
  const body = await req.json();
  const { start, end, reason } = body;
  if (!start || !end) {
    return NextResponse.json({ success: false, error: 'Start and end are required.' }, { status: 400 });
  }
  const unavailability = await prisma.staffUnavailability.create({
    data: { staffId, start: new Date(start), end: new Date(end), reason },
  });
  return NextResponse.json({ success: true, data: unavailability });
}

// PATCH: Update an unavailability period (by id)
export async function PATCH(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split('/');
  const staffId = segments[segments.indexOf('staff') + 1];
  
  const body = await req.json();
  const { unavailabilityId, start, end, reason } = body;
  if (!unavailabilityId) {
    return NextResponse.json({ success: false, error: 'Unavailability ID required.' }, { status: 400 });
  }
  const updated = await prisma.staffUnavailability.update({
    where: { id: unavailabilityId, staffId },
    data: { start: start ? new Date(start) : undefined, end: end ? new Date(end) : undefined, reason },
  });
  return NextResponse.json({ success: true, data: updated });
}

// DELETE: Remove an unavailability period (by id)
export async function DELETE(req: NextRequest) {
  const { pathname } = new URL(req.url);
  const segments = pathname.split('/');
  const staffId = segments[segments.indexOf('staff') + 1];
  
  const { unavailabilityId } = await req.json();
  if (!unavailabilityId) {
    return NextResponse.json({ success: false, error: 'Unavailability ID required.' }, { status: 400 });
  }
  await prisma.staffUnavailability.delete({
    where: { id: unavailabilityId, staffId },
  });
  return NextResponse.json({ success: true });
} 