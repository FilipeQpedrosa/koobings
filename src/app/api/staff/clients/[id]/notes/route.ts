import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

// POST /api/staff/clients/[id]/notes - Add a note to a client
export async function POST(req: NextRequest, { params }: any) {
  const user = getRequestAuthUser(req);
  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const businessId = user.businessId;
  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID missing' }, { status: 400 });
  }

  const staffId = user.id;
  const clientId = params.id;
  
  try {
    const data = await req.json();
    const { content, noteType = 'GENERAL', appointmentId } = data;

    if (!content || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
    }

    // Ensure client belongs to the same business
    const client = await prisma.client.findUnique({
      where: { 
        id: clientId,
        businessId: businessId
      }
    });

    if (!client) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    // Validate appointment if provided
    if (appointmentId) {
      const appointment = await prisma.appointments.findUnique({
        where: { 
          id: appointmentId,
          clientId: clientId,
          businessId: businessId
        }
      });
      
      if (!appointment) {
        return NextResponse.json({ success: false, error: 'Invalid appointment' }, { status: 400 });
      }
    }

    // Create the note
    const note = await prisma.relationship_notes.create({
      data: {
        id: createId(),
        noteType: noteType,
        content: content.trim(),
        createdById: staffId,
        businessId: businessId,
        clientId: clientId,
        appointmentId: appointmentId || null,
        updatedAt: new Date()
      },
      include: {
        Staff: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: note }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 