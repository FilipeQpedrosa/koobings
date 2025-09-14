import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createUltraSecureSession, getUltraSecureCookieOptions } from '@/lib/ultra-secure-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[ULTRA_LOGIN] 🚀 ULTRA-SCALABLE LOGIN ATTEMPT...');
    
    // Parse request body
    let body;
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await request.json();
      } else {
        // Handle form data
        const formData = await request.formData();
        body = {
          email: formData.get('email'),
          password: formData.get('password')
        };
      }
    } catch (error) {
      console.error('[ULTRA_LOGIN] ❌ Body parsing error:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request format' } },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      console.log('[ULTRA_LOGIN] ❌ Missing credentials');
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_CREDENTIALS', message: 'Email e password são obrigatórios' } },
        { status: 400 }
      );
    }

    // 🚀 ULTRA-SCALABLE: Log attempt with device info for monitoring
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    console.log(`[ULTRA_LOGIN] 🔍 Ultra-scalable login attempt for ${email} from IP: ${ip}, UA: ${userAgent.substring(0, 50)}...`);

    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        status: true
      }
    });

    if (!customer) {
      console.log(`[ULTRA_LOGIN] ❌ Customer not found for email: ${email}`);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email ou password incorretos' } },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, customer.password);
    if (!isValidPassword) {
      console.log(`[ULTRA_LOGIN] ❌ Invalid password for email: ${email}`);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email ou password incorretos' } },
        { status: 401 }
      );
    }

    // Check customer status
    if (customer.status !== 'ACTIVE') {
      console.log(`[ULTRA_LOGIN] ❌ Inactive customer: ${email}, status: ${customer.status}`);
      return NextResponse.json(
        { success: false, error: { code: 'ACCOUNT_INACTIVE', message: 'Conta inativa. Contacte o suporte.' } },
        { status: 403 }
      );
    }

    // 🚀 CREATE ULTRA-SECURE STATELESS SESSION - SCALES TO BILLIONS!
    console.log(`[ULTRA_LOGIN] ✅ Creating ultra-scalable session for customer: ${customer.email}`);
    const ultraSecureToken = createUltraSecureSession(customer.id, customer.email, 'CUSTOMER', request);

    // Create response with ultra-secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso - Sistema Ultra-Escalável',
      user: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        role: 'CUSTOMER'
      },
      scalability: 'BILLIONS_OF_USERS_READY'
    });

    // Set ultra-secure cookie
    const cookieOptions = getUltraSecureCookieOptions();
    response.cookies.set('auth-token', ultraSecureToken, cookieOptions);

    console.log(`[ULTRA_LOGIN] ✅ Ultra-scalable login successful for customer: ${customer.email}`);
    return response;

  } catch (error) {
    console.error('[ULTRA_LOGIN] ❌ Critical error:', error);
    console.error('[ULTRA_LOGIN] ❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('[ULTRA_LOGIN] ❌ Error message:', error instanceof Error ? error.message : error);
    
    return NextResponse.json(
      { success: false, error: { code: 'LOGIN_ERROR', message: 'Erro interno do servidor' } },
      { status: 500 }
    );
  }
} 