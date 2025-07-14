import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt';
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

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verifying auth token...');
    
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.log('❌ No valid token found');
      return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    }
    
    // 🛡️ CRITICAL: Validate user data before sending to frontend
    const validatedUser = validateAndSanitizeUser(user);
    
    if (!validatedUser) {
      console.error('🚨 SERVER: User data validation failed, rejecting token');
      return NextResponse.json({ success: false, authenticated: false, error: 'Invalid user data' }, { status: 401 });
    }
    
    console.log('✅ Token valid and data validated for user:', validatedUser.name);
    
    return NextResponse.json({ 
      success: true,
      authenticated: true, 
      user: validatedUser
    });
  } catch (error) {
    console.error('🚨 Token verification error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 