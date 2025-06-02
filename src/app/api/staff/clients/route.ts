import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/staff/clients - List clients for the business
// POST /api/staff/clients - Add a new client

export async function GET(req: NextRequest) {
  const businessName = req.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const business = await prisma.business.findFirst({ where: { name: businessName } });
  if (!business) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const staffId = req.nextUrl.searchParams.get('staffId');
  let clients;
  if (staffId) {
    // Only clients with appointments or notes with this staff
    clients = await prisma.client.findMany({
      where: {
        businessId: business.id,
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
      where: { businessId: business.id },
      orderBy: { name: 'asc' },
    });
  }
  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const businessName = req.headers.get('x-business');
  if (!businessName) {
    return NextResponse.json({ error: 'Business subdomain missing' }, { status: 400 });
  }
  const business = await prisma.business.findFirst({ where: { name: businessName } });
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