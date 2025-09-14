import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// GET /api/client/reviews - Get client reviews
export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const clientEmail = searchParams.get('clientEmail') || user.email;

    // Find client by email to get clientId
    const client = await prisma.customer.findFirst({
      where: { email: clientEmail },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    const reviews = await prisma.reviews.findMany({
      where: {
        clientId: client.id,
      },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVIEWS_FETCH_ERROR', message: 'Falha ao carregar avaliações' } },
      { status: 500 }
    );
  }
}

// POST /api/client/reviews - Create new review
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
    const { appointmentId, rating, comment } = body;

    // Validate required fields
    if (!appointmentId || !rating) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Dados obrigatórios em falta' } },
        { status: 400 }
      );
    }

    // Find client by email
    const client = await prisma.customer.findFirst({
      where: { email: user.email },
      select: { id: true }
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: { code: 'CLIENT_NOT_FOUND', message: 'Cliente não encontrado' } },
        { status: 404 }
      );
    }

    // Verify appointment belongs to client
    const appointment = await prisma.appointments.findFirst({
      where: {
        id: appointmentId,
        Client: { email: user.email },
        status: 'COMPLETED'
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { success: false, error: { code: 'APPOINTMENT_NOT_FOUND', message: 'Agendamento não encontrado ou não concluído' } },
        { status: 404 }
      );
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        clientId: client.id,
        appointmentId,
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        appointment: {
          include: {
            service: true,
            staff: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REVIEW_CREATE_ERROR', message: 'Falha ao criar avaliação' } },
      { status: 500 }
    );
  }
} 