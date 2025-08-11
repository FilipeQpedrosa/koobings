import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt';

// GET /api/client/notifications - Get client notifications
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

    const notifications = await prisma.notifications.findMany({
      where: {
        clientId: client.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to 50 most recent notifications
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: { code: 'NOTIFICATIONS_FETCH_ERROR', message: 'Falha ao carregar notificações' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || !user.email) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationIds } = body;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'IDs de notificação inválidos' } },
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

    // Update notifications to mark as read
    const updatedNotifications = await prisma.notifications.updateMany({
      where: {
        id: { in: notificationIds },
        clientId: client.id, // Ensure client owns these notifications
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: { 
        updatedCount: updatedNotifications.count 
      } 
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: { code: 'NOTIFICATIONS_UPDATE_ERROR', message: 'Falha ao atualizar notificações' } },
      { status: 500 }
    );
  }
} 