import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// Function to generate slug from business name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

// Ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug }
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Validation schema
const registrationSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['staff', 'business']),
  businessId: z.string().optional(), // Required for staff
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registrationSchema.parse(body);
    const { email, password, name, role, businessId } = validatedData;

    // Check if user already exists in either staff or business table (case-insensitive)
    const emailLower = email.toLowerCase();
    const [existingStaff, existingBusiness] = await Promise.all([
      prisma.staff.findUnique({ where: { email: emailLower } }),
      prisma.business.findUnique({ where: { email: emailLower } }),
    ]);

    if (existingStaff || existingBusiness) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user based on role
    if (role === 'staff') {
      if (!businessId) {
        return NextResponse.json(
          { error: 'Business ID is required to register staff.' },
          { status: 400 }
        );
      }
      const staff = await prisma.staff.create({
        data: {
          id: crypto.randomUUID(), // 🔧 FIX: Add required id
          name,
          email: emailLower,
          password: hashedPassword,
          role: 'STANDARD',
          businessId: businessId, // 🔧 FIX: Use businessId directly
          updatedAt: new Date(), // 🔧 FIX: Add required updatedAt
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
      // 🔧 FIX: Generate unique slug for business
      console.log('🔤 Generating unique slug for business...');
      const baseSlug = generateSlug(name);
      const uniqueSlug = await ensureUniqueSlug(baseSlug);
      console.log('✅ Unique slug generated:', uniqueSlug);

      const business = await prisma.business.create({
        data: {
          id: crypto.randomUUID(), // 🔧 FIX: Add required id
          name,
          slug: uniqueSlug, // 🚨 CRITICAL FIX: Add the slug
          email: emailLower,
          passwordHash: hashedPassword,
          status: 'ACTIVE',
          updatedAt: new Date(), // 🔧 FIX: Add required updatedAt
          // 🔧 FIX: Remove the nested settings creation for now
        },
        select: {
          id: true,
          name: true,
          email: true,
          slug: true,
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