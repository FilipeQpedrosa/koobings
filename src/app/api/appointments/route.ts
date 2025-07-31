import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// GET handler
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Base query
    const where: any = {
      isDeleted: false,
      Client: {
        isDeleted: false // Only include appointments from non-deleted clients
      }
    };

    // Add filters based on role
    if (user.role === 'STAFF') {
      where.staffId = user.id;
    } else if (user.role === 'BUSINESS_OWNER') {
      where.businessId = user.businessId;
    }

    // Add date filter
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.scheduledFor = { gte: start, lte: end };
    }

    // Add status filter
    if (status && status !== 'all') {
      where.status = status;
    }

    // Add search filter
    if (search) {
      where.OR = [
        {
          client: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          service: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ];
    }

    const appointments = await prisma.appointments.findMany({
      where,
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        scheduledFor: 'desc',
      },
    });

    // Map scheduledFor to date and time for dashboard compatibility
    const mappedAppointments = appointments.map((apt: any) => {
      const scheduled = apt.scheduledFor instanceof Date ? apt.scheduledFor : new Date(apt.scheduledFor);
      return {
        ...apt,
        customer: apt.client,
        date: scheduled.toISOString().slice(0, 10),
        time: scheduled.toISOString().slice(11, 16),
      };
    });
    return NextResponse.json({ success: true, data: mappedAppointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: 'Failed to fetch appointments' } },
      { status: 500 }
    );
  }
}

// POST handler - WITH EXTENSIVE LOGGING
export async function POST(request: NextRequest) {
  console.log('🚀 [APPOINTMENTS_POST] Starting appointment creation...');
  
  try {
    // Try to get user from JWT cookie
    const user = getRequestAuthUser(request);
    console.log('👤 [APPOINTMENTS_POST] User found:', !!user);
    console.log('👤 [APPOINTMENTS_POST] User role:', user?.role);
    console.log('👤 [APPOINTMENTS_POST] User ID:', user?.id);
    console.log('👤 [APPOINTMENTS_POST] Business ID:', user?.businessId);

    if (!user || !['BUSINESS_OWNER', 'STAFF'].includes(user.role)) {
      console.log('❌ [APPOINTMENTS_POST] Unauthorized - invalid user or role');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log('📥 [APPOINTMENTS_POST] Request data:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.clientId || !data.serviceId || !data.date || !data.time) {
      console.log('❌ [APPOINTMENTS_POST] Missing required fields:', {
        clientId: !!data.clientId,
        serviceId: !!data.serviceId,
        date: !!data.date,
        time: !!data.time
      });
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Ensure businessId is present
    if (!user.businessId) {
      console.log('❌ [APPOINTMENTS_POST] Missing business ID');
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_ID_REQUIRED', message: 'Business ID is required to create an appointment.' } },
        { status: 400 }
      );
    }

    // Determine staffId based on user role and provided data
    let staffId = data.staffId;
    console.log('🔍 [APPOINTMENTS_POST] Initial staffId:', staffId);
    
    if (!staffId) {
      if (user.role === 'STAFF') {
        // For staff members, use their own ID
        staffId = user.id;
        console.log('👨‍💼 [APPOINTMENTS_POST] Using staff member ID:', staffId);
      } else if (user.role === 'BUSINESS_OWNER') {
        // For business owners, try to find a staff member in their business
        console.log('👔 [APPOINTMENTS_POST] Business owner - finding staff member...');
        const staffMember = await prisma.staff.findFirst({
          where: {
            businessId: user.businessId,
          },
          orderBy: [
            { role: 'desc' }, // ADMIN role comes first
            { createdAt: 'asc' } // Oldest staff member first
          ]
        });

        if (staffMember) {
          staffId = staffMember.id;
          console.log('✅ [APPOINTMENTS_POST] Found staff member:', staffMember.name, 'ID:', staffId);
        } else {
          console.log('❌ [APPOINTMENTS_POST] No staff members found for business:', user.businessId);
          return NextResponse.json(
            { success: false, error: { code: 'NO_STAFF_AVAILABLE', message: 'No staff members available to assign this appointment.' } },
            { status: 400 }
          );
        }
      }
    }

    // Validate that the staffId exists and belongs to the business
    console.log('🔍 [APPOINTMENTS_POST] Validating staff member...');
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId: user.businessId
      }
    });

    if (!staff) {
      console.log('❌ [APPOINTMENTS_POST] Invalid staff member - ID:', staffId, 'Business:', user.businessId);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_STAFF', message: 'Invalid staff member or staff does not belong to this business.' } },
        { status: 400 }
      );
    }
    console.log('✅ [APPOINTMENTS_POST] Staff member validated:', staff.name);

    // Fetch the service to get its duration
    console.log('🔍 [APPOINTMENTS_POST] Fetching service...');
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      select: { duration: true, name: true },
    });
    if (!service) {
      console.log('❌ [APPOINTMENTS_POST] Service not found:', data.serviceId);
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }
    console.log('✅ [APPOINTMENTS_POST] Service found:', service.name, 'Duration:', service.duration);

    // Combine date and time into a single Date object for scheduledFor
    const scheduledFor = new Date(`${data.date}T${data.time}`);
    console.log('📅 [APPOINTMENTS_POST] Scheduled for:', scheduledFor.toISOString());
    
    // Validate the date is not in the past
    if (scheduledFor < new Date()) {
      console.log('❌ [APPOINTMENTS_POST] Date is in the past:', scheduledFor);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_DATE', message: 'Cannot schedule appointments in the past.' } },
        { status: 400 }
      );
    }

    // Create the appointment
    console.log('💾 [APPOINTMENTS_POST] Creating appointment with data:', {
      clientId: data.clientId,
      serviceId: data.serviceId,
      staffId: staffId,
      businessId: user.businessId,
      scheduledFor: scheduledFor.toISOString(),
      duration: service.duration,
      notes: data.notes
    });

    const appointment = await (prisma as any).appointments.create({
      data: {
        id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        clientId: data.clientId,
        serviceId: data.serviceId,
        staffId: staffId,
        businessId: user.businessId,
        scheduledFor,
        duration: service.duration,
        status: 'PENDING',
        notes: data.notes,
        updatedAt: new Date()
      },
      include: {
        Client: true,
        Service: true,
        Staff: true,
      },
    });

    console.log('✅ [APPOINTMENTS_POST] Appointment created successfully:', appointment.id);

    // 🔔 SEND AUTOMATIC NOTIFICATIONS FOR NEW APPOINTMENT
    try {
      console.log('[APPOINTMENTS_POST] Sending automatic notifications...');
      
      const notificationResponse = await fetch(`https://koobings.com/api/appointments/${appointment.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true'
        },
        body: JSON.stringify({
          status: 'PENDING',
          sendEmail: true
        })
      });
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('[APPOINTMENTS_POST] ✅ Notifications sent successfully:', notificationResult.data);
      } else {
        console.log('[APPOINTMENTS_POST] ⚠️ Notification sending failed:', notificationResponse.status);
      }
    } catch (error) {
      console.log('[APPOINTMENTS_POST] ⚠️ Notification error (non-blocking):', error);
      // Non-blocking error - don't fail the appointment creation
    }

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('💥 [APPOINTMENTS_POST] Error creating appointment:', error);
    console.error('💥 [APPOINTMENTS_POST] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_CREATE_ERROR', message: 'Failed to create appointment', details: error instanceof Error ? error.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}

// PATCH handler
export async function PATCH(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user || !['BUSINESS_OWNER', 'STAFF'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_ID', message: 'Appointment ID is required' } },
        { status: 400 }
      );
    }

    // Check if appointment exists
    const appointment = await prisma.appointments.findUnique({
      where: { id: data.id },
      include: {
        Client: true,
        Service: true,
        Staff: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    if (
      user.role === 'STAFF' &&
      appointment.staffId !== user.id
    ) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'You can only update your own appointments' } },
        { status: 403 }
      );
    }

    // Update appointment
    const updatedAppointment = await prisma.appointments.update({
      where: { id: data.id },
      data: updateData,
      include: {
        Client: true,
        Service: true,
        Staff: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_UPDATE_ERROR', message: 'Failed to update appointment' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getRequestAuthUser(request as NextRequest);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_ID', message: 'Appointment ID is required' } }, { status: 400 });
    }

    // Check if appointment exists
    const appointment = await prisma.appointments.findUnique({
      where: { id },
      include: {
        Client: true,
        Service: true,
        Staff: true,
      },
    });

    if (!appointment) {
      return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' } }, { status: 404 });
    }

    // Cancel the appointment instead of hard delete
    await prisma.appointments.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return NextResponse.json({ success: false, error: { code: 'APPOINTMENT_DELETE_ERROR', message: 'Failed to cancel appointment' } }, { status: 500 });
  }
} 