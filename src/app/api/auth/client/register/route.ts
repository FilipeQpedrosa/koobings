import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Registration schema validation
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  email: z.string().email('Email inválido').toLowerCase(),
  phone: z.string().nullable().optional(),
  password: z.string().min(6, 'Password deve ter pelo menos 6 caracteres').max(100, 'Password muito longa')
});

export async function POST(request: NextRequest) {
  try {
    console.log('[CLIENT_REGISTER] Starting registration...');
    
    const body = await request.json();
    console.log('[CLIENT_REGISTER] Request body:', { 
      name: body.name,
      email: body.email,
      phone: body.phone,
      hasPassword: !!body.password
    });

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('[CLIENT_REGISTER] Validation failed:', validationResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: validationResult.error.errors[0].message,
            details: validationResult.error.errors
          } 
        },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = validationResult.data;

    // Check if client already exists
    console.log('[CLIENT_REGISTER] Checking for existing client...');
    const existingClient = await prisma.customer.findFirst({
      where: { email }
    });

    if (existingClient) {
      console.log('[CLIENT_REGISTER] Client already exists with email:', email);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'EMAIL_EXISTS', 
            message: 'Já existe uma conta com este email' 
          } 
        },
        { status: 409 }
      );
    }

    // Hash password
    console.log('[CLIENT_REGISTER] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new client
    const client = await prisma.customer.create({
      data: {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email,
        phone: phone || null,
        password: hashedPassword,
        status: 'ACTIVE',
        emailVerified: false,
        onboardingCompleted: false,
        marketingConsent: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    });

    console.log('[CLIENT_REGISTER] ✅ Client created successfully:', client.id);

    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso',
      data: {
        client: {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          createdAt: client.createdAt
        }
      }
    });

  } catch (error) {
    console.error('[CLIENT_REGISTER] ❌ Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'REGISTRATION_ERROR', 
          message: 'Erro interno do servidor' 
        } 
      },
      { status: 500 }
    );
  }
} 