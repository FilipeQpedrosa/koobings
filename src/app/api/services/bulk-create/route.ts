import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/auth';
import { z } from 'zod';

/**
 * 🚀 BULK SERVICE CREATION API
 * 
 * Cria múltiplos serviços baseados em templates de slots.
 * Permite escalabilidade sem repetição manual.
 */

// POST: Criar serviços em massa baseados em templates
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const schema = z.object({
      templateIds: z.array(z.string()).min(1, 'Pelo menos um template é necessário'),
      basePrice: z.number().nonnegative().optional(), // Preço base para todos os serviços
      priceMultiplier: z.number().positive().optional(), // Multiplicador de preço baseado nos slots
      categoryId: z.string().optional(), // Categoria padrão
      staffIds: z.array(z.string()).optional(), // Staff que pode realizar os serviços
      location: z.string().optional(),
      address: z.string().optional(),
      maxCapacity: z.number().int().positive().optional(),
      availableDays: z.array(z.number().int().min(0).max(6)).optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      minAdvanceHours: z.number().int().positive().optional(),
      maxAdvanceDays: z.number().int().positive().optional(),
      anyTimeAvailable: z.boolean().optional()
    });

    const body = await request.json();
    const validatedData = schema.parse(body);

    console.log('🚀 [BULK_SERVICES] Creating services from templates:', {
      templateIds: validatedData.templateIds,
      businessId,
      basePrice: validatedData.basePrice
    });

    // Buscar templates
    const templates = await prisma.slotTemplate.findMany({
      where: {
        id: { in: validatedData.templateIds },
        OR: [
          { businessId },
          { businessId: null, isDefault: true }
        ],
        isActive: true
      }
    });

    if (templates.length !== validatedData.templateIds.length) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TEMPLATES', message: 'Some templates not found or not accessible' } },
        { status: 400 }
      );
    }

    // Buscar staff disponível
    let availableStaff: any[] = [];
    if (validatedData.staffIds && validatedData.staffIds.length > 0) {
      availableStaff = await prisma.staff.findMany({
        where: {
          id: { in: validatedData.staffIds },
          businessId
        }
      });
    } else {
      // Se não especificar staff, usar todos do business
      availableStaff = await prisma.staff.findMany({
        where: { businessId }
      });
    }

    if (availableStaff.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'NO_STAFF_AVAILABLE', message: 'No staff available for services' } },
        { status: 400 }
      );
    }

    // Criar serviços em transação
    const createdServices = [];
    
    for (const template of templates) {
      // Calcular preço baseado no template
      let servicePrice = validatedData.basePrice || 50; // Preço padrão
      
      if (validatedData.priceMultiplier) {
        servicePrice = servicePrice * validatedData.priceMultiplier * template.slotsNeeded;
      } else {
        // Preço baseado nos slots (mais slots = mais caro)
        servicePrice = servicePrice * template.slotsNeeded;
      }

      // Criar nome do serviço baseado no template
      const serviceName = template.name;
      const serviceDescription = template.description || `Serviço baseado no template ${template.name}`;

      console.log(`📝 [BULK_SERVICES] Creating service: ${serviceName} (${template.slotsNeeded} slots, ${servicePrice}€)`);

      const service = await prisma.service.create({
        data: {
          name: serviceName,
          description: serviceDescription,
          duration: template.duration,
          slotsNeeded: template.slotsNeeded,
          slotConfiguration: {
            templateId: template.id,
            templateName: template.name,
            createdAt: new Date().toISOString()
          },
          price: servicePrice,
          businessId,
          categoryId: validatedData.categoryId,
          location: validatedData.location,
          address: validatedData.address,
          maxCapacity: validatedData.maxCapacity || 1,
          availableDays: validatedData.availableDays || [],
          startTime: validatedData.startTime,
          endTime: validatedData.endTime,
          minAdvanceHours: validatedData.minAdvanceHours || 24,
          maxAdvanceDays: validatedData.maxAdvanceDays || 30,
          anyTimeAvailable: validatedData.anyTimeAvailable || false,
          slots: {} // Slots serão configurados posteriormente
        }
      });

      // Associar staff ao serviço
      if (availableStaff.length > 0) {
        await prisma.service.update({
          where: { id: service.id },
          data: {
            Staff: {
              connect: availableStaff.map(staff => ({ id: staff.id }))
            }
          }
        });
      }

      createdServices.push({
        id: service.id,
        name: service.name,
        slotsNeeded: service.slotsNeeded,
        duration: service.duration,
        price: service.price,
        templateId: template.id,
        templateName: template.name
      });
    }

    console.log(`✅ [BULK_SERVICES] Created ${createdServices.length} services successfully`);

    return NextResponse.json({
      success: true,
      data: {
        services: createdServices,
        totalCreated: createdServices.length,
        staffAssigned: availableStaff.length
      },
      message: `${createdServices.length} serviços criados com sucesso baseados nos templates`
    });

  } catch (error) {
    console.error('❌ [BULK_SERVICES] Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation error', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// GET: Listar serviços criados por templates
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('templateId');
    const category = searchParams.get('category');

    // Construir filtros
    const where: any = {
      businessId,
      slotConfiguration: {
        path: ['templateId'],
        not: null
      }
    };

    if (templateId) {
      where.slotConfiguration = {
        path: ['templateId'],
        equals: templateId
      };
    }

    if (category) {
      where.service_categories = {
        name: category
      };
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        service_categories: {
          select: { name: true }
        },
        Staff: {
          select: { id: true, name: true }
        },
        _count: {
          select: { appointments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ [BULK_SERVICES] Found ${services.length} template-based services`);

    return NextResponse.json({
      success: true,
      data: services,
      meta: {
        total: services.length,
        templatesUsed: [...new Set(services.map(s => s.slotConfiguration?.templateId).filter(Boolean))]
      }
    });

  } catch (error) {
    console.error('❌ [BULK_SERVICES] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
