import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function parseSettings(settings: any) {
  if (!settings) return {};
  if (typeof settings === 'string') {
    try {
      return JSON.parse(settings);
    } catch {
      return {};
    }
  }
  return settings;
}

export async function GET(request: Request) {
  const businessId = request.headers.get('x-business-id');
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID missing' }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  return NextResponse.json({
    restrictStaffToViewAllClients: business.restrictStaffToViewAllClients ?? false,
    restrictStaffToViewAllNotes: business.restrictStaffToViewAllNotes ?? false,
  });
}

export async function PATCH(request: Request) {
  const businessId = request.headers.get('x-business-id');
  const body = await request.json();
  console.log('[PATCH /api/staff/settings] businessId:', businessId, 'body:', body);
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID missing' }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const { restrictStaffToViewAllClients, restrictStaffToViewAllNotes } = body;
  if (typeof restrictStaffToViewAllClients !== 'boolean' || typeof restrictStaffToViewAllNotes !== 'boolean') {
    return NextResponse.json({ error: 'Invalid value' }, { status: 400 });
  }
  await prisma.business.update({
    where: { id: business.id },
    data: {
      restrictStaffToViewAllClients,
      restrictStaffToViewAllNotes,
    },
  });
  return NextResponse.json({ success: true, restrictStaffToViewAllClients, restrictStaffToViewAllNotes });
} 