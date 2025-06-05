import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify if the user is a system admin
    const admin = await prisma.systemAdmin.findUnique({
      where: { email: session.user.email }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const business = await prisma.business.findUnique({
      where: { id: params.id },
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

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(business);
  } catch (error) {
    console.error('Error fetching business:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
          businessId: params.id,
          role: 'ADMIN',
        },
      });
      isAuthorized = !!staffAdmin;
    }
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await request.json();
    const { name, email, status, ownerName, allowStaffToViewAllBookings, restrictStaffToViewAllClients, restrictStaffToViewAllNotes } = body;
    if (!name || !email || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Check for email conflict (if email is being changed)
    const business = await prisma.business.findUnique({ where: { id: params.id } });
    if (!business) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    if (email !== business.email) {
      const emailLower = email.toLowerCase();
      const [existingBusiness, existingStaff] = await Promise.all([
        prisma.business.findUnique({ where: { email: emailLower } }),
        prisma.staff.findUnique({ where: { email: emailLower } }),
      ]);
      if (existingBusiness || existingStaff) {
        return NextResponse.json({ error: 'Email is already in use by another business or staff member.' }, { status: 400 });
      }
    }
    // Update business
    const updated = await prisma.business.update({
      where: { id: params.id },
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
    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error('Error updating business:', error);
    return NextResponse.json({ error: 'Failed to update business' }, { status: 500 });
  }
} 