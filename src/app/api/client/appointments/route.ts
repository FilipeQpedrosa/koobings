import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('[CLIENT_APPOINTMENTS_POST] Starting...');
    
    const body = await request.json();
    console.log('[CLIENT_APPOINTMENTS_POST] Body:', body);
    
    const { businessSlug, clientName, clientEmail, clientPhone, serviceId, staffId, scheduledFor, notes } = body;

    // Validate required fields
    if (!businessSlug || !clientName || !clientEmail || !serviceId || !staffId || !scheduledFor) {
      console.log('[CLIENT_APPOINTMENTS_POST] Missing fields:', { businessSlug, clientName, clientEmail, serviceId, staffId, scheduledFor });
      return NextResponse.json(
        { success: false, error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    console.log('[CLIENT_APPOINTMENTS_POST] Finding business...');
    
    // Find business by slug
    const business = await prisma.business.findUnique({
      where: { slug: businessSlug },
      select: { id: true, name: true }
    });

    console.log('[CLIENT_APPOINTMENTS_POST] Business found:', business);

    if (!business) {
      return NextResponse.json(
        { success: false, error: { code: 'BUSINESS_NOT_FOUND', message: 'Business not found' } },
        { status: 404 }
      );
    }

    console.log('[CLIENT_APPOINTMENTS_POST] Finding service...');

    // Check if service exists and belongs to this business
    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        businessId: business.id
      }
    });

    console.log('[CLIENT_APPOINTMENTS_POST] Service found:', service);

    if (!service) {
      return NextResponse.json(
        { success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } },
        { status: 404 }
      );
    }

    console.log('[CLIENT_APPOINTMENTS_POST] Finding staff...');

    // Check if staff exists and belongs to this business
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        businessId: business.id
      }
    });

    console.log('[CLIENT_APPOINTMENTS_POST] Staff found:', staff);

    if (!staff) {
      return NextResponse.json(
        { success: false, error: { code: 'STAFF_NOT_FOUND', message: 'Staff member not found' } },
        { status: 404 }
      );
    }

    console.log('[CLIENT_APPOINTMENTS_POST] Finding/creating client...');

    // Find or create client
    let client = await prisma.client.findFirst({
      where: {
        email: clientEmail,
        businessId: business.id
      }
    });

    console.log('[CLIENT_APPOINTMENTS_POST] Existing client:', client);

    if (!client) {
      console.log('[CLIENT_APPOINTMENTS_POST] Creating new client...');
      // Create new client with real email (no unique modification)
      client = await prisma.client.create({
        data: {
          id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: clientName,
          email: clientEmail, // Use actual email address
          phone: clientPhone || null,
          businessId: business.id,
          updatedAt: new Date()
        }
      });
      console.log('[CLIENT_APPOINTMENTS_POST] New client created:', client);
    } else {
      // Client exists - check if name needs updating
      if (client.name !== clientName) {
        console.log('[CLIENT_APPOINTMENTS_POST] Updating client name from:', client.name, 'to:', clientName);
        client = await prisma.client.update({
          where: { id: client.id },
          data: {
            name: clientName,
            phone: clientPhone || client.phone, // Update phone if provided
            updatedAt: new Date()
          }
        });
        console.log('[CLIENT_APPOINTMENTS_POST] Client updated:', client);
      }
    }

    // Create appointment  
    const appointmentId = `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('[CLIENT_APPOINTMENTS_POST] Creating appointment with ID:', appointmentId);
    
    const appointment = await (prisma as any).appointments.create({
      data: {
        id: appointmentId,
        clientId: client.id,
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

    console.log('[CLIENT_APPOINTMENTS_POST] Appointment created:', appointment);

    // 🔔 SEND AUTOMATIC NOTIFICATIONS FOR NEW APPOINTMENT
    try {
      console.log('[CLIENT_APPOINTMENTS_POST] Sending automatic notifications...');
      console.log('[CLIENT_APPOINTMENTS_POST] Appointment ID:', appointment.id);
      console.log('[CLIENT_APPOINTMENTS_POST] Notification URL:', `https://koobings.com/api/appointments/${appointment.id}/notifications`);
      
      const notificationResponse = await fetch(`https://koobings.com/api/appointments/${appointment.id}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Request': 'true' // Mark as internal request
        },
        body: JSON.stringify({
          status: 'PENDING',
          sendEmail: true
        })
      });
      
      console.log('[CLIENT_APPOINTMENTS_POST] Notification response status:', notificationResponse.status);
      console.log('[CLIENT_APPOINTMENTS_POST] Notification response headers:', Object.fromEntries(notificationResponse.headers.entries()));
      
      if (notificationResponse.ok) {
        const notificationResult = await notificationResponse.json();
        console.log('[CLIENT_APPOINTMENTS_POST] ✅ Notifications sent successfully:', notificationResult);
      } else {
        const errorText = await notificationResponse.text();
        console.log('[CLIENT_APPOINTMENTS_POST] ⚠️ Notification sending failed:', notificationResponse.status, errorText);
      }
    } catch (error: any) {
      console.log('[CLIENT_APPOINTMENTS_POST] ⚠️ Notification error (non-blocking):', error);
      console.log('[CLIENT_APPOINTMENTS_POST] Error stack:', error?.stack);
      // Non-blocking error - don't fail the appointment creation
    }

    return NextResponse.json({
      success: true,
      data: {
        id: appointment.id,
        client: {
          id: client.id,
          name: client.name,
          email: clientEmail // Return original email, not the unique one
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
    console.error('[CLIENT_APPOINTMENTS_POST] Error:', error);
    console.error('[CLIENT_APPOINTMENTS_POST] Error details:', error.message);
    console.error('[CLIENT_APPOINTMENTS_POST] Error stack:', error.stack);
    return NextResponse.json(
      { success: false, error: { code: 'APPOINTMENT_CREATION_ERROR', message: 'Internal error', details: error.message } },
      { status: 500 }
    );
  }
} 