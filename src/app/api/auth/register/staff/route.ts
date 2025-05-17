import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';

// Validation schema for staff registration
const staffRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessId: z.string().min(1, 'Business ID is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = staffRegistrationSchema.parse(body);
    const { email, password, name, businessId } = validatedData;

    // Check if staff already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create staff member
    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: StaffRole.PROVIDER,
        businessId,
        mfaEnabled: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        businessId: true,
        business: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...staff,
        type: 'staff',
      },
    });
  } catch (error) {
    console.error('Staff registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register staff member' },
      { status: 500 }
    );
  }
} 