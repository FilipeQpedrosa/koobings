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
  clientId: string;
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
      prisma.service.findFirst({
        where: { 
          id: serviceId,
          businessId
        }
      }),
      prisma.staff.findFirst({
        where: { 
          id: staffId,
          businessId
        }
      })
    ]);

    if (!service || !staff) {
      throw new ApiError('NOT_FOUND', 'Service or staff member not found');
    }

    // Fetch staff appointments for the day
    const appointments = await prisma.appointment.findMany({
      where: {
        staffId: staff.id,
        scheduledFor: {
          gte: new Date(format(checkDate, 'yyyy-MM-ddT00:00:00')),
          lt: new Date(format(checkDate, 'yyyy-MM-ddT23:59:59')),
        },
        status: {
          in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]
        }
      }
    });

    // Generate time slots (example: 9am-5pm, 30min intervals)
    // You may want to fetch working hours from StaffAvailability or another source
    const startHour = 9;
    const endHour = 17;
    const slots: TimeSlot[] = [];
    let currentTime = new Date(checkDate);
    currentTime.setHours(startHour, 0, 0, 0);
    const endTime = new Date(checkDate);
    endTime.setHours(endHour, 0, 0, 0);

    while (currentTime < endTime) {
      const slotEndTime = addMinutes(currentTime, service.duration);
      if (slotEndTime > endTime) break;
      // Check for conflicts
      const hasConflict = appointments.some(appointment => {
        const appointmentStart = new Date(appointment.scheduledFor);
        const appointmentEnd = addMinutes(appointmentStart, appointment.duration);
        return (
          (currentTime >= appointmentStart && currentTime < appointmentEnd) ||
          (slotEndTime > appointmentStart && slotEndTime <= appointmentEnd) ||
          (currentTime <= appointmentStart && slotEndTime >= appointmentEnd)
        );
      });
      slots.push({
        startTime: format(currentTime, 'HH:mm'),
        endTime: format(slotEndTime, 'HH:mm'),
        available: !hasConflict
      });
      currentTime = addMinutes(currentTime, 30);
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
      clientId,
      startTime,
      notes,
      createdBy
    } = params;

    // Get service details
    const service = await prisma.service.findFirst({
      where: { 
        id: serviceId,
        businessId
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
        scheduledFor: appointmentStart,
        duration: service.duration,
        status: AppointmentStatus.PENDING,
        notes,
        businessId,
        clientId,
        serviceId,
        staffId,
      },
      include: {
        service: true,
        staff: true,
        client: true,
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
        id: appointmentId
      }
    });

    if (!appointment) {
      throw new ApiError('NOT_FOUND', 'Appointment not found');
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status
      },
      include: {
        service: true,
        staff: true,
        client: true,
        business: true
      }
    });

    return updatedAppointment;
  }
} 