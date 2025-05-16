import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.patient.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with sensitive info and preferences
    const user = await prisma.patient.create({
      data: {
        name,
        email,
        preferences: {
          create: {
            emailNotifications: true,
            smsNotifications: false,
            reminderTime: 24,
            marketingEmails: true
          }
        },
        sensitiveInfo: {
          create: {
            email,
            notes: `Password hash: ${hashedPassword}`,
            encryptionStatus: true
          }
        }
      },
      include: {
        preferences: true,
        sensitiveInfo: true
      }
    });

    // Return the user data needed for the session
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: 'patient',
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
} 