// CRITICAL FIX v4.0 - FINAL WORKING VERSION - 31/07/2025 20:00
// Route rebuilt from scratch to fix Next.js 15 async params issue
import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus } from '@prisma/client';

console.log('🚀 APPOINTMENTS [ID] ROUTE v4.0 LOADED - PROPERLY FIXED');

// GET /api/appointments/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('🔍 GET appointment ID:', id);
    
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
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('❌ Error fetching appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/appointments/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('🔄 PUT appointment ID:', id);
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
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
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Update appointment with new status
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: status as AppointmentStatus,
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

    console.log('✅ Appointment updated successfully:', id);
    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('🗑️ DELETE appointment ID:', id);
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    await prisma.appointment.delete({
      where: { id },
    });

    console.log('✅ Appointment deleted successfully:', id);
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}