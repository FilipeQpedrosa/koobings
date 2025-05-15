import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/staff/profile - Get staff member profile
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    const profile = await prisma.staff.findUnique({
      where: { id: staffId },
      include: {
        services: true,
        schedules: true,
        availability: true,
        permissions: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching staff profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// POST /api/staff/profile - Create or update staff profile
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, email, name, role, businessId, services } = body;

    if (!email || !name || !role || !businessId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.upsert({
      where: { id: id || 'new' },
      update: {
        email,
        name,
        role,
        businessId,
        services: {
          set: services || [],
        },
      },
      create: {
        email,
        name,
        role,
        businessId,
        services: {
          connect: services || [],
        },
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error updating staff profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// DELETE /api/staff/profile - Delete staff profile
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');

    if (!staffId) {
      return NextResponse.json({ error: 'Staff ID is required' }, { status: 400 });
    }

    await prisma.staff.delete({
      where: { id: staffId },
    });

    return NextResponse.json({ message: 'Staff profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
} 