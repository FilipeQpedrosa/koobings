import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';  // Use @/lib/jwt instead of jwt-safe
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔧 [DEBUG] PUT /admin/businesses/[id]/status called for business:', params.id);
    
    // Check JWT authentication
    const user = getRequestAuthUser(request);
    console.log('🔧 [DEBUG] Authentication result:', user ? { id: user.id, email: user.email, role: user.role, isAdmin: user.isAdmin } : 'No user found');
    
    if (!user) {
      console.log('❌ [DEBUG] No authenticated user found');
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'ADMIN') {
      console.log('❌ [DEBUG] User is not admin:', { role: user.role, isAdmin: user.isAdmin });
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 403 }
      );
    }

    console.log('✅ [DEBUG] Admin authentication successful');

    const body = await request.json();
    console.log('🔧 [DEBUG] Request body:', body);
    
    const { status } = statusUpdateSchema.parse(body);
    console.log('🔧 [DEBUG] Validated status:', status);

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, status: true }
    });

    if (!existingBusiness) {
      console.log('❌ [DEBUG] Business not found:', params.id);
      return NextResponse.json(
        { error: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    console.log('✅ [DEBUG] Business found:', existingBusiness);

    // Update business status
    const updatedBusiness = await prisma.business.update({
      where: { id: params.id },
      data: { status },
      select: {
        id: true,
        name: true,
        status: true,
        email: true,
        ownerName: true,
        type: true,  // Use 'type' instead of 'plan'
        createdAt: true,
        updatedAt: true,
        settings: true  // Use 'settings' instead of 'features'
      }
    });

    console.log(`✅ Business ${updatedBusiness.name} status changed from ${existingBusiness.status} to ${status}`);

    return NextResponse.json({
      message: `Status do negócio atualizado para ${status}`,
      business: updatedBusiness
    });

  } catch (error) {
    console.error('❌ Error updating business status:', error);
    console.error('❌ Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    if (error instanceof z.ZodError) {
      console.log('❌ [DEBUG] Zod validation error:', error.errors);
      return NextResponse.json(
        { error: 'Status inválido', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check JWT authentication
    const user = getRequestAuthUser(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!user.isAdmin || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado - apenas administradores do sistema' },
        { status: 403 }
      );
    }

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      select: { 
        id: true, 
        name: true
      }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

    // Delete business and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete appointments first (due to foreign key constraints)
      await tx.$executeRaw`DELETE FROM appointments WHERE "businessId" = ${params.id}`;

      // Delete staff
      await tx.staff.deleteMany({
        where: { businessId: params.id }
      });

      // Delete services
      await tx.service.deleteMany({
        where: { businessId: params.id }
      });

      // Delete clients
      await tx.client.deleteMany({
        where: { businessId: params.id }
      });

      // Delete business hours
      await tx.businessHours.deleteMany({
        where: { businessId: params.id }
      });

      // Delete service categories
      await tx.service_categories.deleteMany({
        where: { businessId: params.id }
      });

      // Finally delete the business
      await tx.business.delete({
        where: { id: params.id }
      });
    });

    console.log(`✅ Business ${existingBusiness.name} and all related data deleted`);

    return NextResponse.json({
      message: `Negócio "${existingBusiness.name}" foi eliminado com sucesso`
    });

  } catch (error) {
    console.error('❌ Error deleting business:', error);
    
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 