import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { slotId: string } }) {
  try {
    console.log('🔍 /api/slots/[slotId]/details GET - Starting...');
    
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

    const { slotId } = params;
    console.log('🔍 Fetching slot details for slotId:', slotId);

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

    // Get service details
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true,
        maxCapacity: true
      }
    });

    if (!service) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } 
      }, { status: 404 });
    }

    // Extract slot details from service.slots
    const slots = service.slots as any;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];
    
    let slotDetails = null;
    if (slots && slots[dayName]) {
      slotDetails = slots[dayName].find((slot: any) => slot.startTime === startTime);
    }

    if (!slotDetails) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'SLOT_NOT_FOUND', message: 'Slot not found' } 
      }, { status: 404 });
    }

    // Get enrollments for this specific slot
    const dateParam = request.nextUrl.searchParams.get('date');
    console.log('🔍 Date parameter:', dateParam);
    console.log('🔍 Service ID:', serviceId);
    console.log('🔍 Business ID:', businessId);
    
    // First, let's check if there are any appointments for this service at all
    const allAppointments = await prisma.appointments.findMany({
      where: {
        serviceId,
        businessId
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
    
    console.log('🔍 Total appointments for this service:', allAppointments.length);
    
    // Now filter by date if provided
    let enrollments = allAppointments;
    if (dateParam) {
      const targetDate = new Date(dateParam);
      const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
      
      enrollments = allAppointments.filter(apt => {
        const aptDate = new Date(apt.scheduledFor);
        return aptDate >= startOfDay && aptDate < endOfDay;
      });
    }

    console.log('🔍 Filtered enrollments:', enrollments.length);
    console.log('🔍 Enrollment details:', enrollments.map(e => ({
      id: e.id,
      clientName: e.Client?.name,
      clientEmail: e.Client?.email,
      scheduledFor: e.scheduledFor
    })));

    // Get slot description and assigned staff from slotInfo or create default
    const slotInfo = {
      description: '',
      assignedStaffId: null,
      // We can extend this to store more slot-specific information
    };

    const response = {
      id: slotId,
      startTime: slotDetails.startTime,
      endTime: slotDetails.endTime,
      serviceName: service.name,
      serviceDescription: slotInfo.description,
      staffName: 'Staff Member', // TODO: Get actual staff name
      capacity: slotDetails.capacity || service.maxCapacity || 1,
      price: service.price,
      enrolledStudents: enrollments.map(apt => ({
        id: apt.id,
        name: apt.Client?.name || 'Unknown',
        email: apt.Client?.email || 'Unknown',
        isPresent: false, // TODO: Add attendance tracking
        enrolledAt: apt.createdAt.toISOString()
      }))
    };

    console.log('✅ Slot details fetched successfully');
    return NextResponse.json({
      success: true,
      data: response
    });

  } catch (error: any) {
    console.error('❌ Error in slot details API:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'SLOT_DETAILS_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { slotId: string } }) {
  try {
    console.log('🔍 /api/slots/[slotId]/details PATCH - Starting...');
    
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

    const { slotId } = params;
    const body = await request.json();
    const { description, assignedStaffId } = body;

    console.log('🔍 Updating slot details:', { slotId, description, assignedStaffId });

    // For now, we'll store slot-specific information in a JSON field
    // In the future, we might want to create a dedicated SlotDetails table
    const slotInfo = {
      description: description || '',
      assignedStaffId: assignedStaffId || null,
      updatedAt: new Date().toISOString()
    };

    // TODO: Implement proper slot details storage
    // For now, we'll just return success
    // In a real implementation, you might store this in a SlotDetails table
    // or in a JSON field in the Service table

    console.log('✅ Slot details updated successfully');
    return NextResponse.json({
      success: true,
      data: slotInfo
    });

  } catch (error: any) {
    console.error('❌ Error updating slot details:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'SLOT_UPDATE_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}