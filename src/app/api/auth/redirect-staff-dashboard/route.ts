import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 STAFF DASHBOARD RESOLVER START');
    
    const session = await getServerSession(authOptions);
    console.log('👤 Session:', session?.user ? {
      email: session.user.email,
      role: (session.user as any).role,
      businessName: (session.user as any).businessName
    } : 'No session');
    
    if (!session?.user) {
      console.log('❌ No session, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const user = session.user as any; // Type assertion for custom properties

    // Handle admin users
    if (user.role === 'ADMIN' || user.isAdmin) {
      console.log('🔑 Admin user, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Handle staff users - use businessSlug from session
    if (user.role === 'STAFF' && user.businessSlug) {
      const dashboardUrl = `/${user.businessSlug}/staff/dashboard`;
      console.log('✅ Redirecting staff to:', dashboardUrl);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Handle business owners - use businessSlug from session
    if (user.role === 'BUSINESS_OWNER' && user.businessSlug) {
      const dashboardUrl = `/${user.businessSlug}/staff/dashboard`;
      console.log('✅ Redirecting business owner to:', dashboardUrl);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // If no businessSlug in session, something is wrong
    console.log('❌ No business slug found in session!');
    console.log('Session data:', user);
    
    // Fallback: redirect to signin to re-authenticate
    console.log('🔄 Redirecting to signin for re-authentication');
    return NextResponse.redirect(new URL('/auth/signin', request.url));

  } catch (error) {
    console.error('❌ Error in staff dashboard resolver:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
} 