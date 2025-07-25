import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { createJWTToken } from '@/lib/jwt';

// Login schema validation
const loginSchema = z.object({
  email: z.string().email('Email inválido').toLowerCase(),
  password: z.string().min(1, 'Password é obrigatória')
});

export async function POST(request: NextRequest) {
  try {
    console.log('[CLIENT_SIGNIN] Starting login...');
    
    const body = await request.json();
    console.log('[CLIENT_SIGNIN] Request body:', { 
      email: body.email,
      hasPassword: !!body.password
    });

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.log('[CLIENT_SIGNIN] Validation failed:', validationResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: validationResult.error.errors[0].message 
          } 
        },
        { status: 400 }
      );
    }

    const { email, password } = validationResult.data;

    // Find client by email
    console.log('[CLIENT_SIGNIN] Finding client...');
    const client = await prisma.independentClient.findFirst({
      where: {
        email,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
        status: true
      }
    });

    if (!client || !client.password) {
      console.log('[CLIENT_SIGNIN] Client not found, inactive, or no password:', email);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_CREDENTIALS', 
            message: 'Email ou password incorretos' 
          } 
        },
        { status: 401 }
      );
    }

    // Verify password
    console.log('[CLIENT_SIGNIN] Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, client.password);

    if (!isPasswordValid) {
      console.log('[CLIENT_SIGNIN] Invalid password for client:', email);
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'INVALID_CREDENTIALS', 
            message: 'Email ou password incorretos' 
          } 
        },
        { status: 401 }
      );
    }

    // Create JWT token for client session
    console.log('[CLIENT_SIGNIN] Creating JWT token...');
    const tokenPayload = {
      id: client.id,
      email: client.email,
      name: client.name,
      role: 'STAFF' as const, // Use STAFF role as closest match for clients
      isAdmin: false
    };

    const token = createJWTToken(tokenPayload);

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        role: 'CLIENT'
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    console.log('[CLIENT_SIGNIN] ✅ Login successful for client:', client.id);

    return response;

  } catch (error) {
    console.error('[CLIENT_SIGNIN] ❌ Login error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'LOGIN_ERROR', 
          message: 'Erro interno do servidor' 
        } 
      },
      { status: 500 }
    );
  }
} 