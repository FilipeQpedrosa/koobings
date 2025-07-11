import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/staff/clients/[id] - Get client details, history, and notes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== 'STAFF' && session.user.role !== 'BUSINESS_OWNER')) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = new URL(req.url).pathname.split('/').at(-1);

  // Get staff's business and note restriction setting OR business owner's business
  let staff;
  let businessId;
  
  if (session.user.role === 'BUSINESS_OWNER') {
    // For business owners, use businessId directly from session
    businessId = session.user.businessId;
  } else {
    // For staff members, get from staff record
    staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        businessId: true,
        business: {
          select: {
            restrictStaffToViewAllNotes: true
          }
        }
      },
    });
    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
    }
    businessId = staff.businessId;
  }

  const restrictNotes = staff?.business?.restrictStaffToViewAllNotes || false;

  // Get client (must belong to the same business)
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      appointments: {
        select: {
          id: true,
          scheduledFor: true,
          notes: true,
          status: true,
          service: true,
          staff: { select: { id: true, name: true } },
        },
        orderBy: { scheduledFor: 'desc' },
      },
      relationshipNotes: restrictNotes
        ? { where: { createdById: staffId }, orderBy: { createdAt: 'desc' } }
        : { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!client || client.businessId !== businessId) {
    return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: client });
}

// PUT /api/staff/clients/[id] - Update client info
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== 'STAFF' && session.user.role !== 'BUSINESS_OWNER')) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = new URL(req.url).pathname.split('/').at(-1);
  const data = await req.json();
  const { name, email, phone } = data;

  // Get business ID from staff or business owner
  let businessId;
  
  if (session.user.role === 'BUSINESS_OWNER') {
    // For business owners, use businessId directly from session
    businessId = session.user.businessId;
  } else {
    // For staff members, get from staff record
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: { businessId: true },
    });
    if (!staff) {
      return NextResponse.json({ success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff not found' } }, { status: 404 });
    }
    businessId = staff.businessId;
  }

  // Ensure client belongs to the same business
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { businessId: true },
  });
  if (!client || client.businessId !== businessId) {
    return NextResponse.json({ success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } }, { status: 404 });
  }

  try {
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { name, email, phone },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: { code: 'CLIENT_UPDATE_ERROR', message: err.message } }, { status: 500 });
  }
} 