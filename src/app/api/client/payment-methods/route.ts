import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/client/payment-methods - Get client payment methods
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        patientId: session.user.id,
        isActive: true,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}

// POST /api/client/payment-methods - Add new payment method
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, details, isDefault } = body;

    if (!type || !details) {
      return NextResponse.json(
        { error: 'Payment method type and details are required' },
        { status: 400 }
      );
    }

    // If this is the first payment method or isDefault is true,
    // update all other payment methods to not be default
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          patientId: session.user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        patientId: session.user.id,
        type,
        details,
        isDefault: isDefault || false,
        isActive: true,
      },
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error adding payment method:', error);
    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    );
  }
}

// PATCH /api/client/payment-methods - Update payment method
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { paymentMethodId, isDefault, isActive } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Verify payment method belongs to client
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        patientId: session.user.id,
      },
    });

    if (!existingPaymentMethod) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      );
    }

    // If setting as default, update all other payment methods
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          patientId: session.user.id,
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

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
} 