import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { createId } from '@paralleldrive/cuid2';

export const dynamic = 'force-dynamic';

// POST: Enroll a client in a slot
export async function POST(request: NextRequest, { params }: { params: { slotId: string, studentId: string } }) {
  try {
    console.log('🔍 /api/slots/[slotId]/students/[studentId] POST - Starting...');
    
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

    const { slotId, studentId } = params;
    console.log('🔍 Enrolling client in slot:', { slotId, studentId });

    // Parse slotId to extract service info and date
    // Format: serviceId-dayOfWeek-startTime (e.g., "service123-1-09:00")
    // Handle URL-encoded colons in startTime
    const slotIdParts = slotId.split('-');
    if (slotIdParts.length < 3) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    const serviceId = slotIdParts.slice(0, -2).join('-');
    const dayOfWeekStr = slotIdParts[slotIdParts.length - 2];
    const startTime = slotIdParts[slotIdParts.length - 1].replace('%3A', ':');
    const dayOfWeek = parseInt(dayOfWeekStr);

    if (!serviceId || isNaN(dayOfWeek) || !startTime) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    // Verify service exists and belongs to business
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId,
        isActive: true
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Verify client exists and belongs to business
    const client = await prisma.client.findFirst({
      where: { 
        id: studentId,
        businessId
      }
    });

    if (!client) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CLIENT_NOT_FOUND', message: 'Client not found' } 
      }, { status: 404 });
    }

    if (!client.isEligible) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'CLIENT_NOT_ELIGIBLE', message: 'Client is not eligible for bookings' } 
      }, { status: 400 });
    }

    // Get the date from the request URL (passed from frontend)
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    if (!dateParam) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'DATE_MISSING', message: 'Date parameter is required' } 
      }, { status: 400 });
    }

    // Check if client is already enrolled in this specific slot on this specific date
    const slotDate = new Date(`${dateParam}T00:00:00`);
    const existingAppointment = await prisma.appointments.findFirst({
      where: {
        serviceId,
        clientId: studentId,
        businessId,
        scheduledFor: {
          gte: new Date(slotDate.setHours(0, 0, 0, 0)),
          lt: new Date(slotDate.setHours(23, 59, 59, 999))
        }
      }
    });

    if (existingAppointment) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'ALREADY_ENROLLED', message: 'Client is already enrolled in this slot' } 
      }, { status: 400 });
    }

    // 🕐 STAFF BYPASS: Staff can add clients at any time (no time limit validation)
    // This allows staff to add clients even after the slot time has passed

    // Get a default staff member for this business (or use the current user if they're staff)
    let assignedStaffId = '';
    console.log('🔍 User role:', user.role, 'User ID:', user.id);
    
    if (user.role === 'STAFF' || user.role === 'BUSINESS_OWNER') {
      assignedStaffId = user.id;
      console.log('🔍 Using current user as staff:', assignedStaffId);
    } else {
      // Find any staff member from this business
      const defaultStaff = await prisma.staff.findFirst({
        where: { businessId },
        select: { id: true }
      });
      if (defaultStaff) {
        assignedStaffId = defaultStaff.id;
        console.log('🔍 Using default staff:', assignedStaffId);
      } else {
        console.error('❌ No staff found for business:', businessId);
        return NextResponse.json({ 
          success: false, 
          error: { code: 'NO_STAFF_FOUND', message: 'No staff member found for this business' } 
        }, { status: 400 });
      }
    }

    // Create appointment (enrollment)
    console.log('🔍 Creating appointment with data:', {
      serviceId,
      clientId: studentId,
      businessId,
      staffId: assignedStaffId,
      scheduledFor: `${dateParam}T${startTime}:00`,
      duration: service.duration || 60,
      status: 'CONFIRMED'
    });
    
    const appointment = await prisma.appointments.create({
      data: {
        id: createId(),
        serviceId,
        clientId: studentId,
        businessId,
        staffId: assignedStaffId,
        scheduledFor: new Date(`${dateParam}T${startTime}:00`),
        duration: service.duration || 60, // Default to 60 minutes if not set
        status: 'CONFIRMED',
        notes: `Staff enrolled in ${service.name}`,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isEligible: true
          }
        }
      }
    });

    console.log('✅ Client enrolled successfully');
    return NextResponse.json({
      success: true,
      data: {
        id: appointment.id,
        clientId: appointment.clientId,
        client: appointment.Client,
        status: appointment.status,
        attendance: false
      }
    });

  } catch (error: any) {
    console.error('❌ Error enrolling client:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'ENROLLMENT_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

// DELETE: Remove a client from a slot
export async function DELETE(request: NextRequest, { params }: { params: { slotId: string, studentId: string } }) {
  try {
    console.log('🔍 /api/slots/[slotId]/students/[studentId] DELETE - Starting...');
    
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

    const { slotId, studentId } = params;
    console.log('🔍 Removing client from slot:', { slotId, studentId });

    // Parse slotId to extract service info
    const [serviceId, dayOfWeekStr, startTime] = slotId.split('-');
    const dayOfWeek = parseInt(dayOfWeekStr);

    if (!serviceId || isNaN(dayOfWeek) || !startTime) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    // Find and delete the appointment
    const appointment = await prisma.appointments.findFirst({
      where: {
        serviceId,
        clientId: studentId,
        businessId,
        // TODO: Add proper date/time filtering
      }
    });

    if (!appointment) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'ENROLLMENT_NOT_FOUND', message: 'Client is not enrolled in this slot' } 
      }, { status: 404 });
    }

    await prisma.appointments.delete({
      where: { id: appointment.id }
    });

    console.log('✅ Client removed successfully');
    return NextResponse.json({
      success: true,
      data: null
    });

  } catch (error: any) {
    console.error('❌ Error removing client:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'REMOVAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

// PATCH: Update attendance
export async function PATCH(request: NextRequest, { params }: { params: { slotId: string, studentId: string } }) {
  try {
    console.log('🔍 /api/slots/[slotId]/students/[studentId]/attendance PATCH - Starting...');
    
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

    const { slotId, studentId } = params;
    const body = await request.json();
    const { attendance } = body;

    console.log('🔍 Updating attendance:', { slotId, studentId, attendance });

    // Parse slotId to extract service info
    const [serviceId, dayOfWeekStr, startTime] = slotId.split('-');
    const dayOfWeek = parseInt(dayOfWeekStr);

    if (!serviceId || isNaN(dayOfWeek) || !startTime) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'INVALID_SLOT_ID', message: 'Invalid slot ID format' } 
      }, { status: 400 });
    }

    // Find the appointment
    const appointment = await prisma.appointments.findFirst({
      where: {
        serviceId,
        clientId: studentId,
        businessId,
        // TODO: Add proper date/time filtering
      }
    });

    if (!appointment) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'ENROLLMENT_NOT_FOUND', message: 'Client is not enrolled in this slot' } 
      }, { status: 404 });
    }

    // Update appointment with attendance info
    // For now, we'll store this in the notes field or create a separate attendance tracking system
    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointment.id },
      data: {
        notes: attendance ? 'Presente' : 'Ausente',
        updatedAt: new Date()
      }
    });

    console.log('✅ Attendance updated successfully');
    return NextResponse.json({
      success: true,
      data: {
        id: updatedAppointment.id,
        attendance: attendance
      }
    });

  } catch (error: any) {
    console.error('❌ Error updating attendance:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'ATTENDANCE_UPDATE_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}