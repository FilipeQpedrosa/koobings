import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';

// GET /api/business/payments/history
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // 'pending', 'completed', 'failed'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // For now, we'll simulate payment history since we don't have a payments table yet
    // In production, you'd query your actual payments table
    const mockPayments = await generateMockPaymentHistory(user.businessId, {
      limit,
      offset,
      status,
      startDate,
      endDate
    });

    return NextResponse.json({
      success: true,
      data: {
        payments: mockPayments,
        pagination: {
          total: mockPayments.length,
          limit,
          offset,
          hasMore: mockPayments.length === limit
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching payment history:', error);
    return NextResponse.json({
      error: 'Failed to fetch payment history'
    }, { status: 500 });
  }
}

// POST /api/business/payments/history
export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    if (!user?.businessId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId, amount, description, paymentMethod } = await request.json();

    if (!appointmentId || !amount) {
      return NextResponse.json({
        error: 'Appointment ID and amount are required'
      }, { status: 400 });
    }

    // Verify the appointment belongs to this business
    const appointment = await prisma.appointments.findFirst({
      where: {
        id: appointmentId,
        businessId: user.businessId
      },
      include: {
        Client: { select: { name: true, email: true } },
        Service: { select: { name: true } }
      }
    });

    if (!appointment) {
      return NextResponse.json({
        error: 'Appointment not found'
      }, { status: 404 });
    }

    // Process payment (simulation)
    const paymentResult = await processPayment({
      appointmentId,
      clientId: appointment.clientId,
      businessId: user.businessId,
      amount,
      description: description || `${appointment.Service?.name} - ${appointment.Client?.name}`,
      paymentMethod: paymentMethod || 'card'
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      data: paymentResult
    });

  } catch (error) {
    console.error('❌ Error processing payment:', error);
    return NextResponse.json({
      error: 'Failed to process payment'
    }, { status: 500 });
  }
}

async function generateMockPaymentHistory(businessId: string, filters: any) {
  // Get completed appointments for this business to simulate payments
  const appointments = await prisma.appointments.findMany({
    where: {
      businessId,
      status: 'COMPLETED'
    },
    include: {
      Client: { select: { name: true, email: true } },
      Service: { select: { name: true, price: true } }
    },
    take: filters.limit,
    skip: filters.offset,
    orderBy: { scheduledFor: 'desc' }
  });

  return appointments.map((apt, index) => ({
    id: `pay_${apt.id.slice(-8)}${index}`,
    appointmentId: apt.id,
    clientName: apt.Client?.name || 'Cliente',
    clientEmail: apt.Client?.email || '',
    serviceName: apt.Service?.name || 'Serviço',
    amount: apt.Service?.price || 50,
    currency: 'EUR',
    status: Math.random() > 0.1 ? 'completed' : 'pending', // 90% success rate
    paymentMethod: ['card', 'mbway', 'cash'][Math.floor(Math.random() * 3)],
    transactionId: `txn_${Date.now()}_${index}`,
    processedAt: apt.scheduledFor,
    description: `${apt.Service?.name} - ${apt.Client?.name}`,
    fees: Number((apt.Service?.price * 0.029 || 1.45).toFixed(2)), // 2.9% fee
    netAmount: Number(((apt.Service?.price || 50) * 0.971).toFixed(2))
  }));
}

async function processPayment({
  appointmentId,
  clientId,
  businessId,
  amount,
  description,
  paymentMethod
}: {
  appointmentId: string;
  clientId: string;
  businessId: string;
  amount: number;
  description: string;
  paymentMethod: string;
}) {
  // This is where you'd integrate with actual payment providers
  console.log('💰 Processing payment:', {
    appointmentId,
    amount,
    paymentMethod,
    description
  });

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate payment result (90% success rate)
  const success = Math.random() > 0.1;
  
  const result = {
    id: `pay_${Date.now()}`,
    appointmentId,
    clientId,
    businessId,
    amount,
    currency: 'EUR',
    status: success ? 'completed' : 'failed',
    paymentMethod,
    transactionId: `txn_${Date.now()}`,
    processedAt: new Date().toISOString(),
    description,
    fees: Number((amount * 0.029).toFixed(2)),
    netAmount: Number((amount * 0.971).toFixed(2)),
    failureReason: success ? null : 'Insufficient funds'
  };

  // In production, you'd save this to your payments table
  console.log('💰 Payment result:', result);

  return result;
} 