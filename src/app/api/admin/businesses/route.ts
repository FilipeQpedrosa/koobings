import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/admin/businesses - List all businesses
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const businesses = await prisma.business.findMany({
      include: {
        verification: true,
        _count: {
          select: {
            patients: true,
            staff: true,
            services: true
          }
        }
      }
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/businesses - Create a new business
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      type,
      email,
      phone,
      address,
      settings,
      passwordHash
    } = body;

    const businessData: Prisma.BusinessCreateInput = {
      name,
      type,
      email,
      phone,
      address,
      settings,
      passwordHash,
      status: 'PENDING',
      verification: {
        create: {
          status: 'PENDING',
          submittedAt: new Date()
        }
      },
      systemAdmins: {
        connect: {
          id: admin.id
        }
      }
    };

    const business = await prisma.business.create({
      data: businessData,
      include: {
        verification: true
      }
    });

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 