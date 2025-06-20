import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.businessId) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = session.user.businessId;

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

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('GET /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !session.user.businessId) {
      console.error('Unauthorized: No session or user.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = session.user.businessId;

    // Input validation
    const schema = z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['ADMIN', 'MANAGER', 'STANDARD']),
      password: z.string().min(6),
      services: z.array(z.string()).optional(),
    });
    let data;
    try {
      data = schema.parse(await request.json());
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: error.errors } }, { status: 400 });
      }
      throw error;
    }
    const { email, name, role, password, services = [] } = data;

    const passwordHash = await hash(password, 10);

    const staff = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newStaff = await tx.staff.create({
        data: {
          email,
          name,
          role,
          password: passwordHash,
          businessId,
          services: {
            connect: services.map((id: string) => ({ id })),
          },
        },
        include: {
          services: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return tx.staff.findUnique({
        where: { id: newStaff.id },
        include: {
          services: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    });

    return NextResponse.json({ success: true, data: staff });
  } catch (error) {
    console.error('POST /business/staff error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: error instanceof Error ? error.message : String(error) } },
      { status: 500 }
    );
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 