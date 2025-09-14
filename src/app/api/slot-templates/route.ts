import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/auth';
import { z } from 'zod';

/**
 * 🎯 SLOT TEMPLATES API
 * 
 * Gerencia templates de slots reutilizáveis para criação rápida de serviços.
 * Permite escalabilidade sem repetição manual.
 */

// GET: Listar templates disponíveis
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const businessId = searchParams.get('businessId');
    const includeGlobal = searchParams.get('includeGlobal') === 'true';

    console.log('🔍 [SLOT_TEMPLATES] Fetching templates:', { category, businessId, includeGlobal });

    // Construir filtros
    const where: any = {
      isActive: true
    };

    // Se não especificar businessId, usar o do usuário
    const targetBusinessId = businessId || user.businessId;

    if (targetBusinessId) {
      // Templates específicos do business OU templates globais
      where.OR = [
        { businessId: targetBusinessId },
        ...(includeGlobal ? [{ businessId: null, isDefault: true }] : [])
      ];
    } else if (includeGlobal) {
      // Apenas templates globais
      where.businessId = null;
      where.isDefault = true;
    }

    // Filtro por categoria
    if (category) {
      where.category = category;
    }

    const templates = await prisma.slotTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' }, // Templates padrão primeiro
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`✅ [SLOT_TEMPLATES] Found ${templates.length} templates`);

    return NextResponse.json({
      success: true,
      data: templates,
      meta: {
        total: templates.length,
        categories: [...new Set(templates.map(t => t.category).filter(Boolean))]
      }
    });

  } catch (error) {
    console.error('❌ [SLOT_TEMPLATES] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

// POST: Criar novo template
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
      name: z.string().min(1, 'Nome é obrigatório'),
      description: z.string().optional(),
      slotsNeeded: z.number().int().positive('Slots necessários deve ser positivo'),
      category: z.string().optional(),
      metadata: z.object({
        color: z.string().optional(),
        icon: z.string().optional(),
        popular: z.boolean().optional()
      }).optional()
    });

    const body = await request.json();
    const validatedData = schema.parse(body);

    // Calcular duração automaticamente (slots × 30 minutos)
    const duration = validatedData.slotsNeeded * 30;

    console.log('📝 [SLOT_TEMPLATES] Creating template:', {
      name: validatedData.name,
      slotsNeeded: validatedData.slotsNeeded,
      duration,
      businessId
    });

    const template = await prisma.slotTemplate.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slotsNeeded: validatedData.slotsNeeded,
        duration,
        category: validatedData.category,
        businessId,
        isDefault: false, // Templates criados pelo usuário não são padrão
        isActive: true,
        metadata: validatedData.metadata
      }
    });

    console.log('✅ [SLOT_TEMPLATES] Template created:', template.id);

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('❌ [SLOT_TEMPLATES] Error:', error);
    
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

// PUT: Atualizar template
export async function PUT(request: NextRequest) {
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
      id: z.string().min(1, 'ID é obrigatório'),
      name: z.string().min(1, 'Nome é obrigatório').optional(),
      description: z.string().optional(),
      slotsNeeded: z.number().int().positive('Slots necessários deve ser positivo').optional(),
      category: z.string().optional(),
      isActive: z.boolean().optional(),
      metadata: z.object({
        color: z.string().optional(),
        icon: z.string().optional(),
        popular: z.boolean().optional()
      }).optional()
    });

    const body = await request.json();
    const validatedData = schema.parse(body);

    // Verificar se o template pertence ao business do usuário
    const existingTemplate = await prisma.slotTemplate.findFirst({
      where: {
        id: validatedData.id,
        businessId
      }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: { code: 'TEMPLATE_NOT_FOUND', message: 'Template not found or access denied' } },
        { status: 404 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      updatedAt: new Date()
    };

    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.isActive !== undefined) updateData.isActive = validatedData.isActive;
    if (validatedData.metadata !== undefined) updateData.metadata = validatedData.metadata;

    // Se slotsNeeded mudou, recalcular duração
    if (validatedData.slotsNeeded !== undefined) {
      updateData.slotsNeeded = validatedData.slotsNeeded;
      updateData.duration = validatedData.slotsNeeded * 30;
    }

    console.log('📝 [SLOT_TEMPLATES] Updating template:', validatedData.id);

    const template = await prisma.slotTemplate.update({
      where: { id: validatedData.id },
      data: updateData
    });

    console.log('✅ [SLOT_TEMPLATES] Template updated:', template.id);

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('❌ [SLOT_TEMPLATES] Error:', error);
    
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

// DELETE: Deletar template
export async function DELETE(request: NextRequest) {
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
    const templateId = searchParams.get('id');

    if (!templateId) {
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_TEMPLATE_ID', message: 'Template ID is required' } },
        { status: 400 }
      );
    }

    // Verificar se o template pertence ao business do usuário
    const existingTemplate = await prisma.slotTemplate.findFirst({
      where: {
        id: templateId,
        businessId
      }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { success: false, error: { code: 'TEMPLATE_NOT_FOUND', message: 'Template not found or access denied' } },
        { status: 404 }
      );
    }

    // Não permitir deletar templates padrão do sistema
    if (existingTemplate.isDefault) {
      return NextResponse.json(
        { success: false, error: { code: 'CANNOT_DELETE_DEFAULT', message: 'Cannot delete default templates' } },
        { status: 400 }
      );
    }

    console.log('🗑️ [SLOT_TEMPLATES] Deleting template:', templateId);

    await prisma.slotTemplate.delete({
      where: { id: templateId }
    });

    console.log('✅ [SLOT_TEMPLATES] Template deleted:', templateId);

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('❌ [SLOT_TEMPLATES] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
