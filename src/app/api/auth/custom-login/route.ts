import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { createJWTToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 CUSTOM LOGIN STARTED');
    
    const { email, password } = await request.json();
    console.log('🔍 Login attempt for:', email);

    // First, try to find staff member
    console.log('🔍 Looking for staff member...');
    const staff = await prisma.staff.findUnique({
      where: { email }
    });

    if (staff) {
      console.log('✅ Staff member found:', staff.name);
      
      // Get the business data separately
      const business = await prisma.business.findUnique({
        where: { id: staff.businessId }
      });
      
      // Verify password
      const isValidPassword = await compare(password, staff.password);
      console.log('🔍 Password valid:', isValidPassword);
      
      if (isValidPassword) {
        console.log('🎯 Staff authentication successful');
        
        // Use business slug from database
        const businessSlug = business?.slug || 'staff';
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        
        console.log('🔄 Redirecting to:', dashboardUrl);
        
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
        
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
        
        console.log('🎉 Login successful, token set, redirecting to:', dashboardUrl);
        return response;
      }
    }

    // If staff not found, try business owner
    console.log('🔍 Looking for business owner...');
    const business = await prisma.business.findUnique({
      where: { email }
    });

    if (business) {
      console.log('✅ Business owner found:', business.name);
      console.log('🔗 Business slug:', business.slug);
      
      // Verify password
      const isValidPassword = await compare(password, business.passwordHash);
      console.log('🔍 Password valid:', isValidPassword);
      
      if (isValidPassword) {
        console.log('🎯 Business owner authentication successful');
        
        // Use business slug from database
        const businessSlug = business.slug || 'business';
        const dashboardUrl = `/${businessSlug}/staff/dashboard`;
        
        console.log('🔄 Redirecting to:', dashboardUrl);
        
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
        
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
        
        console.log('🎉 Login successful, token set, redirecting to:', dashboardUrl);
        return response;
      }
    }

    // Check if it's an admin login
    console.log('🔍 Looking for admin user...');
    const admin = await prisma.system_admins.findUnique({
      where: { email }
    });

    if (admin) {
      console.log('✅ Admin found:', admin.name);
      
      // Verify password
      const isValidPassword = await compare(password, admin.passwordHash);
      console.log('🔍 Password valid:', isValidPassword);
      
      if (isValidPassword) {
        console.log('🎯 Admin authentication successful');
        
        const dashboardUrl = '/admin/dashboard';
        
        console.log('🔄 Redirecting to:', dashboardUrl);
        
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
        
        response.cookies.set('auth-token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 // 7 days
        });
        
        console.log('🎉 Admin login successful, token set, redirecting to:', dashboardUrl);
        return response;
      }
    }

    console.log('❌ Authentication failed');
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    
  } catch (error) {
    console.error('🚨 Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 