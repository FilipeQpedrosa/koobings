import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/staff/clients/[id]/notes - Add a note to a client
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = params.id;
  const data = await req.json();
  const { content, noteType = 'GENERAL', appointmentId } = data;

  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 });
  }
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

  // Only require appointmentId validation if provided
  let appointmentData: any = {};
  if (appointmentId) {
    // Ensure appointment belongs to the client and business
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { clientId: true, businessId: true },
    });
    if (!appointment || appointment.clientId !== clientId || appointment.businessId !== staff.businessId) {
      return NextResponse.json({ error: 'Invalid appointment' }, { status: 400 });
    }
    appointmentData.appointmentId = appointmentId;
  }

  try {
    const note = await prisma.relationshipNote.create({
      data: {
        noteType,
        content,
        createdById: staffId,
        businessId: staff.businessId,
        clientId,
        ...appointmentData,
      },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 