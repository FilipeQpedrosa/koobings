import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const { email, password, businessSlug } = await request.json();

    console.log('🔐 Login attempt for email:', email);
    if (businessSlug) {
      console.log('🏢 Specific business requested:', businessSlug);
    }

    // 🚨 CRITICAL SECURITY FIX: Clear all existing sessions before login
    console.log('🧹 Clearing any existing sessions before login...');
    
    const response = NextResponse.json({ success: false }); // Temporary response
    
    // Clear ALL possible auth cookies before processing login
    const cookiesToClear = [
      'auth-token',
      'business-auth-token', 
      'admin-auth-token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      });
    });

    // First, try to find staff member
    const staff = await (prisma.staff as any).findUnique({
      where: { email }
    });

    if (staff) {
      console.log('👨‍💼 Staff member found:', staff.name);
      
      // Get the business data separately
      const business = await (prisma.business as any).findUnique({
        where: { id: staff.businessId },
        select: {
          id: true,
          name: true,
          slug: true, // Use real slug from database
        }
      });
      
      // 🚨 CRITICAL FIX: If businessSlug is specified, only allow login for that specific business
      if (businessSlug && business?.slug !== businessSlug) {
        console.log('❌ Staff login denied: business slug mismatch');
        console.log('❌ Staff business:', business?.slug, 'Requested:', businessSlug);
        return NextResponse.json({ error: 'Invalid credentials for this business' }, { status: 401 });
      }
      
      // Verify password
      const isValidPassword = await compare(password, staff.password);
      
      if (isValidPassword) {
        // Use business slug from database
        const businessSlug = business?.slug || 'staff'; // Fallback only if slug is missing
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        
        // Create JWT token directly
        const token = sign({
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: 'STAFF',
          businessId: staff.businessId,
          businessName: business?.name || '',
          businessSlug: businessSlug,
          staffRole: staff.role,
          isAdmin: staff.role === 'ADMIN'
        }, JWT_SECRET, { expiresIn: '7d' });
        
        console.log('✅ Staff login successful for:', staff.name);
        
        // Set cookie and redirect
        const response = NextResponse.json({ 
          success: true, 
          redirectUrl: dashboardUrl,
          user: {
            id: staff.id,
            email: staff.email,
            name: staff.name,
            role: 'STAFF',
            businessName: business?.name || '',
            businessSlug: businessSlug,
            staffRole: staff.role,
            isAdmin: staff.role === 'ADMIN'
          }
        });
        
        // 🚨 SECURITY FIX: Clear all other cookies first, then set ONLY the correct one
        response.cookies.set('admin-auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        response.cookies.set('auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        // Use business-specific cookie name
        response.cookies.set('business-auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/' // Root path for all business routes
        });
        
        return response;
      }
    }

    // 🚨 CRITICAL FIX: If businessSlug is specified, find business by slug AND email
    // If staff not found, try business owner with SPECIFIC business slug
    let business;
    if (businessSlug) {
      console.log('🎯 Looking for business owner with specific slug:', businessSlug);
      business = await (prisma.business as any).findFirst({
        where: { 
          email,
          slug: businessSlug 
        },
        select: {
          id: true,
          name: true,
          email: true,
          ownerName: true,
          passwordHash: true,
          slug: true, // Use real slug from database
        }
      });
    } else {
      // Legacy behavior: find any business with this email
      console.log('🔍 Looking for any business owner with email:', email);
      business = await (prisma.business as any).findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          ownerName: true,
          passwordHash: true,
          slug: true, // Use real slug from database
        }
      });
    }

    if (business) {
      console.log('🏢 Business owner found:', business.ownerName || business.name, 'for business:', business.slug);
      
      // Verify password
      const isValidPassword = await compare(password, business.passwordHash);
      
      if (isValidPassword) {
        // Use business slug from database
        const businessSlugForToken = business.slug || 'business'; // Fallback only if slug is missing
        const dashboardUrl = `/${businessSlugForToken}/staff/dashboard`;
        
        // Create JWT token directly
        const token = sign({
          id: business.id,
          email: business.email,
          name: business.ownerName || business.name,
          role: 'BUSINESS_OWNER',
          businessId: business.id,
          businessName: business.name,
          businessSlug: businessSlugForToken,
          isAdmin: false  // Business owners are not system admins
        }, JWT_SECRET, { expiresIn: '7d' });
        
        console.log('✅ Business owner login successful for:', business.ownerName || business.name, 'business:', business.slug);
        
        // Set cookie and redirect
        const response = NextResponse.json({ 
          success: true, 
          redirectUrl: dashboardUrl,
          user: {
            id: business.id,
            email: business.email,
            name: business.ownerName || business.name,
            role: 'BUSINESS_OWNER',
            businessName: business.name,
            businessSlug: businessSlugForToken,
            isAdmin: false  // Business owners are not system admins
          }
        });
        
        // 🚨 SECURITY FIX: Clear all other cookies first, then set ONLY the correct one
        response.cookies.set('admin-auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        response.cookies.set('auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        // Use business-specific cookie name
        response.cookies.set('business-auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/' // Root path for all business routes
        });
        
        return response;
      }
    }

    // Check if it's an admin login
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (admin) {
      console.log('👑 System admin found:', admin.name);
      
      // Verify password
      const isValidPassword = await compare(password, admin.passwordHash);
      
      if (isValidPassword) {
        const dashboardUrl = '/admin/dashboard';
        
        // Create JWT token directly - this works!
        const token = sign({
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'ADMIN',
          businessId: undefined,
          businessName: undefined,
          businessSlug: undefined,
          staffRole: 'ADMIN',
          isAdmin: true
        }, JWT_SECRET, { expiresIn: '7d' });
        
        console.log('✅ Admin login successful for:', admin.name);
        
        // Set cookie and redirect
        const response = NextResponse.json({ 
          success: true, 
          redirectUrl: dashboardUrl,
          user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'ADMIN',
            businessName: null,
            businessSlug: null,
            staffRole: 'ADMIN',
            isAdmin: true
          }
        });
        
        // 🚨 SECURITY FIX: Clear all other cookies first, then set ONLY the correct one
        response.cookies.set('business-auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        response.cookies.set('auth-token', '', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(0),
          path: '/'
        });
        
        // Use admin-specific cookie name
        response.cookies.set('admin-auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days
          path: '/' // Root path for admin routes
        });
        
        return response;
      }
    }

    console.log('❌ Login failed for email:', email);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    
  } catch (error) {
    console.error('🚨 Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 