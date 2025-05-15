import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching admin activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user?.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, details } = await request.json();

    const activity = await prisma.adminActivity.create({
      data: {
        adminId: admin.id,
        action,
        details
      }
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating admin activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 