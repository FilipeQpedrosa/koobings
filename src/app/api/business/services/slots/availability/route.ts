import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

/**
 * GET /api/business/services/slots/availability
 * 
 * Retorna disponibilidade de slots para um mês específico
 * 
 * Query params:
 * - year: Ano (ex: 2025)
 * - month: Mês (ex: 9)
 * - businessSlug: Slug do negócio
 */
export async function GET(request: NextRequest) {
  try {
    console.log('📅 [CALENDAR-SLOTS] Starting month slots fetch...');

    // Authentication check
    const user = getRequestAuthUser(request);
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } 
      }, { status: 401 });
    }

    const businessId = user.businessId;
    if (!businessId) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'BUSINESS_ID_MISSING', message: 'Business ID missing' } 
      }, { status: 400 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const businessSlug = searchParams.get('businessSlug');

    if (!year || !month) {
      return NextResponse.json({ 
        success: false, 
        error: { code: 'MISSING_PARAMS', message: 'Year and month are required' } 
      }, { status: 400 });
    }

    console.log('📅 [CALENDAR-SLOTS] Request params:', { year, month, businessSlug });

    // Get all services for this business
    const services = await prisma.service.findMany({
      where: { 
        businessId,
        isActive: true, // Only get active services
      },
      select: {
        id: true,
        name: true,
        duration: true,
        price: true,
        slots: true,
        startTime: true,
        endTime: true,
        maxCapacity: true,
        availableDays: true,
      }
    });

    console.log('📅 [CALENDAR-SLOTS] Found services:', services.length);

    // Generate month data
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    
    const monthData: { [key: string]: any[] } = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(yearNum, monthNum - 1, day);
      const dayOfWeek = date.getDay();
      const dateString = date.toISOString().split('T')[0];
      
      // Get slots for this day
      const daySlots: any[] = [];
      
      for (const service of services) {
        // Check if service is available on this day
        const availableDays = service.availableDays as number[] || [];
        
        console.log(`📅 [CALENDAR-SLOTS] Day ${day} (${dateString}): dayOfWeek=${dayOfWeek}, availableDays=${JSON.stringify(availableDays)}, includes=${availableDays.includes(dayOfWeek)}`);
        
        if (availableDays.includes(dayOfWeek)) {
          // Generate slots for this service on this day
          const slots = service.slots as any;
          
          if (slots && typeof slots === 'object' && !Array.isArray(slots)) {
            // New format: object with day names as keys
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayName = dayNames[dayOfWeek];
            
            if (slots[dayName] && Array.isArray(slots[dayName]) && slots[dayName].length > 0) {
              console.log(`📅 [CALENDAR-SLOTS] Found slots for ${dayName}: ${slots[dayName].length} slots`);
              slots[dayName].forEach((slot: any) => {
                daySlots.push({
                  id: `${service.id}-${dayOfWeek}-${slot.startTime}`,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  serviceName: service.name,
                  staffName: 'Staff Member', // Default for now
                  capacity: slot.capacity || service.maxCapacity || 1,
                  booked: 0, // TODO: Get actual bookings
                  available: true,
                  serviceId: service.id,
                  price: service.price,
                  duration: service.duration
                });
              });
            } else {
              console.log(`📅 [CALENDAR-SLOTS] No slots found for ${dayName}`);
            }
          } else {
            // No slots defined, generate slots based on service configuration
            const startTime = service.startTime || '09:00';
            const endTime = service.endTime || '18:00';
            const serviceDuration = service.duration || 60; // Use actual service duration
            
            // Generate slots based on service duration, not fixed 30-minute intervals
            const startHour = parseInt(startTime.split(':')[0]);
            const startMinute = parseInt(startTime.split(':')[1]);
            const endHour = parseInt(endTime.split(':')[0]);
            const endMinute = parseInt(endTime.split(':')[1]);
            
            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;
            
            for (let minutes = startMinutes; minutes < endMinutes; minutes += serviceDuration) {
              const slotHour = Math.floor(minutes / 60);
              const slotMinute = minutes % 60;
              const slotStartTime = `${slotHour.toString().padStart(2, '0')}:${slotMinute.toString().padStart(2, '0')}`;
              const slotEndMinutes = minutes + serviceDuration;
              const slotEndHour = Math.floor(slotEndMinutes / 60);
              const slotEndMinute = slotEndMinutes % 60;
              const slotEndTime = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;
              
              // Only add slot if it fits within the end time
              if (slotEndMinutes <= endMinutes) {
                daySlots.push({
                  id: `${service.id}-${dayOfWeek}-${slotStartTime}`,
                  startTime: slotStartTime,
                  endTime: slotEndTime,
                  serviceName: service.name,
                  staffName: 'Staff Member',
                  capacity: service.maxCapacity || 1,
                  booked: 0,
                  available: true,
                  serviceId: service.id,
                  price: service.price,
                  duration: serviceDuration
                });
              }
            }
          }
        }
      }

      // Sort slots by start time
      daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

      console.log(`📅 [CALENDAR-SLOTS] Final result for ${dateString}: ${daySlots.length} slots`);
      monthData[dateString] = daySlots;
    }

    console.log('📅 [CALENDAR-SLOTS] Generated month data:', Object.keys(monthData).length, 'days');

    return NextResponse.json({
      success: true,
      data: monthData
    });

  } catch (error: any) {
    console.error('❌ [CALENDAR-SLOTS] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: { 
        code: 'CALENDAR_SLOTS_ERROR', 
        message: error.message || 'Internal Server Error' 
      } 
    }, { status: 500 });
  }
} 