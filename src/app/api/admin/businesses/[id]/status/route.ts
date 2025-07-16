import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const statusUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INACTIVE']),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json();
    const { status } = statusUpdateSchema.parse(body);

    // Check if business exists
    const existingBusiness = await prisma.business.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, status: true }
    });

    if (!existingBusiness) {
      return NextResponse.json(
        { error: 'Negócio não encontrado' },
        { status: 404 }
      );
    }

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
        // slug: true, // COMMENTED - column does not exist in current database
        plan: true,
        createdAt: true,
        updatedAt: true,
        features: true
      }
    });

    console.log(`✅ Business ${updatedBusiness.name} status changed from ${existingBusiness.status} to ${status}`);

    return NextResponse.json({
      message: `Status do negócio atualizado para ${status}`,
      business: updatedBusiness
    });

  } catch (error) {
    console.error('❌ Error updating business status:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
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