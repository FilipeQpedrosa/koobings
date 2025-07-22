import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper function to validate business portal settings
async function validateBusinessPortalSettings(businessId: string) {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { settings: true, name: true }
  });
  
  if (!business) {
    return { valid: false, error: 'Business not found' };
  }
  
  const settings = business.settings as any || {};
  
  // Check if client portal is enabled
  if (settings.clientPortalEnabled === false) {
    return { 
      valid: false, 
      error: 'Portal cliente não está disponível para este negócio' 
    };
  }
  
  // Check if online booking is allowed
  if (settings.allowOnlineBooking === false) {
    return { 
      valid: false, 
      error: 'Marcações online não estão disponíveis para este negócio' 
    };
  }
  
  return { valid: true, autoConfirm: settings.autoConfirmBookings !== false };
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();
    const { serviceId, staffId, date, time, customerInfo } = data;

    if (!serviceId || !staffId || !date || !time) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Get the service
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        Business: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    // 🔒 VALIDATE BUSINESS PORTAL SETTINGS
    const portalValidation = await validateBusinessPortalSettings(service.businessId);
    
    if (!portalValidation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'PORTAL_DISABLED', message: portalValidation.error } },
        { status: 403 }
      );
    }

    // Create start date time from date and time strings
    const startDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    // Check if the slot is available
    const existingAppointment = await prisma.appointments.findFirst({
      where: {
        scheduledFor: startDateTime,
        Service: { id: serviceId },
        Staff: { id: staffId }
      },
      include: {
        Service: true,
        Staff: true
      }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { success: false, error: { code: 'SLOT_NOT_AVAILABLE', message: 'Slot not available' } },
        { status: 400 }
      );
    }

    // First, ensure the client exists
    const clientData = session?.user?.email ? {
      email: session.user.email,
      name: session.user.name || 'Guest User',
      status: 'ACTIVE'
    } : {
      email: customerInfo.email,
      name: customerInfo.name,
      phone: customerInfo.phone,
      status: 'ACTIVE'
    };

    const client = await prisma.client.upsert({
      where: { email: clientData.email },
      create: {
        ...clientData,
        business: {
          connect: { id: service.BusinessId }
        }
      },
      update: {} // Don't update existing client data
    });

    // Create the appointment
    const appointment = await prisma.appointments.create({
      data: {
        scheduledFor: startDateTime,
        duration: service.duration,
        status: 'PENDING',
        notes: customerInfo?.notes,
        Service: {
          connect: { id: serviceId }
        },
        Staff: {
          connect: { id: staffId }
        },
        client: {
          connect: { id: client.id }
        },
        business: {
          connect: { id: service.BusinessId }
        }
      },
      include: {
        Service: true,
        Staff: true,
        client: true,
        business: true
      }
    });

    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BOOKING_CREATE_ERROR', message: 'Failed to create booking' } },
      { status: 500 }
    );
  }
} 