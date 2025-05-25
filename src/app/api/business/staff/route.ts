import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcryptjs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const staff = await prisma.staff.findMany({
      where: {
        businessId
      },
      include: {
        services: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const businessId = session.user.businessId;

    if (!businessId) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }

    const data = await request.json();
    const { email, name, role, password, services = [] } = data;

    if (!email || !name || !role || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 10);

    const staff = await prisma.staff.create({
      data: {
        email,
        name,
        role,
        password: passwordHash,
        businessId,
        services: {
          connect: services.map((id: string) => ({ id }))
        }
      },
      include: {
        services: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 