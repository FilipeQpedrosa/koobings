import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/staff/clients/[id] - Get client details, history, and notes
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = params.id;

  // Get staff's business and note restriction setting
  const staff = await prisma.staff.findUnique({
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
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
  }

  const businessId = staff.businessId;
  const restrictNotes = staff.business?.restrictStaffToViewAllNotes;

  // Get client (must belong to the same business)
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      appointments: {
        include: {
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
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  return NextResponse.json(client);
}

// PUT /api/staff/clients/[id] - Update client info
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = params.id;
  const data = await req.json();
  const { name, email, phone } = data;

  // Get staff's business
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: { businessId: true },
  });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
  }

  // Ensure client belongs to the same business
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { businessId: true },
  });
  if (!client || client.businessId !== staff.businessId) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  }

  try {
    const updated = await prisma.client.update({
      where: { id: clientId },
      data: { name, email, phone },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 