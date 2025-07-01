import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } },
        { status: 403 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
      include: {
        verification: true,
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        services: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true
          }
        },
        appointments: {
          select: {
            id: true,
            scheduledFor: true,
            client: {
              select: {
                name: true
              }
            },
            service: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            scheduledFor: 'desc'
          },
          take: 10
        },
        _count: {
          select: {
            clients: true,
            staff: true,
            services: true
          }
        }
      }
    });

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: business });
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BUSINESS_FETCH_ERROR', message: 'Internal Server Error' } },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PUT(request: Request) {
  const { pathname } = new URL(request.url);
  const id = pathname.split('/').at(-1);
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }
    // Verify if the user is a system admin or staff admin for this business
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });
    let isAuthorized = !!admin;
    if (!isAuthorized) {
      // Check if user is a staff admin for this business
      const staffAdmin = await prisma.staff.findFirst({
        where: {
          email: session.user.email,
          businessId: id,
          role: 'ADMIN',
        },
      });
      isAuthorized = !!staffAdmin;
    }
    if (!isAuthorized) {
      return NextResponse.json({ success: false, error: { code: 'FORBIDDEN', message: 'Forbidden' } }, { status: 403 });
    }
    const body = await request.json();
    const { name, email, status, ownerName, allowStaffToViewAllBookings, restrictStaffToViewAllClients, restrictStaffToViewAllNotes } = body;
    if (!name || !email || !status) {
      return NextResponse.json({ success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } }, { status: 400 });
    }
    // Check for email conflict (if email is being changed)
    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) {
      return NextResponse.json({ success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } }, { status: 404 });
    }
    if (email !== business.email) {
      const emailLower = email.toLowerCase();
      const [existingBusiness, existingStaff] = await Promise.all([
        prisma.business.findUnique({ where: { email: emailLower } }),
        prisma.staff.findUnique({ where: { email: emailLower } }),
      ]);
      if (existingBusiness || existingStaff) {
        return NextResponse.json({ success: false, error: { code: 'EMAIL_IN_USE', message: 'Email is already in use by another business or staff member.' } }, { status: 400 });
      }
    }
    // Update business
    const updated = await prisma.business.update({
      where: { id },
      data: {
        name,
        email: email.toLowerCase(),
        status,
        ownerName,
        ...(allowStaffToViewAllBookings !== undefined && { allowStaffToViewAllBookings }),
        ...(restrictStaffToViewAllClients !== undefined && { restrictStaffToViewAllClients }),
        ...(restrictStaffToViewAllNotes !== undefined && { restrictStaffToViewAllNotes }),
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ success: false, error: { code: 'BUSINESS_UPDATE_ERROR', message: 'Failed to update business' } }, { status: 500 });
  }
} 