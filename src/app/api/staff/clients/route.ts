import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/staff/clients - List clients for the staff member (with business settings)
// POST /api/staff/clients - Add a new client

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: {
      businessId: true,
      business: {
        select: {
          restrictStaffToViewAllClients: true
        }
      }
    },
  });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
  }

  const businessId = staff.businessId;
  const restrict = staff.business?.restrictStaffToViewAllClients;

  let clients;
  if (restrict) {
    // Only clients with appointments or notes with this staff
    clients = await prisma.client.findMany({
      where: {
        businessId,
        OR: [
          { appointments: { some: { staffId } } },
          { relationshipNotes: { some: { createdById: staffId } } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  } else {
    // All business clients
    clients = await prisma.client.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
  }

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const staff = await prisma.staff.findUnique({
    where: { id: staffId },
    select: {
      businessId: true
    }
  });
  if (!staff) {
    return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
  }

  const businessId = staff.businessId;
  const data = await req.json();
  const { name, email, phone } = data;
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        businessId,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 