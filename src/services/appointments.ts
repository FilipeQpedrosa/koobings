import { PrismaClient, AppointmentStatus, Prisma } from '@prisma/client';
import { addMinutes, isWithinInterval, parseISO } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

const prisma = new PrismaClient();

export interface CreateAppointmentDTO {
  startTime: Date;
  patientId: string;
  serviceId: string;
  staffId: string;
  businessId: string;
  notes?: string;
  recurringPattern?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
    daysOfWeek?: number[];
    endDate?: Date;
  };
}

export interface UpdateAppointmentDTO {
  startTime?: Date;
  notes?: string;
  status?: AppointmentStatus;
}

export class AppointmentService {
  async create(data: CreateAppointmentDTO) {
    const service = await prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Calculate end time based on service duration
    const endTime = addMinutes(data.startTime, service.duration);

    // Check for conflicts
    await this.checkForConflicts(data.staffId, data.startTime, endTime);

    // Check business hours
    await this.checkBusinessHours(data.businessId, data.startTime, endTime);

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        startTime: data.startTime,
        endTime,
        status: 'PENDING',
        notes: data.notes,
        businessId: data.businessId,
        patientId: data.patientId,
        serviceId: data.serviceId,
        staffId: data.staffId,
        bufferTimeBefore: 15, // Default 15 minutes buffer
        bufferTimeAfter: 15,
      },
    });

    // Create recurring pattern if specified
    if (data.recurringPattern) {
      const recurringPattern = await prisma.recurringAppointment.create({
        data: {
          frequency: data.recurringPattern.frequency,
          interval: data.recurringPattern.interval,
          daysOfWeek: data.recurringPattern.daysOfWeek || [],
          startDate: data.startTime,
          endDate: data.recurringPattern.endDate,
          appointments: {
            connect: { id: appointment.id }
          }
        }
      });

      // Schedule future recurring appointments
      await this.scheduleRecurringAppointments(appointment, recurringPattern);
    }

    // Create reminder
    await this.createReminder(appointment.id);

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDTO) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { service: true }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (data.startTime) {
      const endTime = addMinutes(data.startTime, appointment.service.duration);
      await this.checkForConflicts(appointment.staffId, data.startTime, endTime, id);
      await this.checkBusinessHours(appointment.businessId, data.startTime, endTime);
    }

    return prisma.appointment.update({
      where: { id },
      data: {
        ...data,
        endTime: data.startTime ? addMinutes(data.startTime, appointment.service.duration) : undefined
      }
    });
  }

  async cancel(id: string, reason: string, cancelledBy: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Create cancellation record
    await prisma.appointmentCancellation.create({
      data: {
        appointmentId: id,
        reason,
        cancelledBy
      }
    });

    // Update appointment status
    return prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  }

  private async checkForConflicts(
    staffId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
  ) {
    const conflicts = await prisma.appointment.findMany({
      where: {
        staffId,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        id: excludeAppointmentId ? { not: excludeAppointmentId } : undefined,
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } }
            ]
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } }
            ]
          }
        ]
      }
    });

    if (conflicts.length > 0) {
      throw new Error('Time slot is not available');
    }
  }

  private async checkBusinessHours(
    businessId: string,
    startTime: Date,
    endTime: Date
  ) {
    const dayOfWeek = startTime.getDay();
    
    const businessHours = await prisma.businessHours.findFirst({
      where: {
        businessId,
        dayOfWeek,
        isOpen: true
      }
    });

    if (!businessHours) {
      throw new Error('Business is closed on this day');
    }

    const [startHour, startMinute] = businessHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = businessHours.endTime.split(':').map(Number);

    const businessStart = new Date(startTime);
    businessStart.setHours(startHour, startMinute, 0);

    const businessEnd = new Date(startTime);
    businessEnd.setHours(endHour, endMinute, 0);

    if (!isWithinInterval(startTime, { start: businessStart, end: businessEnd }) ||
        !isWithinInterval(endTime, { start: businessStart, end: businessEnd })) {
      throw new Error('Appointment time is outside business hours');
    }
  }

  private async createReminder(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            preferences: true
          }
        }
      }
    });

    if (!appointment) return;

    // Create email reminder
    if (appointment.patient.preferences?.emailNotifications) {
      await prisma.appointmentReminder.create({
        data: {
          appointmentId,
          type: 'EMAIL',
          status: 'PENDING'
        }
      });
    }

    // Create SMS reminder
    if (appointment.patient.preferences?.smsNotifications) {
      await prisma.appointmentReminder.create({
        data: {
          appointmentId,
          type: 'SMS',
          status: 'PENDING'
        }
      });
    }
  }

  private async scheduleRecurringAppointments(
    baseAppointment: any,
    pattern: any
  ) {
    // Implementation for scheduling recurring appointments
    // This would be handled by a separate scheduling service
    // that takes into account the recurring pattern
  }
} 