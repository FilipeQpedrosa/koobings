/**
 * 🎛️ API de Configuração de Slots para Admin
 * 
 * Permite que admins configurem o sistema de slots para seus negócios
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getDefaultBusinessSlotConfig } from '@/lib/slot-manager';

export const dynamic = 'force-dynamic';

// Schema de validação para configuração de slots
const slotConfigurationSchema = z.object({
  businessId: z.string().uuid().optional(), // Opcional para admins
  slotDurationMinutes: z.number().int().min(15).max(120).default(30),
  slotsPerDay: z.number().int().min(24).max(96).default(48),
  startHour: z.number().int().min(0).max(23).default(0),
  endHour: z.number().int().min(1).max(24).default(24),
  timeZone: z.string().default('UTC'),
  workingHours: z.object({
    start: z.number().int().min(0).max(47),
    end: z.number().int().min(1).max(48)
  }).optional(),
  customConfiguration: z.record(z.any()).optional()
});

type SlotConfigurationData = z.infer<typeof slotConfigurationSchema>;

/**
 * GET /api/admin/slot-configuration
 * 
 * Obtém configuração de slots atual para o negócio
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🎛️ [SLOT-CONFIG] Getting slot configuration...');
    
    // Verificar autenticação admin
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId') || user.businessId;

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }

    // Buscar configuração existente
    const existingConfig = await prisma.businessSlotConfiguration.findUnique({
      where: { businessId },
      include: {
        Business: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (existingConfig) {
      console.log('✅ [SLOT-CONFIG] Found existing configuration');
      return NextResponse.json({
        success: true,
        data: {
          configuration: {
            id: existingConfig.id,
            businessId: existingConfig.businessId,
            slotDurationMinutes: existingConfig.slotDurationMinutes,
            slotsPerDay: existingConfig.slotsPerDay,
            startHour: existingConfig.startHour,
            endHour: existingConfig.endHour,
            timeZone: existingConfig.timeZone,
            slotConfiguration: existingConfig.slotConfiguration,
            createdAt: existingConfig.createdAt,
            updatedAt: existingConfig.updatedAt
          },
          business: existingConfig.Business,
          isDefault: false
        }
      });
    } else {
      // Retornar configuração padrão
      console.log('📋 [SLOT-CONFIG] Returning default configuration');
      const defaultConfig = getDefaultBusinessSlotConfig();
      
      return NextResponse.json({
        success: true,
        data: {
          configuration: {
            ...defaultConfig,
            businessId,
            id: null
          },
          business: null,
          isDefault: true,
          message: 'Using default configuration. Save to customize.'
        }
      });
    }

  } catch (error) {
    console.error('❌ [SLOT-CONFIG] GET Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/slot-configuration
 * 
 * Cria ou atualiza configuração de slots para o negócio
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🎛️ [SLOT-CONFIG] Creating/updating slot configuration...');
    
    // Verificar autenticação admin
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    // Parse e validação do body
    let configData: SlotConfigurationData;
    try {
      const rawBody = await request.json();
      configData = slotConfigurationSchema.parse(rawBody);
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid configuration data',
            details: error instanceof z.ZodError ? error.errors : 'Invalid JSON format'
          } 
        },
        { status: 400 }
      );
    }

    const businessId = configData.businessId || user.businessId;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }

    console.log('📋 [SLOT-CONFIG] Configuration data:', configData);

    // Verificar se negócio existe
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Validações específicas
    if (configData.startHour >= configData.endHour) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_HOURS', message: 'Start hour must be less than end hour' } },
        { status: 400 }
      );
    }

    if (configData.workingHours && configData.workingHours.start >= configData.workingHours.end) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_WORKING_HOURS', message: 'Working hours start must be less than end' } },
        { status: 400 }
      );
    }

    // Preparar dados de configuração avançada
    const slotConfiguration = {
      ...configData.customConfiguration,
      workingHours: configData.workingHours || {
        start: 18, // 09:00
        end: 36    // 18:00
      },
      lastUpdatedBy: user.id,
      lastUpdatedAt: new Date().toISOString(),
      version: 'v2'
    };

    // Upsert configuração
    const savedConfig = await prisma.businessSlotConfiguration.upsert({
      where: { businessId },
      create: {
        id: randomUUID(),
        businessId,
        slotDurationMinutes: configData.slotDurationMinutes,
        slotsPerDay: configData.slotsPerDay,
        startHour: configData.startHour,
        endHour: configData.endHour,
        timeZone: configData.timeZone,
        slotConfiguration
      },
      update: {
        slotDurationMinutes: configData.slotDurationMinutes,
        slotsPerDay: configData.slotsPerDay,
        startHour: configData.startHour,
        endHour: configData.endHour,
        timeZone: configData.timeZone,
        slotConfiguration,
        updatedAt: new Date()
      },
      include: {
        Business: {
          select: { name: true, slug: true }
        }
      }
    });

    console.log('✅ [SLOT-CONFIG] Configuration saved:', savedConfig.id);

    return NextResponse.json({
      success: true,
      data: {
        configuration: {
          id: savedConfig.id,
          businessId: savedConfig.businessId,
          slotDurationMinutes: savedConfig.slotDurationMinutes,
          slotsPerDay: savedConfig.slotsPerDay,
          startHour: savedConfig.startHour,
          endHour: savedConfig.endHour,
          timeZone: savedConfig.timeZone,
          slotConfiguration: savedConfig.slotConfiguration,
          createdAt: savedConfig.createdAt,
          updatedAt: savedConfig.updatedAt
        },
        business: savedConfig.Business,
        message: 'Slot configuration saved successfully'
      }
    }, { status: 201 });

  } catch (error) {
    console.error('❌ [SLOT-CONFIG] POST Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/slot-configuration
 * 
 * Remove configuração customizada (volta para padrão)
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ [SLOT-CONFIG] Deleting slot configuration...');
    
    // Verificar autenticação admin
    const user = getRequestAuthUser(request);
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Admin access required' } },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId') || user.businessId;

    if (!businessId) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_REQUIRED', message: 'Business ID is required' } },
        { status: 400 }
      );
    }

    // Verificar se configuração existe
    const existingConfig = await prisma.businessSlotConfiguration.findUnique({
      where: { businessId }
    });

    if (!existingConfig) {
      return NextResponse.json(
        { success: false, error: { code: 'CONFIG_NOT_FOUND', message: 'Configuration not found' } },
        { status: 404 }
      );
    }

    // Deletar configuração
    await prisma.businessSlotConfiguration.delete({
      where: { businessId }
    });

    console.log('✅ [SLOT-CONFIG] Configuration deleted');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Slot configuration deleted. Default configuration will be used.',
        deletedConfigId: existingConfig.id,
        businessId
      }
    });

  } catch (error) {
    console.error('❌ [SLOT-CONFIG] DELETE Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error'
        } 
      },
      { status: 500 }
    );
  }
}
