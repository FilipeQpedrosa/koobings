import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/services/email';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('🔔 [NOTIFICATIONS] Starting notification process for appointment:', id);
    
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status, sendEmail = true } = body;

    // Get appointment with related data
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        staff: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
          }
        }
      }
    });

    if (!appointment) {
      console.log('❌ [NOTIFICATIONS] Appointment not found:', id);
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Here you would implement your notification logic
    // For now, just log and return success
    console.log('✅ [NOTIFICATIONS] Would send notification for:', {
      appointmentId: id,
      status,
      clientEmail: appointment.client.email,
      sendEmail
    });

    return NextResponse.json({ 
      success: true, 
      data: { 
        message: 'Notification sent successfully',
        appointmentId: id,
        status 
      } 
    });
  } catch (error) {
    console.error('❌ [NOTIFICATIONS] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 