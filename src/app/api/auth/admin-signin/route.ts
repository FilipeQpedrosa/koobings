import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createUltraSecureSessionV2, getUltraSecureCookieOptionsV2 } from '@/lib/ultra-secure-auth-v2';
import { logSecurityEvent, checkThreatLevel, isRequestBlocked } from '@/lib/security-monitoring';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('[ADMIN_AUTH] 🔐 ULTRA-SECURE ADMIN LOGIN ATTEMPT...');

    // 🚨 CRITICAL: Block request if IP is flagged
    if (isRequestBlocked(request)) {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'CRITICAL', {
        reason: 'Blocked IP attempting admin login'
      });
      return NextResponse.json(
        { success: false, error: 'ACCESS_DENIED', message: 'Acesso bloqueado por segurança' },
        { status: 403 }
      );
    }

    // Parse request body securely
    let body;
    try {
      body = await request.json();
    } catch (error) {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'HIGH', {
        reason: 'Invalid JSON in admin login request'
      });
      return NextResponse.json(
        { success: false, error: 'INVALID_REQUEST', message: 'Formato de requisição inválido' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Enhanced input validation
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      logSecurityEvent('LOGIN_FAILURE', request, 'MEDIUM', {
        reason: 'Missing or invalid credentials format',
        email: email || 'missing'
      });
      return NextResponse.json(
        { success: false, error: 'MISSING_CREDENTIALS', message: 'Email e password são obrigatórios' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logSecurityEvent('LOGIN_FAILURE', request, 'MEDIUM', {
        reason: 'Invalid email format',
        email
      });
      return NextResponse.json(
        { success: false, error: 'INVALID_EMAIL', message: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Threat level assessment
    const threatScore = checkThreatLevel(request, email);
    console.log(`[ADMIN_AUTH] 🛡️ Threat score: ${threatScore.score}/100`);

    if (threatScore.recommendation === 'BLOCK') {
      logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'CRITICAL', {
        reason: 'High threat score for admin login',
        threatScore: threatScore.score,
        factors: threatScore.factors
      });
      return NextResponse.json(
        { success: false, error: 'SECURITY_THREAT', message: 'Login bloqueado por segurança' },
        { status: 403 }
      );
    }

    // Log login attempt
    logSecurityEvent('LOGIN_ATTEMPT', request, 'MEDIUM', {
      email,
      threatScore: threatScore.score,
      role: 'ADMIN'
    });

    // Find admin by email with secure query
    const admin = await prisma.system_admins.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        isDeleted: true,
        createdAt: true
      }
    });

    if (!admin) {
      logSecurityEvent('LOGIN_FAILURE', request, 'HIGH', {
        reason: 'Admin account not found',
        email
      });
      
      // Generic error message to prevent email enumeration
      return NextResponse.json(
        { success: false, error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // Check if admin account is deleted
    if (admin.isDeleted) {
      logSecurityEvent('LOGIN_FAILURE', request, 'HIGH', {
        reason: 'Deleted admin account login attempt',
        email
      });
      return NextResponse.json(
        { success: false, error: 'ACCOUNT_INACTIVE', message: 'Conta administrativa desativada' },
        { status: 403 }
      );
    }

    // Verify password with timing attack protection
    const isValidPassword = await compare(password, admin.passwordHash);
    
    if (!isValidPassword) {
      logSecurityEvent('LOGIN_FAILURE', request, 'HIGH', {
        reason: 'Invalid password for admin',
        email
      });
      
      // Generic error message with same timing
      return NextResponse.json(
        { success: false, error: 'INVALID_CREDENTIALS', message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }

    // 🚀 ULTRA-SECURE SESSION CREATION
    console.log(`[ADMIN_AUTH] ✅ Creating ULTRA security session for admin: ${admin.email}`);
    const ultraSecureToken = createUltraSecureSessionV2(
      admin.id, 
      admin.email, 
      'ADMIN', 
      request,
      'ULTRA' // Maximum security level for admin
    );

    // Log successful login
    logSecurityEvent('LOGIN_SUCCESS', request, 'LOW', {
      email: admin.email,
      role: 'ADMIN',
      securityLevel: 'ULTRA'
    }, admin.email);

    // Create ultra-secure response
    const response = NextResponse.json({
      success: true,
      message: 'Login administrativo realizado com segurança máxima',
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'ADMIN',
        isAdmin: true
      },
      security: 'ULTRA_SECURE_ADMIN',
      timestamp: new Date().toISOString()
    });

    // Set ultra-secure cookie
    const cookieOptions = getUltraSecureCookieOptionsV2();
    response.cookies.set('auth-token', ultraSecureToken, cookieOptions);

    // Clear any other authentication cookies for security
    const cookiesToClear = ['admin-auth-token', 'business-auth-token', 'customer-auth'];
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        ...cookieOptions,
        maxAge: -1,
        expires: new Date(0)
      });
    });

    // Anti-cache headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    console.log(`[ADMIN_AUTH] ✅ Ultra-secure admin login successful for: ${admin.email}`);
    return response;

  } catch (error) {
    console.error('[ADMIN_AUTH] ❌ Critical error:', error);
    
    logSecurityEvent('SUSPICIOUS_ACTIVITY', request, 'CRITICAL', {
      reason: 'Exception during admin login',
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { success: false, error: 'LOGIN_ERROR', message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 