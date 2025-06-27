import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }

    const activities = await prisma.adminActivity.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json({ success: false, error: { code: 'ACTIVITIES_FETCH_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
}

export async function POST(_request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }

    const { action, details } = await _request.json();

    const activity = await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action,
        details
      }
    });

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error('Error creating admin activity:', error);
    return NextResponse.json({ success: false, error: { code: 'ACTIVITY_CREATE_ERROR', message: 'Internal Server Error' } }, { status: 500 });
  }
} 