import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[CUSTOMER_SERVICE_GET] Starting...');
    
    // Check authentication
    const user = getRequestAuthUser(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const serviceId = params.id;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Service ID é obrigatório' } },
        { status: 400 }
      );
    }

    console.log(`[CUSTOMER_SERVICE_GET] Fetching service: ${serviceId}`);

    // Fetch service data
    const service = await prisma.Service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        slotsNeeded: true,
        price: true,
        image: true,
        Business: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        service_categories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Serviço não encontrado' } },
        { status: 404 }
      );
    }

    console.log(`[CUSTOMER_SERVICE_GET] ✅ Service found: ${service.name}`);

    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        description: service.description,
        duration: service.duration,
        slotsNeeded: service.slotsNeeded || 1,
        price: service.price,
        image: service.image,
        business: service.Business,
        category: service.service_categories
      }
    });

  } catch (error) {
    console.error('[CUSTOMER_SERVICE_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
}