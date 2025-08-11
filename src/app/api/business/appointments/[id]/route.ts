import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // EXTREMELY AGGRESSIVE LOGGING
  console.log('🚨🚨🚨 PATCH ENDPOINT CALLED - START 🚨🚨🚨');
  console.log('🚨 Time:', new Date().toISOString());
  console.log('🚨 Request URL:', request.url);
  console.log('🚨 Request Method:', request.method);
  
  try {
    console.log('🔧 DEBUG: PATCH endpoint called');
    const { id } = await params;
    console.log('🔧 DEBUG: Appointment ID:', id);
    
    const user = getRequestAuthUser(request);
    console.log('🔧 DEBUG: Auth user:', user);
    if (!user) {
      console.error('🔧 DEBUG: No user found');
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'Unauthorized',
          debug: 'No user found in JWT token'
        } 
      }, { status: 401 });
    }

    console.log('🔧 DEBUG: Looking for staff with email:', user.email);
    const staff = await prisma.staff.findUnique({
      where: { email: user.email }
    });
    console.log('🔧 DEBUG: Staff found:', staff ? 'YES' : 'NO');
    
    if (!staff) {
      console.error('🔧 DEBUG: Staff not found for email:', user.email);
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'STAFF_NOT_FOUND', 
          message: 'Staff not found',
          debug: `No staff found for email: ${user.email}`
        } 
      }, { status: 404 });
    }

    const body = await request.json();
    console.log('🔧 DEBUG: Request body:', body);
    const { status, scheduledFor, notes, staffId, serviceId } = body;
    console.log('PATCH /api/business/appointments/[id]', {
      id,
      body,
      staffEmail: staff.email,
      staffBusinessId: staff.businessId,
    });

    // Validate status value
    const allowedStatuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (status && !allowedStatuses.includes(status)) {
      console.error('Invalid status value:', status);
      return NextResponse.json({ success: false, error: { code: 'INVALID_STATUS', message: 'Invalid status value' } }, { status: 400 });
    }

    // Verify the appointment belongs to the staff's business
    // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
    const appointment = await prisma.appointments.findFirst({
      where: {
        id,
        businessId: staff.businessId,
      },
    });

    if (!appointment) {
      console.error('Appointment not found or does not belong to staff business', id, staff.businessId);
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (scheduledFor) updateData.scheduledFor = new Date(scheduledFor);
    if (notes !== undefined) updateData.notes = notes;
    if (staffId) updateData.staffId = staffId;
    if (serviceId) updateData.serviceId = serviceId;

    // Update the appointment
    let updatedAppointment;
    try {
      // @ts-ignore - Schema uses 'appointments' model, TypeScript is incorrect
      updatedAppointment = await prisma.appointments.update({
        where: { id },
        data: updateData,
        include: {
          Client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          Staff: {
            select: {
              id: true,
              name: true,
            },
          },
          Service: true,
        },
      });
    } catch (err) {
      console.error('Error updating appointment in Prisma:', err);
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Failed to update appointment', details: String(err) } }, { status: 500 });
    }

    const formattedAppointment = {
      id: updatedAppointment.id,
      client: {
        id: updatedAppointment.Client.id,
        name: updatedAppointment.Client.name,
        email: updatedAppointment.Client.email,
      },
      staff: {
        id: updatedAppointment.Staff.id,
        name: updatedAppointment.Staff.name,
      },
      services: updatedAppointment.Service ? [{ id: updatedAppointment.Service.id, name: updatedAppointment.Service.name }] : [],
      scheduledFor: updatedAppointment.scheduledFor.toISOString(),
      duration: updatedAppointment.Service?.duration,
      status: updatedAppointment.status,
      notes: updatedAppointment.notes || undefined,
    };

    return NextResponse.json({ success: true, data: formattedAppointment });
  } catch (error) {
    console.error('Error updating appointment (outer catch):', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'APPOINTMENT_UPDATE_ERROR', 
        message: 'Internal Server Error',
        debug: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      } 
    }, { status: 500 });
  }
} 