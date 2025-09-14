import { NextRequest, NextResponse } from 'next/server';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { logSecurityEvent } from '@/lib/security-monitoring';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Valid business types (matching Prisma enum)
const VALID_BUSINESS_TYPES = [
  'HAIR_SALON',
  'BARBERSHOP', 
  'NAIL_SALON',
  'PHYSIOTHERAPY',
  'PSYCHOLOGY',
  'OTHER'
] as const;

type BusinessType = typeof VALID_BUSINESS_TYPES[number];

const updateCategorySchema = z.object({
  type: z.enum(VALID_BUSINESS_TYPES),
  reason: z.string().optional()
});

// PUT /api/admin/businesses/[id]/category - Update business category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[BUSINESS_CATEGORY] 🏷️ Admin updating business category...');

    // 🔒 ULTRA-SECURE: Verify admin session
    const session = verifyUltraSecureSessionV2(request);
    if (!session || session.role !== 'ADMIN') {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'HIGH', {
        reason: 'Non-admin attempting to update business category',
        businessId: params.id
      });
      
      const response = NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Acesso apenas para administradores' },
        { status: 403 }
      );
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    const businessId = params.id;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'BUSINESS_ID_REQUIRED', message: 'ID do negócio é obrigatório' },
        { status: 400 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = updateCategorySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'INVALID_DATA', 
          message: 'Tipo de negócio inválido',
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }

    const { type, reason } = validationResult.data;

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: businessId },
      select: { 
        id: true, 
        name: true, 
        type: true, 
        email: true 
      }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { success: false, error: 'BUSINESS_NOT_FOUND', message: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    const previousType = existingBusiness.type;

    // Update business category
    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: { 
        type: type as any,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        type: true,
        email: true,
        updatedAt: true
      }
    });

    console.log(`[BUSINESS_CATEGORY] ✅ Category updated: ${existingBusiness.name} (${previousType} → ${type}) by ${session.email}`);

    // Log security event
    logSecurityEvent('LOGIN_SUCCESS', request, 'MEDIUM', {
      action: 'UPDATE_BUSINESS_CATEGORY',
      businessId,
      businessName: existingBusiness.name,
      previousType,
      newType: type,
      adminEmail: session.email,
      reason: reason || 'No reason provided'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Categoria do negócio atualizada com sucesso',
      data: {
        business: updatedBusiness,
        change: {
          from: previousType,
          to: type,
          updatedBy: session.email,
          updatedAt: updatedBusiness.updatedAt,
          reason
        }
      },
      timestamp: new Date().toISOString()
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;

  } catch (error) {
    console.error('[BUSINESS_CATEGORY] ❌ Error updating business category:', error);
    
    const response = NextResponse.json(
      { success: false, error: 'CATEGORY_UPDATE_ERROR', message: 'Erro ao atualizar categoria do negócio' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
}

// GET /api/admin/businesses/[id]/category - Get business category info
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[BUSINESS_CATEGORY] 📋 Admin fetching business category info...');

    // 🔒 ULTRA-SECURE: Verify admin session
    const session = verifyUltraSecureSessionV2(request);
    if (!session || session.role !== 'ADMIN') {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'HIGH', {
        reason: 'Non-admin accessing business category info',
        businessId: params.id
      });
      
      const response = NextResponse.json(
        { success: false, error: 'ADMIN_ACCESS_REQUIRED', message: 'Acesso apenas para administradores' },
        { status: 403 }
      );
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    const businessId = params.id;
    if (!businessId) {
      return NextResponse.json(
        { success: false, error: 'BUSINESS_ID_REQUIRED', message: 'ID do negócio é obrigatório' },
        { status: 400 }
      );
    }

    // Get business with category info
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        type: true,
        email: true,
        phone: true,
        description: true,
        logo: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: 'BUSINESS_NOT_FOUND', message: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    console.log(`[BUSINESS_CATEGORY] ✅ Category info retrieved: ${business.name} (${business.type}) by ${session.email}`);

    const response = NextResponse.json({
      success: true,
      data: {
        business,
        availableTypes: VALID_BUSINESS_TYPES
      },
      message: 'Informações da categoria carregadas com sucesso',
      timestamp: new Date().toISOString()
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;

  } catch (error) {
    console.error('[BUSINESS_CATEGORY] ❌ Error fetching business category:', error);
    
    const response = NextResponse.json(
      { success: false, error: 'CATEGORY_FETCH_ERROR', message: 'Erro ao carregar informações da categoria' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
} 