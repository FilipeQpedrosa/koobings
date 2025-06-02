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
            clients: true,
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
      ownerName,
      type,
      email,
      phone,
      address,
      settings,
      passwordHash
    } = body;

    // Check if the owner email is already used in business or staff (case-insensitive)
    const emailLower = email.toLowerCase();
    const [existingBusiness, existingStaff] = await Promise.all([
      prisma.business.findUnique({ where: { email: emailLower } }),
      prisma.staff.findUnique({ where: { email: emailLower } }),
    ]);
    if (existingBusiness || existingStaff) {
      return NextResponse.json({ error: 'Email is already in use by another business or staff member.' }, { status: 400 });
    }

    // Use a transaction for atomicity
    const result = await prisma.$transaction(async (tx) => {
      const business = await tx.business.create({
        data: {
          name,
          type,
          email: emailLower,
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
        },
        include: {
          verification: true
        }
      });

      const ownerStaff = await tx.staff.create({
        data: {
          name: ownerName,
          email: emailLower,
          password: passwordHash,
          role: 'ADMIN',
          businessId: business.id,
        }
      });

      return { business, ownerStaff };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating business:', error);
    return NextResponse.json({ error: 'Failed to create business and admin staff. Please try again.' }, { status: 500 });
  }
} 