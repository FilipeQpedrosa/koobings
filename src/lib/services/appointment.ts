import { prisma } from '@/lib/prisma';
import { addMinutes, parseISO, format, isSameDay } from 'date-fns';
import { AppointmentStatus, Prisma } from '@prisma/client';
import { ApiError } from '@/lib/api-handler';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface AppointmentCreationParams {
  serviceId: string;
  staffId: string;
  businessId: string;
  patientId: string;
  startTime: Date | string;
  notes?: string;
  createdBy: string;
}

export class AppointmentService {
  /**
   * Calculate available time slots for a given service, staff, and date
   */
  static async getAvailableTimeSlots(
    serviceId: string,
    staffId: string,
    date: string | Date,
    businessId: string
  ): Promise<TimeSlot[]> {
    const checkDate = typeof date === 'string' ? parseISO(date) : date;
    
    // Get service and staff details
    const [service, staff] = await Promise.all([
      prisma.service.findUnique({
        where: { 
          id: serviceId,
          businessId,
          isActive: true,
          isDeleted: false
        }
      }),
      prisma.staff.findUnique({
        where: { 
          id: staffId,
          businessId,
          isDeleted: false
        },
        include: {
          schedules: {
            where: { dayOfWeek: checkDate.getDay() }
          },
          availability: {
            where: { 
              date: checkDate,
              isDeleted: false
            }
          },
          appointments: {
            where: {
              startTime: {
                gte: checkDate,
                lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
              },
              status: {
                in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
              },
              isDeleted: false
            }
          }
        }
      })
    ]);

    if (!service || !staff) {
      throw new ApiError('NOT_FOUND', 'Service or staff member not found');
    }

    const schedule = staff.schedules[0];
    if (!schedule) {
      return []; // Staff not working on this day
    }

    // Check if staff has any availability exceptions
    const availabilityException = staff.availability[0];
    if (availabilityException && !availabilityException.isAvailable) {
      return []; // Staff marked as unavailable for this day
    }

    // Generate time slots
    const slots: TimeSlot[] = [];
    let currentTime = parseISO(`${format(checkDate, 'yyyy-MM-dd')}T${schedule.startTime}`);
    const endTime = parseISO(`${format(checkDate, 'yyyy-MM-dd')}T${schedule.endTime}`);

    while (currentTime < endTime) {
      const slotEndTime = addMinutes(currentTime, service.duration);
      
      // Check if slot is within business hours
      if (slotEndTime <= endTime) {
        const isAvailable = await this.isTimeSlotAvailable(
          currentTime,
          slotEndTime,
          staff.appointments,
          service.duration
        );

        slots.push({
          startTime: format(currentTime, 'HH:mm'),
          endTime: format(slotEndTime, 'HH:mm'),
          available: isAvailable
        });
      }

      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return slots;
  }

  /**
   * Check if a specific time slot is available
   */
  private static async isTimeSlotAvailable(
    start: Date,
    end: Date,
    existingAppointments: any[],
    duration: number
  ): Promise<boolean> {
    // Check if slot conflicts with any existing appointments
    const hasConflict = existingAppointments.some(appointment => {
      const appointmentStart = new Date(appointment.startTime);
      const appointmentEnd = new Date(appointment.endTime);

      return (
        (start >= appointmentStart && start < appointmentEnd) ||
        (end > appointmentStart && end <= appointmentEnd) ||
        (start <= appointmentStart && end >= appointmentEnd)
      );
    });

    return !hasConflict;
  }

  /**
   * Create a new appointment
   */
  static async createAppointment(params: AppointmentCreationParams) {
    const {
      serviceId,
      staffId,
      businessId,
      patientId,
      startTime,
      notes,
      createdBy
    } = params;

    // Get service details
    const service = await prisma.service.findUnique({
      where: { 
        id: serviceId,
        businessId,
        isActive: true,
        isDeleted: false
      }
    });

    if (!service) {
      throw new ApiError('NOT_FOUND', 'Service not found');
    }

    const appointmentStart = new Date(startTime);
    const appointmentEnd = addMinutes(appointmentStart, service.duration);

    // Check availability
    const isAvailable = await this.getAvailableTimeSlots(
      serviceId,
      staffId,
      appointmentStart,
      businessId
    );

    const requestedSlot = format(appointmentStart, 'HH:mm');
    const isSlotAvailable = isAvailable.some(
      slot => slot.startTime === requestedSlot && slot.available
    );

    if (!isSlotAvailable) {
      throw new ApiError('CONFLICT', 'Selected time slot is not available');
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: appointmentStart,
        endTime: appointmentEnd,
        status: AppointmentStatus.PENDING,
        notes,
        businessId,
        patientId,
        serviceId,
        staffId,
        createdBy,
        lastModifiedBy: createdBy,
        bufferTimeBefore: 15, // 15 minutes buffer before
        bufferTimeAfter: 15,  // 15 minutes buffer after
      },
      include: {
        service: true,
        staff: true,
        patient: true,
        business: true
      }
    });

    return appointment;
  }

  /**
   * Update an appointment's status
   */
  static async updateAppointmentStatus(
    appointmentId: string,
    status: AppointmentStatus,
    userId: string,
    reason?: string
  ) {
    const appointment = await prisma.appointment.findUnique({
      where: { 
        id: appointmentId,
        isDeleted: false
      }
    });

    if (!appointment) {
      throw new ApiError('NOT_FOUND', 'Appointment not found');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        lastModifiedBy: userId,
        ...(status === AppointmentStatus.CANCELLED && {
          cancellation: {
            create: {
              reason,
              cancelledBy: userId
            }
          }
        })
      },
      include: {
        service: true,
        staff: true,
        patient: true,
        business: true,
        cancellation: true
      }
    });

    return updatedAppointment;
  }
} 