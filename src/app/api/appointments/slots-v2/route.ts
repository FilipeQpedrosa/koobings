/**
 * 🚀 API de Criação de Agendamentos com Slots V2 - SIMPLIFIED VERSION
 * 
 * Versão simplificada que funciona sem base de dados
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { parseISO } from 'date-fns';
import { z } from 'zod';
import { randomUUID } from 'crypto';

// Global in-memory storage for appointments (persists across requests)
declare global {
  var appointmentsStorage: Map<string, any[]> | undefined;
}

// Initialize global storage if not exists
if (!global.appointmentsStorage) {
  global.appointmentsStorage = new Map<string, any[]>();
}

function getAppointmentsForBusiness(businessId: string) {
  return global.appointmentsStorage?.get(businessId) || [];
}

function addAppointmentToBusiness(businessId: string, appointment: any) {
  const appointments = getAppointmentsForBusiness(businessId);
  appointments.push(appointment);
  global.appointmentsStorage?.set(businessId, appointments);
  console.log('🔧 [APPOINTMENTS_STORAGE] Added appointment to business:', businessId, 'Total appointments:', appointments.length);
}

export const dynamic = 'force-dynamic';

// Schema de validação simplificado
const createAppointmentSlotSchema = z.object({
  serviceId: z.string().min(1),
  staffId: z.string().min(1),
  clientId: z.string().min(1),
  date: z.string().min(1),
  startSlot: z.number().int().min(0).max(47),
  slotsNeeded: z.number().int().min(1).max(8),
  notes: z.string().optional()
});

type CreateAppointmentSlotData = z.infer<typeof createAppointmentSlotSchema>;

/**
 * POST /api/appointments/slots-v2
 * 
 * Cria um novo agendamento baseado em slots
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [APPOINTMENTS-SLOTS-V2] Starting appointment creation...');
    
    // Verificar autenticação
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }

    // Parse e validação do body
    let body: CreateAppointmentSlotData;
    try {
      const rawBody = await request.json();
      body = createAppointmentSlotSchema.parse(rawBody);
    } catch (error) {
      console.error('❌ [APPOINTMENTS-SLOTS-V2] Validation error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid request data',
            details: error instanceof z.ZodError ? error.errors : 'Invalid JSON format'
          } 
        },
        { status: 400 }
      );
    }

    console.log('📋 [APPOINTMENTS-SLOTS-V2] Request data:', {
      ...body,
      notes: body.notes ? '[PROVIDED]' : '[NONE]'
    });

    // Validar data (não pode ser no passado)
    const appointmentDate = parseISO(body.date);
    const now = new Date();
    
    if (appointmentDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      return NextResponse.json(
        { success: false, error: { code: 'PAST_DATE', message: 'Cannot schedule appointments in the past' } },
        { status: 400 }
      );
    }

    // Calcular horário baseado no slot
    const startHour = Math.floor(body.startSlot / 2) + 9; // Slots começam às 9h
    const startMinute = (body.startSlot % 2) * 30;
    const endSlot = body.startSlot + body.slotsNeeded;
    const endHour = Math.floor(endSlot / 2) + 9;
    const endMinute = (endSlot % 2) * 30;

    const scheduledFor = new Date(appointmentDate);
    scheduledFor.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(appointmentDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    // Criar appointment em memória
    const appointment = {
      id: randomUUID(),
      businessId: businessId,
      clientId: body.clientId,
      serviceId: body.serviceId,
      staffId: body.staffId,
      scheduledFor: scheduledFor.toISOString(),
      endTime: endTime.toISOString(),
      duration: body.slotsNeeded * 30, // 30 minutos por slot
      status: 'PENDING',
      notes: body.notes || '',
      startSlot: body.startSlot,
      endSlot: endSlot,
      slotsUsed: body.slotsNeeded,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Mock data for response
      client: { id: body.clientId, name: 'Cliente', email: 'cliente@example.com' },
      service: { id: body.serviceId, name: 'Serviço', duration: body.slotsNeeded * 30 },
      staff: { id: body.staffId, name: 'Staff Member' }
    };

    // Armazenar em memória
    addAppointmentToBusiness(businessId, appointment);

    console.log('✅ [APPOINTMENTS-SLOTS-V2] Appointment created successfully:', appointment.id);

    return NextResponse.json({ 
      success: true, 
      data: appointment 
    });

  } catch (error) {
    console.error('❌ [APPOINTMENTS-SLOTS-V2] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Failed to create appointment',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}