import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Business name to slug mapping (same as in auth.ts)
const BUSINESS_SLUG_MAP: Record<string, string> = {
  'barbearia orlando': 'barbearia-orlando',
  'ju-unha': 'ju-unha',
  'ju unha': 'ju-unha',
  'mari nails': 'mari-nails',
  'admin test business': 'admin-test-business',
  'panda e os caricas': 'panda-e-os-caricas',
  'arthur personal': 'arthur-personal',
  'mª joão lemos costa': 'm-joao-lemos-costa',
  'm joão lemos costa': 'm-joao-lemos-costa'
};

export async function GET(request: NextRequest) {
  try {
    console.log('🎯 STAFF DASHBOARD RESOLVER START');
    
    const session = await getServerSession(authOptions);
    console.log('👤 Session:', session?.user ? {
      email: session.user.email,
      role: session.user.role,
      businessName: session.user.businessName
    } : 'No session');
    
    if (!session?.user) {
      console.log('❌ No session, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    // Handle admin users
    if (session.user.role === 'ADMIN' || session.user.isAdmin) {
      console.log('🔑 Admin user, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Handle staff users
    if (session.user.role === 'STAFF' && session.user.businessName) {
      const businessNameLower = session.user.businessName.toLowerCase();
      const businessSlug = BUSINESS_SLUG_MAP[businessNameLower];
      
      console.log('🏢 Business mapping:', {
        businessName: session.user.businessName,
        businessNameLower,
        businessSlug,
        availableSlugs: Object.keys(BUSINESS_SLUG_MAP)
      });

      if (businessSlug) {
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        console.log('✅ Redirecting to:', dashboardUrl);
        return NextResponse.redirect(new URL(dashboardUrl, request.url));
      } else {
        console.log('❌ No business slug found!');
      }
    }

    // Fallback: redirect to home
    console.log('🏠 Fallback: redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));

  } catch (error) {
    console.error('❌ Error in staff dashboard resolver:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
} 