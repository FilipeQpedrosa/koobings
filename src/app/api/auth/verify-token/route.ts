import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { verifyUltraSecureSessionV2 } from '@/lib/ultra-secure-auth-v2';
import { z } from 'zod';

// 🛡️ Server-side user data validation schema
const serverUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  name: z.string().min(1),
  role: z.string().min(1),
  businessId: z.string().optional(),
  businessName: z.string().optional(),
  businessSlug: z.string().optional(),
  staffRole: z.string().optional(),
  isAdmin: z.boolean().optional(),
  permissions: z.array(z.string()).optional()
});

/**
 * 🔒 Validates and sanitizes user data before sending to frontend
 */
function validateAndSanitizeUser(user: any) {
  const userData = {
    id: user.id || user.userId,
    email: user.email,
    name: user.name,
    role: user.role || 'STAFF',
    businessId: user.businessId,
    businessName: user.businessName,
    businessSlug: user.businessSlug,
    staffRole: user.staffRole || 'ADMIN',
    isAdmin: user.isAdmin || false,
    permissions: user.permissions || []
  };

  const parsed = serverUserSchema.safeParse(userData);
  
  if (!parsed.success) {
    console.error('🚨 SERVER: Invalid user data structure:', {
      errors: parsed.error.issues,
      originalData: user,
      sanitizedData: userData,
      timestamp: new Date().toISOString()
    });
    return null;
  }
  
  return parsed.data;
}

/**
 * Convert ultra-secure session to user format
 */
function convertUltraSecureSessionToUser(session: any) {
  return {
    id: session.userId,
    userId: session.userId,
    email: session.email,
    name: session.email.split('@')[0], // Fallback name
    role: session.role,
    isAdmin: session.role === 'ADMIN',
    securityLevel: session.securityLevel
  };
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [VERIFY_TOKEN] Verifying auth token...');
    
    // 🚀 PRIORITY 1: Try Ultra-Secure Admin Session first
    const ultraSecureSession = verifyUltraSecureSessionV2(request);
    if (ultraSecureSession && ultraSecureSession.role === 'ADMIN') {
      console.log('🔑 [VERIFY_TOKEN] Found ULTRA-SECURE admin session');
      
      const adminUser = convertUltraSecureSessionToUser(ultraSecureSession);
      const validatedUser = validateAndSanitizeUser(adminUser);
      
      if (validatedUser) {
        console.log('✅ [VERIFY_TOKEN] Ultra-secure admin validation successful:', validatedUser.email);
        return NextResponse.json({ 
          success: true,
          authenticated: true, 
          user: validatedUser,
          security: 'ULTRA_SECURE_ADMIN'
        });
      }
    }
    
    // 🔄 FALLBACK: Try regular JWT authentication
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.log('❌ [VERIFY_TOKEN] No valid token found');
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    
    // 🛡️ CRITICAL: Validate user data before sending to frontend
    const validatedUser = validateAndSanitizeUser(user);
    
    if (!validatedUser) {
      console.error('🚨 [VERIFY_TOKEN] User data validation failed, rejecting token');
      return NextResponse.json({ success: false, authenticated: false, error: 'Invalid user data' }, { status: 401 });
    }
    
    console.log('✅ [VERIFY_TOKEN] Regular JWT validation successful for user:', validatedUser.name);
    
    return NextResponse.json({ 
      success: true,
      authenticated: true, 
      user: validatedUser,
      security: 'STANDARD_JWT'
    });
  } catch (error) {
    console.error('🚨 [VERIFY_TOKEN] Token verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 