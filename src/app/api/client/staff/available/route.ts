import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, isWithinInterval, areIntervalsOverlapping, parse, format } from 'date-fns';
import { Staff, Schedule } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');
    const date = searchParams.get('date');
    const time = searchParams.get('time'); // Expected format: "HH:mm"

    if (!serviceId || !date) {
      return NextResponse.json(
        { error: 'Service ID and date are required' },
        { status: 400 }
      );
    }

    const bookingDate = new Date(date);
    const dayStart = startOfDay(bookingDate);
    const dayEnd = endOfDay(bookingDate);
    const dayOfWeek = bookingDate.getDay();

    // If time is provided, set it on the booking date
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      bookingDate.setHours(hours, minutes, 0, 0);
    }

    // Get service details including duration and providers
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        duration: true,
        providers: {
          include: {
            schedules: {
              where: {
                dayOfWeek: dayOfWeek
              }
            },
            availability: {
              where: {
                date: {
                  gte: dayStart,
                  lte: dayEnd
                }
              }
            },
            appointments: {
              where: {
                startTime: {
                  gte: dayStart,
                  lte: dayEnd
                },
                status: {
                  not: 'CANCELLED'
                }
              },
              select: {
                startTime: true,
                endTime: true
              }
            }
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Process each provider's availability
    const availableStaff = service.providers.map((staff: any) => {
      const schedule = staff.schedules[0];
      const availability = staff.availability[0];
      
      // Check if staff has a schedule for this day
      let isAvailable = Boolean(schedule);

      if (isAvailable) {
        // Convert schedule times to Date objects for comparison
        const scheduleStart = parse(schedule.startTime, 'HH:mm', bookingDate);
        const scheduleEnd = parse(schedule.endTime, 'HH:mm', bookingDate);
        
        // If specific time is provided, check if it falls within schedule
        if (time) {
          const requestedTime = parse(time, 'HH:mm', bookingDate);
          const serviceEndTime = addMinutes(requestedTime, service.duration);
          
          isAvailable = isWithinInterval(requestedTime, { start: scheduleStart, end: scheduleEnd }) &&
                       isWithinInterval(serviceEndTime, { start: scheduleStart, end: scheduleEnd });
        }

        // Check availability exceptions
        if (availability) {
          isAvailable = availability.isAvailable;
        }

        // Check existing appointments for conflicts
        if (isAvailable && staff.appointments.length > 0) {
          const serviceEndTime = time 
            ? addMinutes(parse(time, 'HH:mm', bookingDate), service.duration)
            : addMinutes(bookingDate, service.duration); // Default to current time if no specific time

          isAvailable = !staff.appointments.some((appointment: { startTime: Date; endTime: Date }) => {
            if (!time) return false; // If no specific time, don't check appointments
            
            const appointmentStart = new Date(appointment.startTime);
            const appointmentEnd = new Date(appointment.endTime);
            const requestedTime = parse(time, 'HH:mm', bookingDate);
            
            return areIntervalsOverlapping(
              { start: requestedTime, end: serviceEndTime },
              { start: appointmentStart, end: appointmentEnd }
            );
          });
        }
      }

      return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        isAvailable,
        schedule: schedule ? {
          startTime: schedule.startTime,
          endTime: schedule.endTime
        } : null
      };
    });

    return NextResponse.json(availableStaff);
  } catch (error) {
    console.error('Error checking staff availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
} 