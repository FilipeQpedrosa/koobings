import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { BusinessStatus, BusinessType } from '@prisma/client';

// Validation schema for business registration
const businessRegistrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  type: z.nativeEnum(BusinessType).default(BusinessType.OTHER),
  url: z.string().url('Invalid URL').optional(),
});

export async function POST(request: Request) {
  // Always return forbidden for now
  return NextResponse.json({ error: 'Registration is only available to system administrators.' }, { status: 403 });
} 