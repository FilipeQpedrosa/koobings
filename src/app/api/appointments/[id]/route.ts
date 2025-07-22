import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointments.findUnique({
      where: { id: params.id },
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
            email: true,
          },
        },
        Service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization - business owners and staff can view appointments
    if (user.role === 'STAFF' && appointment.staffId !== user.id && appointment.businessId !== user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
      { status: 500 }
    );
  }
}

// PATCH /api/appointments/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      console.error('PATCH /api/appointments/[id]: No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes } = body;
    console.log('🔧 PATCH /api/appointments/[id] payload:', body);
    console.log('👤 PATCH /api/appointments/[id] user:', { id: user.id, role: user.role, businessId: user.businessId });

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const appointment = await prisma.appointments.findUnique({
      where: { id: params.id },
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
            email: true,
          },
        },
        Service: true,
      },
    });
    console.log('📋 PATCH /api/appointments/[id] found appointment:', appointment?.id, 'status:', appointment?.status);

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Check authorization - staff can update appointments in their business
    if (user.role === 'STAFF' && appointment.businessId !== user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Updated status transition validation with ACCEPTED and REJECTED states
    const currentStatus = appointment.status;
    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['ACCEPTED', 'REJECTED'],
      ACCEPTED: ['COMPLETED', 'CANCELLED'],
      REJECTED: [], // Final state
      COMPLETED: [], // Final state
      CANCELLED: [], // Final state
    };
    
    console.log('🔄 Status transition check:', { currentStatus, requestedStatus: status, allowed: allowedTransitions[currentStatus] });
    
    if (!allowedTransitions[currentStatus]?.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // Update appointment with new status
    const updatedAppointment = await prisma.appointments.update({
      where: { id: params.id },
      data: {
        status: status as AppointmentStatus,
        notes,
        updatedAt: new Date(),
      },
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
            email: true,
          },
        },
        Service: true,
      },
    });

    console.log('✅ PATCH /api/appointments/[id] updated successfully:', updatedAppointment.id, 'new status:', updatedAppointment.status);
    
    // Trigger automatic notifications for status changes
    try {
      const notificationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/appointments/${params.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': request.headers.get('Authorization') || '',
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: JSON.stringify({
          status: status,
          sendEmail: true
        })
      });
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('✅ Notifications triggered successfully:', notificationResult.data);
      } else {
        console.log('⚠️ Notification trigger failed:', notificationResponse.status);
      }
    } catch (error) {
      console.log('⚠️ Notification trigger error (non-blocking):', error);
      // Non-blocking error - don't fail the status update
    }
    
    // Add anti-cache headers
    const response = NextResponse.json(updatedAppointment);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointments.findUnique({
      where: { id: params.id },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Allow deletion by staff or business owner of the same business
    if (!['STAFF', 'BUSINESS_OWNER'].includes(user.role) || appointment.businessId !== user.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.appointments.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}