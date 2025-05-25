import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as z from 'zod';
import { StaffRole } from '@prisma/client';

// Validation schema for staff registration
const staffRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  businessId: z.string().min(1, 'Business ID is required'),
});

export async function POST(request: Request) {
  // Always return forbidden for now
  return NextResponse.json({ error: 'Staff registration is only available to system administrators.' }, { status: 403 });
} 