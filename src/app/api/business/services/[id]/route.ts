import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export const dynamic = 'force-dynamic';

// DELETE: Delete a service completely from database
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🗑️ DELETE /api/business/services/[id] - Starting...');

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

    const serviceId = params.id;
    console.log('🗑️ Deleting service:', serviceId, 'for business:', businessId);

    // Check if service exists and belongs to business
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId 
      }
    });
    
    if (!service) {
      console.error('❌ Service not found:', serviceId);
      return NextResponse.json({ success: false, error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' } }, { status: 404 });
    }

    // Check for future appointments
    const futureAppointments = await prisma.appointments.count({
      where: {
        serviceId: serviceId,
        scheduledFor: {
          gte: new Date()
        }
      }
    });
    
    if (futureAppointments > 0) {
      console.warn('⚠️ Cannot delete service with future appointments:', futureAppointments);
      return NextResponse.json({ 
        success: false, 
        error: { 
          code: 'HAS_FUTURE_APPOINTMENTS', 
          message: `Cannot delete service. It has ${futureAppointments} future appointment(s). Please reschedule or cancel them first.` 
        } 
      }, { status: 400 });
    }

    // Count all appointments (past and future) for logging
    const totalAppointments = await prisma.appointments.count({
      where: { serviceId: serviceId }
    });

    console.log(`🗑️ Service has ${totalAppointments} total appointments (past and future)`);

    // Delete all appointments related to this service first
    if (totalAppointments > 0) {
      console.log('🗑️ Deleting all appointments for service...');
      await prisma.appointments.deleteMany({
        where: { serviceId: serviceId }
      });
      console.log(`✅ Deleted ${totalAppointments} appointments`);
    }

    // Now delete the service completely
    await prisma.service.delete({
      where: { id: serviceId }
    });

    console.log('✅ Service deleted successfully:', service.name);

    return NextResponse.json({ 
      success: true, 
      data: {
        message: 'Service deleted successfully',
        serviceName: service.name
      }
    });

  } catch (error: any) {
    console.error('❌ Error deleting service:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
}
