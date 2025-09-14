import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createUltraSecureSessionV2, getUltraSecureCookieOptionsV2 } from '@/lib/ultra-secure-auth-v2';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[SIMPLE_ADMIN] 🚨 Emergency admin login...');

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email e password obrigatórios'
      }, { status: 400 });
    }

    // Find admin user
    const adminUser = await prisma.system_admins.findFirst({
      where: {
        email: email
      }
    });

    if (!adminUser) {
      console.log('[SIMPLE_ADMIN] ❌ Admin not found');
      return NextResponse.json({
        success: false,
        error: 'Admin não encontrado'
      }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await compare(password, adminUser.passwordHash);
    if (!isValidPassword) {
      console.log('[SIMPLE_ADMIN] ❌ Invalid password');
      return NextResponse.json({
        success: false,
        error: 'Password incorreta'
      }, { status: 401 });
    }

    console.log('[SIMPLE_ADMIN] ✅ Admin login successful');

    // Create ultra-secure session
    const session = createUltraSecureSessionV2(
      adminUser.id,
      adminUser.email,
      'ADMIN',
      request,
      'HIGH'
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login admin realizado com sucesso',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'ADMIN',
        isAdmin: true
      },
      timestamp: new Date().toISOString()
    });

    // Set secure cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    };
    
    response.cookies.set('admin-session', session, cookieOptions);
    response.cookies.set('admin-auth-token', session, cookieOptions);
    response.cookies.set('auth-token', session, cookieOptions); // Also set main auth token

    // Cache prevention
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('[SIMPLE_ADMIN] ❌ Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro interno',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Use POST para fazer login',
    instructions: {
      method: 'POST',
      body: {
        email: 'f.queirozpedrosa@gmail.com',
        password: 'admin123'
      }
    }
  });
} 