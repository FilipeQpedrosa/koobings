import { NextRequest, NextResponse } from 'next/server';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    console.log('[ADMIN_VERIFY] 🔐 Verifying admin session...');

    // 🚀 PRIORITY 1: Try Ultra-Secure Session first
    let session = verifyUltraSecureSessionV2(request);
    let isUltraSecure = false;
    
    if (session && session.role === 'ADMIN') {
      console.log('[ADMIN_VERIFY] ✅ Found ULTRA-SECURE admin session');
      isUltraSecure = true;
    } else {
      // 🔄 FALLBACK: Try regular JWT authentication
      console.log('[ADMIN_VERIFY] 🔄 Trying JWT fallback...');
      const jwtUser = getRequestAuthUser(request);
      
      if (jwtUser && jwtUser.isAdmin) {
        console.log('[ADMIN_VERIFY] ✅ Found JWT admin session');
        // Convert JWT user to session format (partial for compatibility)
        session = {
          userId: jwtUser.id || jwtUser.userId || '',
          email: jwtUser.email,
          role: 'ADMIN',
          issuedAt: Date.now(),
          expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24h
          securityLevel: 'MEDIUM'
        } as any; // Type assertion for compatibility
        isUltraSecure = false;
      }
    }
    
    if (!session) {
      console.log('[ADMIN_VERIFY] ❌ No valid session found');
      const response = NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Sessão não encontrada' },
        { status: 401 }
      );
      
      // Prevent caching
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      return response;
    }

    // Check if user has admin role
    if (session.role !== 'ADMIN') {
      console.log(`[ADMIN_VERIFY] ❌ User ${session.email} is not admin (role: ${session.role})`);
      const response = NextResponse.json(
        { success: false, error: 'FORBIDDEN', message: 'Acesso negado - não é administrador' },
        { status: 403 }
      );
      
      // Prevent caching
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    console.log(`[ADMIN_VERIFY] ✅ Admin verification successful: ${session.email} (${isUltraSecure ? 'ULTRA-SECURE' : 'JWT'})`);

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        name: session.email.split('@')[0], // Basic name from email
        role: session.role,
        isAdmin: true,
        securityLevel: session.securityLevel || 'MEDIUM'
      },
      security: isUltraSecure ? 'ULTRA_SECURE_ADMIN' : 'JWT_ADMIN',
      timestamp: new Date().toISOString()
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('[ADMIN_VERIFY] ❌ Error verifying admin session:', error);
    const response = NextResponse.json(
      { success: false, error: 'INTERNAL_SERVER_ERROR', message: 'Erro interno na verificação de sessão' },
      { status: 500 }
    );
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
} 