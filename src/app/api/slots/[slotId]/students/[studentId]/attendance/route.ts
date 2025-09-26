import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateAttendanceSchema = z.object({
  isPresent: z.boolean(),
});

export async function PATCH(request: NextRequest, { params }: { params: { slotId: string, studentId: string } }) {
  try {
    console.log(`✅ PATCH /api/slots/${params.slotId}/students/${params.studentId}/attendance - Updating attendance...`);
    
    // Authentication check
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } 
      }, { status: 400 });
    }

    // Check if user is staff
    if (user.role !== 'STAFF' && !user.isAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Only staff can update attendance' } 
      }, { status: 403 });
    }

    const slotId = params.slotId;
    const studentId = params.studentId;
    const body = await request.json();
    const validatedData = updateAttendanceSchema.parse(body);

    console.log('✅ Attendance update data:', validatedData);

    // Parse slot ID format: serviceId-day-startTime
    const slotIdParts = slotId.split('-');
    if (slotIdParts.length < 3) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    const serviceId = slotIdParts.slice(0, -2).join('-');
    console.log('✅ Service ID:', serviceId);

    // Find the service
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Update appointment status based on attendance
    const appointment = await prisma.appointments.findFirst({
      where: {
        serviceId: service.id,
        clientId: studentId
      }
    });

    if (!appointment) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } 
      }, { status: 404 });
    }

    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointment.id },
      data: {
        status: validatedData.isPresent ? 'COMPLETED' : 'CONFIRMED',
        updatedAt: new Date()
      }
    });

    console.log('✅ Attendance updated successfully for appointment:', updatedAppointment.id);

    return NextResponse.json({
      success: true,
      data: {
        isPresent: validatedData.isPresent
      }
    });

  } catch (error) {
    console.error('❌ PATCH /api/slots/[slotId]/students/[studentId]/attendance error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : 'Internal Error'
      }
    }, { status: 500 });
  }
}
