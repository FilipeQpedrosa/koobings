import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

interface FavoriteWithBusiness {
  id: string;
  businessId: string;
  createdAt: Date;
  business: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    logo: string | null;
    address: string | null;
    phone: string | null;
    type: string;
    Service: Array<{
      id: string;
      name: string;
      price: number;
      duration: number;
    }>;
  } | null;
}

// Get customer favorites
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [GET /api/customer/favorites] Getting customer favorites');
    
    const user = getRequestAuthUser(request);
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    // Get customer with favorites
    const customer = await prisma.customer.findUnique({
      where: { id: user.id },
      include: {
        favorites: true
      }
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    // Get business data for each favorite
    const businessIds = customer.favorites.map((fav: any) => fav.businessId);
    const businesses = await prisma.business.findMany({
      where: {
        id: { in: businessIds },
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logo: true,
        address: true,
        phone: true,
        type: true,
        Service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          },
          take: 3 // Just show a few services
        }
      }
    });

    // Combine favorites with business data
    const favoritesWithBusinessData: FavoriteWithBusiness[] = customer.favorites.map((favorite: any) => {
      const business = businesses.find((b: any) => b.id === favorite.businessId);
      return {
        id: favorite.id,
        businessId: favorite.businessId,
        createdAt: favorite.createdAt,
        business: business || null
      };
    }).filter((fav: FavoriteWithBusiness) => fav.business !== null); // Remove favorites for inactive businesses

    console.log(`✅ [GET /api/customer/favorites] Found ${favoritesWithBusinessData.length} favorites`);

    return NextResponse.json({
      success: true,
      data: favoritesWithBusinessData
    });

  } catch (error) {
    console.error('❌ [GET /api/customer/favorites] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
}

// Add or remove favorite
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 [POST /api/customer/favorites] Managing favorite');
    
    const user = getRequestAuthUser(request);
    
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const bodySchema = z.object({
      businessId: z.string().min(1, 'Business ID é obrigatório'),
      action: z.enum(['add', 'remove'], { required_error: 'Ação é obrigatória' })
    });

    const body = await request.json();
    const validatedData = bodySchema.parse(body);

    console.log(`🔍 [POST /api/customer/favorites] ${validatedData.action} favorite for business: ${validatedData.businessId}`);

    // Verify business exists and is active
    const business = await prisma.business.findUnique({
      where: { 
        id: validatedData.businessId,
        status: 'ACTIVE'
      },
      select: { id: true, name: true }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Negócio não encontrado ou inativo' } },
        { status: 404 }
      );
    }

    if (validatedData.action === 'add') {
      // Add to favorites (ignore if already exists)
      const favorite = await prisma.customerFavorite.upsert({
        where: {
          customerId_businessId: {
            customerId: user.id,
            businessId: validatedData.businessId
          }
        },
        update: {}, // No update needed
        create: {
          customerId: user.id,
          businessId: validatedData.businessId
        }
      });

      console.log(`✅ [POST /api/customer/favorites] Added favorite: ${favorite.id}`);

      return NextResponse.json({
        success: true,
        data: {
          action: 'added',
          favorite: {
            id: favorite.id,
            businessId: favorite.businessId,
            businessName: business.name,
            createdAt: favorite.createdAt
          }
        }
      });

    } else {
      // Remove from favorites
      const deletedFavorite = await prisma.customerFavorite.deleteMany({
        where: {
          customerId: user.id,
          businessId: validatedData.businessId
        }
      });

      console.log(`✅ [POST /api/customer/favorites] Removed favorite, deleted count: ${deletedFavorite.count}`);

      return NextResponse.json({
        success: true,
        data: {
          action: 'removed',
          deletedCount: deletedFavorite.count
        }
      });
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Dados inválidos', details: error.errors } },
        { status: 400 }
      );
    }

    console.error('❌ [POST /api/customer/favorites] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
} 