/**
 * 🎯 API de Disponibilidade de Slots V2 - SIMPLIFIED VERSION
 * 
 * Versão simplificada que funciona sem base de dados
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { parseISO, format } from 'date-fns';

// Global in-memory storage for services (persists across requests)
declare global {
  var servicesStorage: Map<string, any[]> | undefined;
}

// Initialize global storage if not exists
if (!global.servicesStorage) {
  global.servicesStorage = new Map<string, any[]>();
}

function getServicesForBusiness(businessId: string) {
  return global.servicesStorage?.get(businessId) || [];
}

export const dynamic = 'force-dynamic';

/**
 * GET /api/availability/slots-v2
 * 
 * Retorna disponibilidade de slots para um serviço e data específicos
 * 
 * Query params:
 * - serviceId: ID do serviço
 * - date: Data no formato YYYY-MM-DD  
 * - staffId: (opcional) ID do staff específico
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🎯 [SLOTS-V2] Starting slot availability check...');
    
    // Verificar autenticação
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Extrair parâmetros
    const searchParams = request.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date');
    const staffId = searchParams.get('staffId');

    if (!serviceId || !dateStr) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_PARAMS', message: 'serviceId and date are required' } },
        { status: 400 }
      );
    }

    console.log('📋 [SLOTS-V2] Request params:', { serviceId, dateStr, staffId });

    // Validar formato da data
    let requestDate: Date;
    try {
      requestDate = parseISO(dateStr);
      if (isNaN(requestDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (error) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_DATE', message: 'Invalid date format. Use YYYY-MM-DD' } },
        { status: 400 }
      );
    }

    // Use database to fetch service (WORKING!)
    console.log('🔍 [SLOTS-V2] Fetching service from database...');
    
    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }
    
    // Fetch service from database
    const service = await prisma.service.findUnique({
      where: { 
        id: serviceId,
        businessId: businessId
      }
    });
    
    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    console.log('✅ [SLOTS-V2] Service found:', {
      id: service.id,
      name: service.name,
      duration: service.duration,
      slotsNeeded: service.slotsNeeded || Math.ceil(service.duration / 30)
    });

    // Determinar slots necessários
    const slotsNeeded = service.slotsNeeded || Math.ceil(service.duration / 30);
    
    // Generate all day slots (9 AM to 6 PM)
    const allDaySlots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotIndex = (hour - 9) * 2 + (minute / 30);
        
        allDaySlots.push({
          slotIndex,
          time,
          isAvailable: true,
          isOccupied: false,
          canStartService: true,
          reason: 'Disponível'
        });
      }
    }

    console.log('📅 [SLOTS-V2] Generated day slots:', allDaySlots.length);

    // Simplified response
    const response = {
      success: true,
      data: {
        serviceName: service.name,
        serviceId: service.id,
        slotsNeeded,
        duration: service.duration,
        date: dateStr,
        availableSlots: allDaySlots,
        staffAvailability: [
          {
            staffId: staffId || 'default-staff',
            staffName: 'Staff Member',
            availableSlots: allDaySlots
          }
        ]
      }
    };

    console.log('✅ [SLOTS-V2] Returning simplified response with', allDaySlots.length, 'slots');
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [SLOTS-V2] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'SLOTS_FETCH_ERROR', 
          message: 'Failed to fetch time slots',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}