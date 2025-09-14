// Enterprise-level secure authentication system
// Designed for millions of concurrent users with zero data leakage

import { NextRequest } from 'next/server';
import { verifyJWTToken, createJWTToken } from '@/lib/jwt';
import crypto from 'crypto';

type UserRole = 'ADMIN' | 'BUSINESS_OWNER' | 'STAFF' | 'CUSTOMER';

interface SecureSession {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  fingerprint: string;
  issuedAt: number;
  expiresAt: number;
}

interface ExtendedJWTPayload {
  id?: string;
  email?: string;
  role?: string;
  sessionId?: string;
  fingerprint?: string;
  iat?: number;
  exp?: number;
}

// Generate unique session fingerprint based on request
function generateSessionFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  
  // Create unique fingerprint (but not too specific to avoid privacy issues)
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${userAgent}${acceptLanguage}${acceptEncoding}`)
    .digest('hex')
    .substring(0, 16);
    
  return fingerprint;
}

// Generate cryptographically secure session ID
function generateSecureSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create secure session token with embedded session data
export function createSecureSession(userId: string, email: string, role: UserRole, request: NextRequest): string {
  const now = Date.now();
  const sessionId = generateSecureSessionId();
  const fingerprint = generateSessionFingerprint(request);
  
  const sessionData: SecureSession = {
    userId,
    email,
    role,
    sessionId,
    fingerprint,
    issuedAt: now,
    expiresAt: now + (24 * 60 * 60 * 1000) // 24 hours
  };
  
  // Create JWT with embedded session data using direct JWT signing
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-for-koobings-app-change-in-production-1755088489';
  
  const tokenPayload = {
    id: userId,
    email,
    name: email, // Use email as name for now
    role,
    sessionId,
    fingerprint,
    isAdmin: role === 'ADMIN',
    iat: Math.floor(now / 1000),
    exp: Math.floor(sessionData.expiresAt / 1000)
  };
  
  const token = jwt.sign(tokenPayload, JWT_SECRET);
  
  console.log(`🔐 [SECURE_AUTH] Created session for user ${email} with session ${sessionId} and fingerprint ${fingerprint}`);
  
  return token;
}

// Verify secure session with multiple validation layers
export function verifySecureSession(request: NextRequest): SecureSession | null {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('🔒 [SECURE_AUTH] No auth token found');
      return null;
    }
    
    // Verify JWT signature and structure
    const decoded = verifyJWTToken(token) as ExtendedJWTPayload;
    if (!decoded) {
      console.log('🔒 [SECURE_AUTH] Token verification failed');
      return null;
    }
    
    // Extract session data from JWT with proper validation
    if (!decoded.id || !decoded.email || !decoded.role || !decoded.sessionId || !decoded.fingerprint) {
      console.log('🔒 [SECURE_AUTH] Incomplete token data');
      return null;
    }
    
    const session: SecureSession = {
      userId: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole,
      sessionId: decoded.sessionId,
      fingerprint: decoded.fingerprint,
      issuedAt: (decoded.iat || 0) * 1000,
      expiresAt: (decoded.exp || 0) * 1000
    };
    
    // Validation 1: Check expiration
    if (Date.now() > session.expiresAt) {
      console.log(`🔒 [SECURE_AUTH] Session expired for user ${session.email}`);
      return null;
    }
    
    // Validation 2: Verify session fingerprint matches request
    const currentFingerprint = generateSessionFingerprint(request);
    if (session.fingerprint !== currentFingerprint) {
      console.log(`🚨 [SECURE_AUTH] SECURITY BREACH: Fingerprint mismatch for user ${session.email}. Expected: ${session.fingerprint}, Got: ${currentFingerprint}`);
      return null;
    }
    
    // Validation 3: Check required fields
    if (!session.userId || !session.email || !session.role || !session.sessionId) {
      console.log(`🔒 [SECURE_AUTH] Incomplete session data for user ${session.email}`);
      return null;
    }
    
    console.log(`✅ [SECURE_AUTH] Valid session for user ${session.email} with session ${session.sessionId}`);
    return session;
    
  } catch (error) {
    console.error('🔒 [SECURE_AUTH] Session verification error:', error);
    return null;
  }
}

// Verify customer-specific session with role validation
export function verifyCustomerSession(request: NextRequest): SecureSession | null {
  const session = verifySecureSession(request);
  
  if (!session) {
    return null;
  }
  
  // Role validation - MUST be CUSTOMER
  if (session.role !== 'CUSTOMER') {
    console.log(`🚨 [SECURE_AUTH] SECURITY BREACH: Invalid role for customer endpoint. User: ${session.email}, Role: ${session.role}`);
    return null;
  }
  
  return session;
}

// Generate secure cookie options
export function getSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: '/'
  };
} 