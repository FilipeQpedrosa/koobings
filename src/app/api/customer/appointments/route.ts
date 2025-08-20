import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { verifyUltraSecureCustomerSession } from '@/lib/ultra-secure-auth';

// GET /api/customer/appointments - Get customer appointments
export async function GET(request: NextRequest) {
  try {
    // 🚨 DUAL AUTHENTICATION: Try ultra-secure session first, then JWT fallback
    let authUser = null;
    let customerEmail = null;
    let isUltraSecure = false;
    
    const ultraSecureSession = verifyUltraSecureCustomerSession(request);
    if (ultraSecureSession) {
      console.log('[CUSTOMER_APPOINTMENTS] ✅ Ultra-secure session found:', ultraSecureSession.email);
      authUser = { email: ultraSecureSession.email, name: ultraSecureSession.email.split('@')[0], role: 'CUSTOMER' };
      customerEmail = ultraSecureSession.email;
      isUltraSecure = true;
    } else {
      console.log('[CUSTOMER_APPOINTMENTS] 🔄 Ultra-secure session not found, trying JWT fallback...');
      const jwtUser = getRequestAuthUser(request);
      if (jwtUser && jwtUser.email) {
        console.log('[CUSTOMER_APPOINTMENTS] ✅ JWT session found:', jwtUser.email);
        authUser = jwtUser;
        customerEmail = jwtUser.email;
        isUltraSecure = false;
      }
    }
    
    if (!authUser || !customerEmail) {
      console.log('[CUSTOMER_APPOINTMENTS] ❌ No valid authentication found');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    console.log(`[CUSTOMER_APPOINTMENTS] ✅ Authenticated via ${isUltraSecure ? 'ULTRA-SECURE' : 'JWT'}:`, customerEmail);
    
    // Find customer by email
    const customer = await prisma.customer.findUnique({
      where: { email: customerEmail }
    });

    if (!customer) {
      return NextResponse.json({ success: false, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Customer not found' } }, { status: 404 });
    }

    // Find all clients with same email (across businesses) and their appointments
    const clients = await prisma.client.findMany({
      where: { email: customer.email },
      include: {
        appointments: {
          include: {
            Service: {
              select: {
                id: true,
                name: true,
                price: true,
                duration: true
              }
            },
            Staff: {
              select: {
                id: true,
                name: true,
                role: true
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
          orderBy: { scheduledFor: 'desc' }
        }
      }
    });

    // Flatten all appointments from all clients
    const allAppointments = clients.flatMap(client => client.appointments);

    return NextResponse.json({ 
      success: true, 
      data: {
        appointments: allAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching customer appointments:', error);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENTS_FETCH_ERROR', message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[CUSTOMER_APPOINTMENTS_POST] Starting...');
    
    // 🚨 DUAL AUTHENTICATION: Try ultra-secure session first, then JWT fallback
    let authUser = null;
    let customerEmail = null;
    let customerName = null;
    let isUltraSecure = false;
    
    const ultraSecureSession = verifyUltraSecureCustomerSession(request);
    if (ultraSecureSession) {
      console.log('[CUSTOMER_APPOINTMENTS_POST] ✅ Ultra-secure session found:', ultraSecureSession.email);
      authUser = { email: ultraSecureSession.email, name: ultraSecureSession.email.split('@')[0], role: 'CUSTOMER' };
      customerEmail = ultraSecureSession.email;
      customerName = ultraSecureSession.email.split('@')[0];
      isUltraSecure = true;
    } else {
      console.log('[CUSTOMER_APPOINTMENTS_POST] 🔄 Ultra-secure session not found, trying JWT fallback...');
      const jwtUser = getRequestAuthUser(request);
      if (jwtUser && jwtUser.email) {
        console.log('[CUSTOMER_APPOINTMENTS_POST] ✅ JWT session found:', jwtUser.email);
        authUser = jwtUser;
        customerEmail = jwtUser.email;
        customerName = jwtUser.name || jwtUser.email.split('@')[0];
        isUltraSecure = false;
      }
    }
    
    if (!authUser || !customerEmail) {
      console.log('[CUSTOMER_APPOINTMENTS_POST] ❌ No valid authentication found');
      return NextResponse.json(
        { success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'You must be logged in to book an appointment' } },
        { status: 401 }
      );
    }

    console.log(`[CUSTOMER_APPOINTMENTS_POST] ✅ Authenticated via ${isUltraSecure ? 'ULTRA-SECURE' : 'JWT'}:`, customerEmail);
    
    const body = await request.json();
    console.log('[CUSTOMER_APPOINTMENTS_POST] Body received:', body);
    
    const { businessSlug, serviceId, staffId, scheduledFor, notes } = body;

    // Use authenticated customer data (already declared above)
    // customerName and customerEmail are already set from authentication

    // Validate required fields
    if (!businessSlug || !serviceId || !staffId || !scheduledFor) {
      console.log('[CUSTOMER_APPOINTMENTS_POST] ❌ Missing required fields:', { businessSlug, serviceId, staffId, scheduledFor });
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    console.log('[CUSTOMER_APPOINTMENTS_POST] Finding business...');
    
    // Find business by slug
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      select: { id: true, name: true }
    });

    console.log('[CUSTOMER_APPOINTMENTS_POST] Business found:', business);

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    console.log('[CUSTOMER_APPOINTMENTS_POST] Finding service...');

    // Find service by ID
    console.log('[CUSTOMER_APPOINTMENTS_POST] Service lookup - serviceId:', serviceId);
    
    let service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    console.log('[CUSTOMER_APPOINTMENTS_POST] Service found:', service);

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    console.log('[CUSTOMER_APPOINTMENTS_POST] Finding staff...');

    // Check if staff exists and belongs to this business
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId: business.id
      }
    });

    console.log('[CUSTOMER_APPOINTMENTS_POST] Staff found:', staff);

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } },
        { status: 404 }
      );
    }

    console.log('[CUSTOMER_APPOINTMENTS_POST] Finding/creating customer and client...');

    // 1. Find authenticated customer (must exist since user is logged in)
    const customer = await prisma.customer.findUnique({
      where: { email: customerEmail }
    });

    if (!customer) {
      console.error('[CUSTOMER_APPOINTMENTS_POST] ❌ Authenticated customer not found in database:', customerEmail);
      return NextResponse.json(
        { success: false, error: { code: 'CUSTOMER_NOT_FOUND', message: 'Customer account not found' } },
        { status: 404 }
      );
    }

    console.log('[CUSTOMER_APPOINTMENTS_POST] ✅ Authenticated customer found:', customer.name);

    // 2. Find or create client (per-business relationship) using authenticated customer data
    let client = await prisma.client.findFirst({
      where: {
        email: customerEmail,
        businessId: business.id
      }
    });

    console.log('[CUSTOMER_APPOINTMENTS_POST] Existing client:', client);

    if (!client) {
      console.log('[CUSTOMER_APPOINTMENTS_POST] Creating new client for authenticated customer...');
      // Create new client using authenticated customer data
      client = await prisma.client.create({
        data: {
          id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: customer.name || customerName || 'Customer', // Use real customer name first, then fallback
          email: customerEmail!, // Use authenticated customer email (ensured not null above)
          phone: customer.phone, // Use customer's phone from their account
          businessId: business.id,
          updatedAt: new Date()
        }
      });
      console.log('[CUSTOMER_APPOINTMENTS_POST] New client created for authenticated customer:', client);
    } else {
      // Client exists - sync with latest customer data
      if (client.name !== customer.name || client.phone !== customer.phone) {
        console.log('[CUSTOMER_APPOINTMENTS_POST] Syncing client data with customer account...');
        client = await prisma.client.update({
          where: { id: client.id },
          data: {
            name: customer.name || customerName || 'Customer', // Always use real customer name first
            phone: customer.phone, // Always use latest customer phone
            updatedAt: new Date()
          }
        });
        console.log('[CUSTOMER_APPOINTMENTS_POST] Client synced with customer data:', client);
      }
    }

    // Create appointment using client (existing schema)
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('[CUSTOMER_APPOINTMENTS_POST] Creating appointment with ID:', appointmentId);
    
    const appointment = await prisma.appointments.create({
      data: {
        id: appointmentId,
        clientId: client.id, // Use client for appointment (current schema)
        serviceId: service.id,
        staffId: staff.id,
        businessId: business.id,
        scheduledFor: new Date(scheduledFor),
        duration: service.duration,
        notes: notes || null,
        status: 'PENDING',
        updatedAt: new Date()
      }
    });

    console.log('[CUSTOMER_APPOINTMENTS_POST] Appointment created:', appointment);

    // Send automatic notifications for new appointment
    try {
      console.log('[CUSTOMER_APPOINTMENTS_POST] Sending automatic notifications...');
      
      const notificationResponse = await fetch(`https://koobings.com/api/appointments/${appointment.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true'
        },
        body: JSON.stringify({
          status: 'PENDING',
          sendEmail: true
        })
      });
      
      console.log('[CUSTOMER_APPOINTMENTS_POST] Notification response status:', notificationResponse.status);
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('[CUSTOMER_APPOINTMENTS_POST] ✅ Notifications sent successfully:', notificationResult);
      } else {
        const errorText = await notificationResponse.text();
        console.log('[CUSTOMER_APPOINTMENTS_POST] ⚠️ Notification sending failed:', notificationResponse.status, errorText);
      }
    } catch (error: any) {
      console.log('[CUSTOMER_APPOINTMENTS_POST] ⚠️ Notification error (non-blocking):', error);
      // Non-blocking error - don't fail the appointment creation
    }

    return NextResponse.json({
      success: true,
      data: {
        id: appointment.id,
        customer: {
          id: customer.id,
          name: customer.name,
          email: customerEmail
        },
        client: {
          id: client.id,
          name: client.name,
          email: customerEmail
        },
        service: {
          id: service.id,
          name: service.name,
          duration: service.duration,
          price: service.price
        },
        staff: {
          id: staff.id,
          name: staff.name
        },
        scheduledFor: appointment.scheduledFor,
        status: appointment.status,
        notes: appointment.notes
      }
    });
  } catch (error: any) {
    console.error('[CUSTOMER_APPOINTMENTS_POST] Error:', error);
    console.error('[CUSTOMER_APPOINTMENTS_POST] Error details:', error.message);
    console.error('[CUSTOMER_APPOINTMENTS_POST] Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_CREATION_ERROR', message: 'Internal error', details: error.message } },
      { status: 500 }
    );
  }
} 