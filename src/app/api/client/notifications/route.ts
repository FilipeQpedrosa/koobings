import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/client/notifications - Get client notifications
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        read: unreadOnly ? false : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: { code: 'NOTIFICATIONS_FETCH_ERROR', message: 'Failed to fetch notifications' } },
      { status: 500 }
    );
  }
}

// PATCH /api/client/notifications - Mark notifications as read
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const body = await request.json();
    if (body.preferences) {
      // Update notification preferences in the Client model's preferences JSON field
      const updatedClient = await prisma.client.update({
        where: { id: session.user.id },
        data: { preferences: body.preferences },
        select: { preferences: true }
      });
      return NextResponse.json({ success: true, data: updatedClient.preferences });
    }

    const { notificationIds } = body;
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { success: false, error: { code: 'NOTIFICATION_IDS_REQUIRED', message: 'Notification IDs array is required' } },
        { status: 400 }
      );
    }

    // Verify notifications belong to client
    const notifications = await prisma.notification.findMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
    });

    if (notifications.length !== notificationIds.length) {
      return NextResponse.json(
        { success: false, error: { code: 'NOTIFICATIONS_NOT_FOUND', message: 'Some notifications not found or not accessible' } },
        { status: 404 }
      );
    }

    // Mark notifications as read
    await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        userId: session.user.id,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: { code: 'NOTIFICATIONS_UPDATE_ERROR', message: 'Failed to update notifications' } },
      { status: 500 }
    );
  }
} 