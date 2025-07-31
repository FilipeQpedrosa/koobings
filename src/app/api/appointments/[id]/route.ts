import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
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
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
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
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: status as AppointmentStatus,
        notes,
        updatedAt: new Date(),
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
      },
    });

    console.log('✅ PATCH /api/appointments/[id] updated successfully:', updatedAppointment.id, 'new status:', updatedAppointment.status);
    
    // Trigger automatic notifications for status changes
    try {
      console.log('🔔 PATCH /api/appointments/[id] triggering notifications...');
      console.log('🔔 Notification URL:', `${process.env.NEXT_PUBLIC_APP_URL || 'https://koobings.com'}/api/appointments/${id}/notifications`);
      console.log('🔔 Payload:', { status: status, sendEmail: true });
      
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://koobings.com'}/api/appointments/${id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true',
          'Authorization': request.headers.get('Authorization') || '',
          'Cookie': request.headers.get('Cookie') || ''
        },
        body: JSON.stringify({
          status: status,
          sendEmail: true
        })
      });
      
      console.log('🔔 Notification response status:', notificationResponse.status);
      console.log('🔔 Notification response headers:', Object.fromEntries(notificationResponse.headers.entries()));
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('✅ Notifications triggered successfully:', notificationResult.data);
      } else {
        const errorText = await notificationResponse.text();
        console.log('⚠️ Notification trigger failed:', notificationResponse.status, errorText);
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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
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

    await prisma.appointment.delete({
      where: { id },
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