import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

// POST /api/appointments/[id]/notes - Add a note to an appointment (saved to client notes)
export async function POST(req: NextRequest, { params }: any) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    const staffId = user.id;
    
    if (!businessId || !staffId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID or staff ID' } }, { status: 400 });
    }

    const appointmentId = params.id;
    
    const data = await req.json();
    const { content } = data;
    
    if (!content || content.trim() === '') {
      return NextResponse.json({ success: false, error: { code: 'CONTENT_REQUIRED', message: 'Note content is required' } }, { status: 400 });
    }

    // First, get the appointment to find the client
    const appointment = await prisma.appointments.findUnique({
      where: { 
        id: appointmentId,
        businessId: businessId // Ensure appointment belongs to this business
      },
      select: {
        clientId: true,
        Service: {
          select: {
            name: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } }, { status: 404 });
    }

    console.log('🔧 DEBUG: Creating appointment note for client:', appointment.clientId, 'by staff:', staffId);

    // Create a note linked to both the appointment and client
    const note = await prisma.relationship_notes.create({
      data: {
        id: createId(),
        noteType: 'GENERAL',
        content: `[${appointment.Service.name}] ${content.trim()}`,
        clientId: appointment.clientId,
        appointmentId: appointmentId,
        createdById: staffId,
        businessId: businessId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        Staff: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    console.log('🔧 DEBUG: Appointment note created successfully:', note.id);
    
    const response = NextResponse.json({ success: true, data: note }, { status: 201 });
    
    // Add anti-cache headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error('POST /appointments/[id]/notes error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create appointment note' } }, { status: 500 });
  }
} 

// GET /api/appointments/[id]/notes - Get all notes for an appointment
export async function GET(req: NextRequest, { params }: any) {
  try {
    const user = getRequestAuthUser(req);
    
    if (!user) {
      console.error('Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const appointmentId = params.id;

    // First, verify the appointment belongs to this business
    const appointment = await prisma.appointments.findUnique({
      where: { 
        id: appointmentId,
        businessId: businessId 
      },
      select: {
        id: true,
        clientId: true
      }
    });

    if (!appointment) {
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } }, { status: 404 });
    }

    // Get all notes for this appointment
    const notes = await prisma.relationship_notes.findMany({
      where: {
        appointmentId: appointmentId,
        businessId: businessId
      },
      include: {
        Staff: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ success: true, data: notes }, { status: 200 });
    
  } catch (error) {
    console.error('GET /appointments/[id]/notes error:', error);
    return NextResponse.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch appointment notes' } }, { status: 500 });
  }
} 