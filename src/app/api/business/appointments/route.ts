import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/business/appointments GET - Starting...');
    
    // Authentication check
    const user = getRequestAuthUser(request);
    if (!user) {
      console.error('❌ Unauthorized: No JWT token.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      console.error('❌ Missing business ID for user:', user.email);
      return NextResponse.json({ success: false, error: { code: 'MISSING_BUSINESS_ID', message: 'Missing business ID' } }, { status: 400 });
    }

    console.log('✅ User authenticated:', user.email, 'Business ID:', businessId);
    
    // Simple query to get appointments
    let appointments;
    try {
      console.log('🔍 Querying appointments for businessId:', businessId);
      appointments = await prisma.appointments.findMany({
        where: { businessId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      console.log('✅ Query successful, found:', appointments.length, 'appointments');
    } catch (queryError: any) {
      console.error('❌ Appointment query failed:', queryError);
      console.error('❌ Error details:', {
        name: queryError.name,
        message: queryError.message,
        code: queryError.code,
        meta: queryError.meta
      });
      return NextResponse.json({
        success: false,
        error: { code: 'QUERY_FAILED', message: 'Database query failed' }
      }, { status: 500 });
    }
    
    // Return simplified response
    return NextResponse.json({
      success: true,
      data: {
        appointments: appointments.map((apt: any) => ({
          id: apt.id,
          client: {
            id: apt.clientId || null,
            name: 'Cliente',
            email: null,
            phone: null
          },
          scheduledFor: apt.scheduledFor,
          status: apt.status || 'PENDING',
          notes: apt.notes || '',
          services: [{
            id: apt.serviceId || 'unknown',
            name: 'Serviço',
            duration: apt.duration || 60,
            price: 0
          }],
          staff: {
            id: apt.staffId || null,
            name: 'Staff'
          },
          duration: apt.duration || 60,
        })),
        total: appointments.length,
      }
    });
  } catch (error: any) {
    console.error('❌ Error in appointments API:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'APPOINTMENTS_FETCH_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}
