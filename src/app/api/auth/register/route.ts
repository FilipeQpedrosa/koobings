import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['staff', 'business']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registrationSchema.parse(body);
    const { email, password, name, role } = validatedData;

    // Check if user already exists in either staff or business table
    const [existingStaff, existingBusiness] = await Promise.all([
      prisma.staff.findUnique({ where: { email } }),
      prisma.business.findUnique({ where: { email } }),
    ]);

    if (existingStaff || existingBusiness) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user based on role
    if (role === 'staff') {
      const staff = await prisma.staff.create({
        data: {
          name,
          email,
          hashedPassword,
          status: 'PENDING', // Staff needs to be approved
          role: 'STANDARD',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          ...staff,
          type: 'staff',
        },
      });
    } else {
      const business = await prisma.business.create({
        data: {
          name,
          email,
          hashedPassword,
          status: 'ACTIVE',
          settings: {
            create: {
              timezone: 'UTC',
              businessHours: {},
              notificationPreferences: {
                email: true,
                sms: false,
              },
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          settings: true,
        },
      });

      return NextResponse.json({
        success: true,
        user: {
          ...business,
          type: 'business',
        },
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 