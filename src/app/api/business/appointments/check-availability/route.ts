import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 /api/business/appointments/check-availability POST - Starting...');
    
    const user = getRequestAuthUser(request);
    if (!user || !user.email) {
      console.error('❌ Unauthorized: No user or email.');
      return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } }, { status: 401 });
    }

    console.log('👤 User authenticated:', { email: user.email, role: user.role, businessId: user.businessId });

    // Get the staff member and their business or use business from session
    let businessId = user.businessId;
    
    if (!businessId && user.role === 'STAFF') {
      const staff = await prisma.staff.findUnique({
        where: { email: user.email },
        include: { Business: true }
      });
      businessId = staff?.Business?.id;
    }

    if (!businessId) {
      console.error('❌ No business ID found for user.');
      return NextResponse.json({ success: false, error: { code: 'NO_BUSINESS', message: 'No business found' } }, { status: 400 });
    }

    const body = await request.json();
    console.log('📋 Request body:', body);

    // Support both single time check and bulk time check
    if (body.timeSlots && Array.isArray(body.timeSlots)) {
      // BULK CHECK - Check multiple time slots at once
      console.log('🚀 Performing BULK availability check for', body.timeSlots.length, 'time slots');
      
      const { staffId, date, duration, timeSlots } = body;
      
      if (!staffId || !date || !duration || !timeSlots.length) {
        return NextResponse.json({ 
          success: false, 
          error: { code: 'MISSING_FIELDS', message: 'Missing required fields for bulk check' } 
        }, { status: 400 });
      }

      const results: {[key: string]: { available: boolean, reason?: string }} = {};
      
      // Get all existing appointments for this staff member on this date
      const existingAppointments = await prisma.appointments.findMany({
        where: {
          staffId: staffId,
          scheduledFor: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.999Z`)
          },
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        },
        select: {
          scheduledFor: true,
          duration: true
        }
      });

      console.log('📅 Found', existingAppointments.length, 'existing appointments for staff on', date);

      // Check each time slot
      for (const timeSlot of timeSlots) {
        const startTime = new Date(`${date}T${timeSlot}:00.000Z`);
        const endTime = new Date(startTime.getTime() + (duration * 60 * 1000));

        // Check for conflicts with existing appointments
        const hasConflict = existingAppointments.some(appointment => {
          const appointmentStart = new Date(appointment.scheduledFor);
          const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.duration * 60 * 1000));

          return (
            (startTime >= appointmentStart && startTime < appointmentEnd) ||
            (endTime > appointmentStart && endTime <= appointmentEnd) ||
            (startTime <= appointmentStart && endTime >= appointmentEnd)
          );
        });

        results[timeSlot] = {
          available: !hasConflict,
          reason: hasConflict ? 'Time slot conflicts with existing appointment' : undefined
        };
      }

      console.log('✅ Bulk check completed in single database query');
      return NextResponse.json({ 
        success: true, 
        data: { 
          type: 'bulk',
          results: results
        } 
      });
      
    } else {
      // SINGLE CHECK - Original functionality
      const { staffId, date, time, duration } = body;
      
      if (!staffId || !date || !time || !duration) {
        return NextResponse.json({ 
          success: false, 
          error: { code: 'MISSING_FIELDS', message: 'Missing required fields' } 
        }, { status: 400 });
      }

      console.log('🔍 Checking availability:', { staffId, date, time, duration });

      const startTime = new Date(`${date}T${time}:00.000Z`);
      const endTime = new Date(startTime.getTime() + (duration * 60 * 1000));

      console.log('⏰ Time range:', { startTime: startTime.toISOString(), endTime: endTime.toISOString() });

      // Check for conflicting appointments
      const conflictingAppointments = await prisma.appointments.findMany({
        where: {
          staffId: staffId,
          scheduledFor: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.999Z`)
          },
          status: {
            in: ['PENDING', 'CONFIRMED']
          }
        }
      });

      console.log('📋 Found', conflictingAppointments.length, 'existing appointments for staff on this date');

      const hasConflict = conflictingAppointments.some(appointment => {
        const appointmentStart = new Date(appointment.scheduledFor);
        const appointmentEnd = new Date(appointmentStart.getTime() + (appointment.duration * 60 * 1000));

        const conflict = (
          (startTime >= appointmentStart && startTime < appointmentEnd) ||
          (endTime > appointmentStart && endTime <= appointmentEnd) ||
          (startTime <= appointmentStart && endTime >= appointmentEnd)
        );

        if (conflict) {
          console.log('❌ Conflict found with appointment:', {
            appointmentId: appointment.id,
            appointmentStart: appointmentStart.toISOString(),
            appointmentEnd: appointmentEnd.toISOString(),
            requestedStart: startTime.toISOString(),
            requestedEnd: endTime.toISOString()
          });
        }

        return conflict;
      });

      const available = !hasConflict;
      console.log('🎯 Final availability result:', { available, hasConflict });

      return NextResponse.json({ 
        success: true, 
        data: { 
          available,
          reason: hasConflict ? 'Time slot conflicts with existing appointment' : undefined
        } 
      });
    }
  } catch (error) {
    console.error('❌ Error in check-availability:', error);
    return NextResponse.json({ 
      success: false, 
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } 
    }, { status: 500 });
  }
} 