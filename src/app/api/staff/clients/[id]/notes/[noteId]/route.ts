import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PUT /api/staff/clients/[id]/notes/[noteId] - Edit a note
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'STAFF') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = session.user.id;
  const clientId = params.id;
  const noteId = params.noteId;
  const data = await req.json();
  const { content, noteType, appointmentId } = data;

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

  // Ensure note belongs to the client and was authored by this staff
  const note = await prisma.relationshipNote.findUnique({
    where: { id: noteId },
    select: { clientId: true, createdById: true },
  });
  if (!note || note.clientId !== clientId || note.createdById !== staffId) {
    return NextResponse.json({ error: 'Not allowed to edit this note' }, { status: 403 });
  }

  // If appointmentId is provided, validate it
  let updateData: any = {};
  if (typeof content === 'string') updateData.content = content;
  if (typeof noteType === 'string') updateData.noteType = noteType;
  if (appointmentId) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { clientId: true, businessId: true },
    });
    if (!appointment || appointment.clientId !== clientId || appointment.businessId !== staff.businessId) {
      return NextResponse.json({ error: 'Invalid appointment' }, { status: 400 });
    }
    updateData.appointmentId = appointmentId;
  }

  try {
    const updated = await prisma.relationshipNote.update({
      where: { id: noteId },
      data: updateData,
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 