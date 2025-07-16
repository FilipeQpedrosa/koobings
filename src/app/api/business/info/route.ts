import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getRequestAuthUser } from '@/lib/jwt';

const businessInfoSchema = z.object({
  description: z.string(),
  logo: z.string().nullable(),
  coverImage: z.string().nullable(),
  phone: z.string(),
  address: z.string(),
  socialLinks: z.object({
    website: z.string(),
    facebook: z.string(),
    instagram: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);

    if (!user || !user.email) {
      console.error('Unauthorized: No user or email.');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = businessInfoSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_INPUT', message: 'Invalid input', details: validation.error.errors } },
        { status: 400 }
      );
    }
    const validatedData = validation.data;

    // Find the business by email or businessId
    let business;
    if (user.businessId) {
      business = await prisma.business.findUnique({
        where: { id: user.businessId },
      });
    } else {
      business = await prisma.business.findUnique({
        where: { email: user.email },
      });
    }

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    // Update business information
    let updatedBusiness;
    try {
      // Parse current settings or use empty object
      let currentSettings: any = {};
      if (business.settings) {
        try {
          currentSettings = typeof business.settings === 'string' ? JSON.parse(business.settings) : business.settings;
        } catch (e) {
          console.error('Failed to parse business.settings:', e);
          currentSettings = {};
        }
      }
      // Update socialLinks in settings
      const newSettings = {
        ...currentSettings,
        socialLinks: validatedData.socialLinks,
      };
      updatedBusiness = await prisma.business.update({
        where: { id: business.id },
        data: {
          description: validatedData.description,
          logo: validatedData.logo,
          phone: validatedData.phone,
          address: validatedData.address,
          settings: newSettings,
        },
      });
    } catch (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_UPDATE_ERROR', message: 'Failed to update business information' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedBusiness.id,
        description: updatedBusiness.description,
        logo: updatedBusiness.logo,
        phone: updatedBusiness.phone,
        address: updatedBusiness.address,
        socialLinks: (updatedBusiness.settings as any)?.socialLinks,
      },
    });
  } catch (error) {
    console.error('POST /business/info error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'BUSINESS_UPDATE_ERROR', message: 'Failed to update business information' } },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🏢 Business info endpoint called');
    
    const user = getRequestAuthUser(request);
    
    if (!user) {
      console.log('❌ No valid JWT token found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('✅ Token valid for user:', user.name, 'isAdmin:', user.isAdmin, 'role:', user.role, 'businessId:', user.businessId);
    
    // 🚨 CRITICAL FIX: Get businessSlug from multiple sources
    const url = new URL(request.url);
    let requestedBusinessSlug = url.searchParams.get('businessSlug');
    console.log('🔍 Query businessSlug:', requestedBusinessSlug);
    
    // Try to get businessSlug from referer header
    const referer = request.headers.get('referer');
    console.log('🔍 Referer header:', referer);
    
    if (!requestedBusinessSlug && referer) {
      const refererUrl = new URL(referer);
      console.log('🔍 Referer pathname:', refererUrl.pathname);
      const pathMatch = refererUrl.pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
      console.log('🔍 Path match result:', pathMatch);
      if (pathMatch) {
        requestedBusinessSlug = pathMatch[1];
        console.log('🎯 Business slug from referer:', requestedBusinessSlug);
      }
    }
    
    // 🚀 NEW: Also try to get businessSlug from current request path (if it's a business route)
    if (!requestedBusinessSlug) {
      const currentPathMatch = url.pathname.match(/^\/([^\/]+)\/(staff|clients|dashboard|settings)/);
      if (currentPathMatch) {
        requestedBusinessSlug = currentPathMatch[1];
        console.log('🎯 Business slug from current path:', requestedBusinessSlug);
      }
    }
    
    let targetBusinessId = user.businessId;
    console.log('🎯 Initial targetBusinessId:', targetBusinessId);
    
    // If we have a specific business slug (from any source), use it
    if (requestedBusinessSlug) {
      console.log('🔍 Looking up business by slug:', requestedBusinessSlug);
      try {
        // Use real slug field from database
        const requestedBusiness = await prisma.business.findUnique({
          where: { slug: requestedBusinessSlug },
          select: { id: true, name: true, slug: true }
        });
        
        console.log('🔍 Database lookup result:', requestedBusiness);
        
        if (requestedBusiness) {
          console.log('✅ Business found by slug:', requestedBusiness.name);
          
          // Security check: only allow if user has permission
          if (user.isAdmin || user.businessId === requestedBusiness.id) {
            targetBusinessId = requestedBusiness.id;
            console.log('🎯 Updated targetBusinessId:', targetBusinessId);
          } else {
            console.log('❌ User does not have permission for this business');
            return NextResponse.json({ 
              success: false,
              error: 'Access denied to this business'
            }, { status: 403 });
          }
        } else {
          console.log('❌ Requested business not found:', requestedBusinessSlug);
          return NextResponse.json({ 
            success: false,
            error: 'Business not found'
          }, { status: 404 });
        }
      } catch (error) {
        console.error('❌ Error finding requested business:', error);
      }
    }
    
    console.log('🎯 Final targetBusinessId:', targetBusinessId);
    
    // Get business from database if businessId is available
    if (targetBusinessId) {
      try {
        const business = await prisma.business.findUnique({
          where: { id: targetBusinessId },
          select: {
            id: true,
            name: true,
            slug: true, // Include real slug field
            logo: true,
            description: true,
            phone: true,
            address: true,
            settings: true,
            allowStaffToViewAllBookings: true,
            restrictStaffToViewAllClients: true,
            restrictStaffToViewAllNotes: true,
            requireAdminCancelApproval: true
          }
        });
        
        if (business) {
          console.log('🏢 Returning business info from database:', business.name, 'slug:', business.slug);
          
          return NextResponse.json({ 
            success: true, 
            data: {
              id: business.id,
              name: business.name,
              logo: business.logo,
              slug: business.slug, // Include real slug field
              description: business.description,
              phone: business.phone,
              address: business.address,
              settings: business.settings,
              allowStaffToViewAllBookings: business.allowStaffToViewAllBookings,
              restrictStaffToViewAllClients: business.restrictStaffToViewAllClients,
              restrictStaffToViewAllNotes: business.restrictStaffToViewAllNotes,
              requireAdminCancelApproval: business.requireAdminCancelApproval
            }
          });
        }
      } catch (error) {
        console.error('❌ Database error:', error);
      }
    }
    
    // No business found in database - return error instead of potentially hardcoded JWT data
    console.log('❌ No business found for user:', user.email);
    
    return NextResponse.json({ 
      success: false,
      error: 'Business information not found in database'
    }, { status: 404 });
    
  } catch (error) {
    console.error('❌ Business info error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user?.businessId || (user.staffRole !== 'ADMIN' && user.role !== 'BUSINESS_OWNER')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const schema = z.object({
      name: z.string().optional(),
      allowStaffToViewAllBookings: z.boolean().optional(),
      restrictStaffToViewAllClients: z.boolean().optional(),
      restrictStaffToViewAllNotes: z.boolean().optional(),
      requireAdminCancelApproval: z.boolean().optional(),
    });

    const body = await request.json();
    const validatedData = schema.parse(body);

    const updatedBusiness = await prisma.business.update({
      where: { id: user.businessId },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: updatedBusiness });
  } catch (error) {
    console.error('[PATCH /api/business/info] error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// TODO: Add rate limiting middleware for abuse protection in the future. 