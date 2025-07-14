import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createJWTToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('🔐 Login attempt for email:', email);

    // First, try to find staff member
    const staff = await prisma.staff.findUnique({
      where: { email }
    });

    if (staff) {
      console.log('👨‍💼 Staff member found:', staff.name);
      
      // Get the business data separately
      const business = await prisma.business.findUnique({
        where: { id: staff.businessId }
      });
      
      // Verify password
      const isValidPassword = await compare(password, staff.password);
      
      if (isValidPassword) {
        // Use business slug from database
        const businessSlug = business?.slug || 'staff';
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        
        // Create JWT token using centralized helper
        const token = createJWTToken({
          id: staff.id,
          email: staff.email,
          name: staff.name,
          role: 'STAFF',
          businessId: staff.businessId,
          businessName: business?.name || '',
          businessSlug: businessSlug,
          staffRole: staff.role as 'ADMIN' | 'STANDARD' | 'MANAGER',
          isAdmin: staff.role === 'ADMIN'
        });
        
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

    // If staff not found, try business owner
    const business = await prisma.business.findUnique({
      where: { email }
    });

    if (business) {
      console.log('🏢 Business owner found:', business.ownerName || business.name);
      
      // Verify password
      const isValidPassword = await compare(password, business.passwordHash);
      
      if (isValidPassword) {
        // Use business slug from database
        const businessSlug = business.slug || 'business';
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        
        // Create JWT token using centralized helper
        const token = createJWTToken({
          id: business.id,
          email: business.email,
          name: business.ownerName || business.name,
          role: 'BUSINESS_OWNER',
          businessId: business.id,
          businessName: business.name,
          businessSlug: businessSlug,
          isAdmin: false  // Business owners are not system admins
        });
        
        console.log('✅ Business owner login successful for:', business.ownerName || business.name);
        
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
            businessSlug: businessSlug,
            isAdmin: false  // Business owners are not system admins
          }
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
        
        // Create JWT token using centralized helper
        const token = createJWTToken({
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'ADMIN',
          businessId: undefined,
          businessName: undefined,
          businessSlug: undefined,
          staffRole: admin.role as 'ADMIN' | 'STANDARD' | 'MANAGER',
          isAdmin: true
        });
        
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
            staffRole: admin.role,
            isAdmin: true
          }
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