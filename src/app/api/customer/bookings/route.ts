import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

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

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      businessId, 
      serviceId, 
      staffId, 
      scheduledFor, 
      notes 
    } = body;

    // Validate required fields
    if (!businessId || !serviceId || !staffId || !scheduledFor) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Dados obrigatórios em falta' } },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await prisma.customer.findFirst({
      where: { email: user.email },
      select: { id: true, name: true, email: true }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    // Validate business portal settings
    const businessValidation = await validateBusinessPortalSettings(businessId);
    if (!businessValidation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_UNAVAILABLE', message: businessValidation.error } },
        { status: 400 }
      );
    }

    // Validate service exists and belongs to business
    // @ts-ignore - Schema uses Service model (singular, capitalized)
    const service = await prisma.Service.findFirst({
      where: { 
        id: serviceId, 
        businessId: businessId 
      },
      select: { 
        id: true, 
        name: true, 
        duration: true, 
        price: true 
      }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Serviço não encontrado' } },
        { status: 404 }
      );
    }

    // Validate staff exists and belongs to business
    const staff = await prisma.staff.findFirst({
      where: { 
        id: staffId, 
        businessId: businessId 
      },
      select: { 
        id: true, 
        name: true 
      }
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Profissional não encontrado' } },
        { status: 404 }
      );
    }

    // Create appointment
    // @ts-ignore - Schema uses appointments model (plural)
    const appointment = await prisma.appointments.create({
      data: {
        businessId,
        clientId: client.id,
        serviceId,
        staffId,
        scheduledFor: new Date(scheduledFor),
        duration: service.duration,
        status: businessValidation.autoConfirm ? 'CONFIRMED' : 'PENDING',
        notes: notes || null
      },
      include: {
        Client: { select: { id: true, name: true, email: true } },
        Service: { select: { id: true, name: true, duration: true, price: true } },
        Staff: { select: { id: true, name: true } },
        Business: { select: { id: true, name: true } }
      }
    });

    console.log('[CLIENT_BOOKING] ✅ Appointment created:', appointment.id);

    return NextResponse.json({ 
      success: true, 
      data: {
        id: appointment.id,
        businessName: appointment.Business?.name,
        serviceName: appointment.Service?.name,
        staffName: appointment.Staff?.name,
        clientName: appointment.Client?.name,
        scheduledFor: appointment.scheduledFor,
        duration: appointment.duration,
        status: appointment.status,
        autoConfirmed: businessValidation.autoConfirm
      }
    });

  } catch (error) {
    console.error('[CLIENT_BOOKING] Error creating booking:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BOOKING_CREATE_ERROR', message: 'Falha ao criar agendamento' } },
      { status: 500 }
    );
  }
} 