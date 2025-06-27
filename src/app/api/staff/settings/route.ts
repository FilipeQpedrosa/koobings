import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const businessId = request.headers.get('x-business-id');
  if (!businessId) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: {
    restrictStaffToViewAllClients: business.restrictStaffToViewAllClients ?? false,
    restrictStaffToViewAllNotes: business.restrictStaffToViewAllNotes ?? false,
  }});
}

export async function PATCH(request: Request) {
  const businessId = request.headers.get('x-business-id');
  const body = await request.json();
  console.log('[PATCH /api/staff/settings] businessId:', businessId, 'body:', body);
  if (!businessId) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } }, { status: 400 });
  }
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
  }
  const { restrictStaffToViewAllClients, restrictStaffToViewAllNotes } = body;
  if (typeof restrictStaffToViewAllClients !== 'boolean' || typeof restrictStaffToViewAllNotes !== 'boolean') {
    return NextResponse.json({ success: false, error: { code: 'INVALID_VALUE', message: 'Invalid value' } }, { status: 400 });
  }
  await prisma.business.update({
    where: { id: business.id },
    data: {
      restrictStaffToViewAllClients,
      restrictStaffToViewAllNotes,
    },
  });
  return NextResponse.json({ success: true, data: { restrictStaffToViewAllClients, restrictStaffToViewAllNotes } });
} 