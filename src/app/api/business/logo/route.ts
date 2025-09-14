import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const updateLogoSchema = z.object({
  logoUrl: z.string().url('URL inválido')
});

// PATCH /api/business/logo - Update business logo
export async function PATCH(request: NextRequest) {
  try {
    console.log('[BUSINESS_LOGO] 🖼️ Updating business logo...');
    
    const user = getRequestAuthUser(request);
    
    if (!user?.businessId) {
      console.log('❌ [BUSINESS_LOGO] No businessId found for user');
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - no business ID' 
      }, { status: 401 });
    }

    if (user.staffRole !== 'ADMIN' && user.role !== 'BUSINESS_OWNER' && !user.isAdmin) {
      console.log('❌ [BUSINESS_LOGO] User not authorized:', user.role, user.staffRole);
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - insufficient permissions' 
      }, { status: 401 });
    }

    const body = await request.json();
    console.log('[BUSINESS_LOGO] 📝 Request body:', body);
    
    const validatedData = updateLogoSchema.parse(body);
    console.log('[BUSINESS_LOGO] ✅ Validated data:', validatedData);

    const updatedBusiness = await prisma.business.update({
      where: { id: user.businessId },
      data: { 
        logo: validatedData.logoUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        logo: true,
        updatedAt: true
      }
    });

    console.log('[BUSINESS_LOGO] ✅ Business logo updated successfully:', {
      businessId: updatedBusiness.id,
      businessName: updatedBusiness.name,
      newLogo: updatedBusiness.logo
    });

    const response = NextResponse.json({ 
      success: true, 
      data: updatedBusiness,
      message: 'Logo atualizado com sucesso'
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('[BUSINESS_LOGO] ❌ Error updating logo:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos',
        details: error.errors
      }, { status: 400 });
    }
    
    const response = NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
}

// GET /api/business/logo - Get current business logo
export async function GET(request: NextRequest) {
  try {
    console.log('[BUSINESS_LOGO] 🔍 Getting business logo...');
    
    const user = getRequestAuthUser(request);
    
    if (!user?.businessId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { id: user.businessId },
      select: {
        id: true,
        name: true,
        logo: true
      }
    });

    if (!business) {
      return NextResponse.json({ 
        success: false, 
        error: 'Business not found' 
      }, { status: 404 });
    }

    const response = NextResponse.json({ 
      success: true, 
      data: {
        logo: business.logo,
        businessId: business.id,
        businessName: business.name
      }
    });

    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;

  } catch (error) {
    console.error('[BUSINESS_LOGO] ❌ Error getting logo:', error);
    
    const response = NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
    
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
} 