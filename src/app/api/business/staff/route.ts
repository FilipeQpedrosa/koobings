import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/supabase';
import { z } from 'zod';

const staffSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'PROVIDER']),
});

const staffArraySchema = z.array(staffSchema);

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { staff } = await request.json();
    
    // Validate input
    const validatedStaff = staffArraySchema.parse(staff);

    // Delete existing staff
    await prisma.staff.deleteMany({
      where: {
        businessId: session.user.id,
      },
    });

    // Create new staff members
    await prisma.staff.createMany({
      data: validatedStaff.map((member) => ({
        businessId: session.user.id,
        name: member.name,
        email: member.email,
        role: member.role,
      })),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse('Invalid input data', { status: 400 });
    }
    console.error('Error saving staff:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const staff = await prisma.staff.findMany({
      where: {
        businessId: session.user.id,
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 