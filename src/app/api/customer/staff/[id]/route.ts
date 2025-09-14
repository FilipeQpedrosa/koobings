import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('[CUSTOMER_STAFF_GET] Starting...');
    
    // Check authentication
    const user = getRequestAuthUser(request);
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const staffId = params.id;

    if (!staffId) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Staff ID é obrigatório' } },
        { status: 400 }
      );
    }

    console.log(`[CUSTOMER_STAFF_GET] Fetching staff: ${staffId}`);

    // Fetch staff data
    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        Business: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        Services: {
          select: {
            id: true,
            name: true,
            duration: true,
            slotsNeeded: true,
            price: true
          }
        }
      }
    });

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Funcionário não encontrado' } },
        { status: 404 }
      );
    }

    console.log(`[CUSTOMER_STAFF_GET] ✅ Staff found: ${staff.name}`);

    return NextResponse.json({
      success: true,
      data: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        business: staff.Business,
        services: staff.Services
      }
    });

  } catch (error) {
    console.error('[CUSTOMER_STAFF_GET] Error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
}