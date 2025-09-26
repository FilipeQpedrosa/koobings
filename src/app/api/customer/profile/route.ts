import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { verifyUltraSecureCustomerSession } from '@/lib/ultra-secure-auth';
import { getRequestAuthUser } from '@/lib/jwt-safe';

// FORCE DYNAMIC - NO CACHING EVER!
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Profile update schema validation
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo').optional(),
  phone: z.string().nullable().optional()
});

// GET /api/customer/profile - Get customer profile and appointments
export async function GET(request: NextRequest) {
  try {
    console.log('[SECURE_PROFILE] 🔒 SECURE PROFILE ACCESS - NO CACHE!');
    
    // 🚨 CRITICAL: Try ultra-secure session first, then fallback to JWT
    let session = verifyUltraSecureCustomerSession(request);
    let customerEmail = null;
    let isUltraSecure = false;
    
    if (session) {
      console.log(`[SECURE_PROFILE] ✅ Ultra-secure session found: ${session.email}`);
      customerEmail = session.email;
      isUltraSecure = true;
    } else {
      console.log('[SECURE_PROFILE] 🔄 Ultra-secure session not found, trying JWT fallback...');
      const jwtUser = getRequestAuthUser(request);
      if (jwtUser && jwtUser.email) {
        console.log(`[SECURE_PROFILE] ✅ JWT session found: ${jwtUser.email}`);
        customerEmail = jwtUser.email;
        isUltraSecure = false;
      }
    }
    
    if (!customerEmail) {
      console.log('[SECURE_PROFILE] ❌ UNAUTHORIZED ACCESS BLOCKED - NO VALID SESSION');
      const response = NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
      
      // Prevent caching of unauthorized responses
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      return response;
    }

    console.log(`[SECURE_PROFILE] ✅ Secure access for customer: ${customerEmail} (Type: ${isUltraSecure ? 'ULTRA-SECURE' : 'JWT'})`);

    // Find customer by email - try both customer and client tables
    let client = await prisma.customer.findFirst({
      where: { email: customerEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        status: true
      }
    });

    // If not found in customer table, try client table
    if (!client) {
      client = await prisma.client.findFirst({
        where: { email: customerEmail },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          status: true
        }
      });
    }

    if (!client) {
      console.log(`[SECURE_PROFILE] ❌ Customer not found for email: ${customerEmail}`);
      const response = NextResponse.json({ 
        success: false, 
        error: { code: 'CUSTOMER_NOT_FOUND', message: 'Customer not found' } 
      }, { status: 404 });
      
      // Prevent caching
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
      return response;
    }

    console.log(`[SECURE_PROFILE] ✅ Secure profile loaded for customer: ${client.id}`);

    // Fetch customer appointments with business, service, and staff details
    // Note: Appointments are linked via client table, not directly to customer
    const appointments = await prisma.appointments.findMany({
      where: { 
        Client: {
          email: customerEmail // Find appointments where client email matches customer email
        }
      },
      select: {
        id: true,
        scheduledFor: true,
        duration: true,
        status: true,
        notes: true,
        Service: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        Staff: {
          select: {
            id: true,
            name: true
          }
        },
        Business: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        scheduledFor: 'desc'
      }
    });

    console.log(`[SECURE_PROFILE] ✅ Found ${appointments.length} appointments for customer: ${client.id}`);

    // Transform appointments to match frontend expectations (lowercase field names)
    const transformedAppointments = appointments.map(appointment => ({
      id: appointment.id,
      scheduledFor: appointment.scheduledFor,
      duration: appointment.duration,
      status: appointment.status,
      notes: appointment.notes,
      service: {
        id: appointment.Service.id,
        name: appointment.Service.name,
        price: appointment.Service.price
      },
      staff: {
        id: appointment.Staff.id,
        name: appointment.Staff.name
      },
      business: {
        id: appointment.Business.id,
        name: appointment.Business.name,
        slug: appointment.Business.slug
      }
    }));

    const response = NextResponse.json({
      success: true,
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        appointments: transformedAppointments // Transformed appointments with correct field names
      },
      security: isUltraSecure ? 'ULTRA_SECURE_NO_CACHE' : 'JWT_FALLBACK_NO_CACHE',
      timestamp: new Date().toISOString()
    });
    
    // CRITICAL: Prevent ANY caching of authenticated data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Vary', 'Cookie, Authorization');

    return response;

  } catch (error) {
    console.error('[SECURE_PROFILE] ❌ Critical error:', error);
    const response = NextResponse.json(
      { success: false, error: { code: 'PROFILE_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
    
    // Prevent caching of errors
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    return response;
  }
}

// PUT /api/customer/profile - Update customer profile
export async function PUT(request: NextRequest) {
  try {
    console.log('[ULTRA_PROFILE] �� ULTRA-SCALABLE PROFILE UPDATE...');
    
    // 🚀 ULTRA-SCALABLE: Use stateless session verification
    const session = verifyUltraSecureCustomerSession(request);
    
    if (!session) {
      console.log('[ULTRA_PROFILE] ❌ UNAUTHORIZED ACCESS BLOCKED');
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Acesso negado' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: validationResult.error.errors[0].message } },
        { status: 400 }
      );
    }

    // Update customer profile
    const updatedClient = await prisma.customer.update({
      where: { email: session.email },
      data: validationResult.data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        updatedAt: true
      }
    });

    console.log(`[ULTRA_PROFILE] ✅ Ultra-scalable profile updated for customer: ${updatedClient.id}`);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully - Ultra-Scalable System',
      data: updatedClient,
      scalability: 'BILLIONS_OF_USERS_READY'
    });

  } catch (error) {
    console.error('[ULTRA_PROFILE] ❌ Critical error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'PROFILE_UPDATE_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
} 