import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

// GET /api/client/payment-methods - Get client payment methods
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    // Find client by email to get clientId
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    const paymentMethods = await prisma.payment_methods.findMany({
      where: {
        clientId: client.id,
        isActive: true,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: paymentMethods });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PAYMENT_METHODS_FETCH_ERROR', message: 'Falha ao carregar métodos de pagamento' } },
      { status: 500 }
    );
  }
}

// POST /api/client/payment-methods - Add new payment method
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, cardNumber, expiryDate, isDefault } = body;

    // Validate required fields
    if (!type || !cardNumber || !expiryDate) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Dados obrigatórios em falta' } },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await prisma.independentClient.findFirst({
      where: { email: user.email },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.payment_methods.updateMany({
        where: {
          clientId: client.id,
          isActive: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const paymentMethod = await prisma.payment_methods.create({
      data: {
        clientId: client.id,
        type,
        cardNumber: cardNumber.slice(-4), // Store only last 4 digits
        expiryDate,
        isDefault: isDefault || false,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: paymentMethod });
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PAYMENT_METHOD_CREATE_ERROR', message: 'Falha ao adicionar método de pagamento' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/payment-methods - Update payment method
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethodId, isDefault, isActive } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { success: false, error: { code: 'PAYMENT_METHOD_ID_REQUIRED', message: 'Payment method ID is required' } },
        { status: 400 }
      );
    }

    // Verify payment method belongs to client
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        clientId: session.user.id,
      },
    });

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { success: false, error: { code: 'PAYMENT_METHOD_NOT_FOUND', message: 'Payment method not found' } },
        { status: 404 }
      );
    }

    // If setting as default, update all other payment methods
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          clientId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: {
        id: paymentMethodId,
      },
      data: {
        isDefault: isDefault ?? existingPaymentMethod.isDefault,
        isActive: isActive ?? existingPaymentMethod.isActive,
      },
    });

    return NextResponse.json({ success: true, data: paymentMethod });
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PAYMENT_METHOD_UPDATE_ERROR', message: 'Failed to update payment method' } },
      { status: 500 }
    );
  }
} 