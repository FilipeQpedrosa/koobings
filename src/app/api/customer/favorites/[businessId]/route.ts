import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// Check if business is favorited by customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;
    console.log(`🔍 [GET /api/customer/favorites/${businessId}] Checking favorite status`);
    
    const user = getRequestAuthUser(request);
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    // Check if favorite exists
    const favorite = await prisma.customerFavorite.findUnique({
      where: {
        customerId_businessId: {
          customerId: user.id,
          businessId: businessId
        }
      }
    });

    console.log(`✅ [GET /api/customer/favorites/${businessId}] Favorite status: ${favorite ? 'favorited' : 'not favorited'}`);

    return NextResponse.json({
      success: true,
      data: {
        businessId,
        isFavorite: !!favorite,
        favoriteId: favorite?.id || null,
        createdAt: favorite?.createdAt || null
      }
    });

  } catch (error) {
    console.error(`❌ [GET /api/customer/favorites/[businessId]] Error:`, error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
} 