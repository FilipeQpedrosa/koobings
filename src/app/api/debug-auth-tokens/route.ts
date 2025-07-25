import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export async function GET(req: NextRequest) {
  const user = getRequestAuthUser(req);
  
  const cookies = {
    'admin-auth-token': req.cookies.get('admin-auth-token')?.value || 'not set',
    'business-auth-token': req.cookies.get('business-auth-token')?.value || 'not set',
    'auth-token': req.cookies.get('auth-token')?.value || 'not set'
  };

  return NextResponse.json({
    user,
    cookies,
    pathname: req.nextUrl.pathname,
    hasUser: !!user,
    userRole: user?.role,
    businessId: user?.businessId,
    businessSlug: user?.businessSlug
  });
} 