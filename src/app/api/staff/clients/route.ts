import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/staff/clients - List clients for the business
// POST /api/staff/clients - Add a new client

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const businessId = session.user.businessId;
  if (!businessId) {
    return NextResponse.json({ error: 'Business ID missing' }, { status: 400 });
  }
  const staffId = session.user.id;
  const staffRole = session.user.staffRole;
  // Fetch business and setting
  const business = await prisma.business.findUnique({ where: { id: businessId } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const restrict = business.restrictStaffToViewAllClients;
  let clients;
  // Admins always see all clients
  if (session.user.role === 'STAFF' && staffRole === 'ADMIN') {
    clients = await prisma.client.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
  } else if (!restrict) {
    // Setting is off: all staff see all clients
    clients = await prisma.client.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
  } else {
    // Setting is on: standard staff see only their clients
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
  }
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  let businessName = req.headers.get('x-business');
  if (process.env.NODE_ENV === 'development' && !businessName) {
    // Fallback: get business from session in development only
    const session = await getServerSession(authOptions);
    businessName = session?.user?.businessId ?? null;
  }
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  // Ensure businessName is a string (not undefined)
  const businessNameStr = businessName as string;
  const businessLookup = process.env.NODE_ENV === 'development'
    ? { id: businessNameStr }
    : { name: businessNameStr };
  const business = await prisma.business.findFirst({ where: businessLookup });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
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
        businessId: business.id,
      },
    });
    return NextResponse.json(client, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 