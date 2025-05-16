import { PrismaClient, AppointmentStatus, Prisma } from '@prisma/client';
import { addDays, addHours, isAfter, isBefore } from 'date-fns';
import { sendAppointmentReminder } from '../email';
import type { AppointmentWithRelations } from '../email';

export class NotificationScheduler {
  private prisma: PrismaClient;
  private isRunning: boolean = false;
  private intervalId?: NodeJS.Timeout;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async start() {
    if (this.isRunning) {
      console.log('Notification scheduler is already running');
      return;
    }

    this.isRunning = true;
    console.log('Starting notification scheduler...');

    // Check for appointments every 5 minutes
    this.intervalId = setInterval(() => this.checkAppointments(), 5 * 60 * 1000);

    // Run immediately on start
    await this.checkAppointments();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.isRunning = false;
    console.log('Notification scheduler stopped');
  }

  private async checkAppointments() {
    console.log('Checking for upcoming appointments...');

    try {
      const appointments = await this.prisma.appointment.findMany({
        where: {
          status: AppointmentStatus.CONFIRMED,
          startTime: {
            gt: new Date(), // Future appointments only
            lt: addDays(new Date(), 7), // Within next 7 days
          },
        },
        include: {
          client: {
            include: {
              sensitiveInfo: true,
            },
          },
          service: true,
          staff: true,
          business: true,
        },
      });

      console.log(`Found ${appointments.length} upcoming appointments`);

      for (const appointment of appointments) {
        await this.processAppointment(appointment);
      }
    } catch (error) {
      console.error('Error checking appointments:', error);
    }
  }

  private async processAppointment(appointment: AppointmentWithRelations) {
    try {
      // Check if client has email notifications enabled
      if (!appointment.client.sensitiveInfo?.email) {
        console.log(`Client ${appointment.client.id} has no email address`);
        return;
      }

      // Calculate when the reminder should be sent (24 hours before appointment)
      const reminderTime = addHours(appointment.startTime, -24);

      // If it's not time to send the reminder yet, skip
      if (isAfter(reminderTime, new Date())) {
        return;
      }

      // Check if we've already sent a reminder for this appointment
      const existingNotification = await this.prisma.notification.findFirst({
        where: {
          type: 'APPOINTMENT_REMINDER',
          appointmentId: appointment.id,
        },
      });

      if (existingNotification) {
        return;
      }

      // Send the reminder
      const result = await sendAppointmentReminder({ appointment });

      if (result.success) {
        // Record that we sent the reminder
        await this.prisma.notification.create({
          data: {
            type: 'APPOINTMENT_REMINDER',
            appointmentId: appointment.id,
            recipientId: appointment.client.id,
            status: 'SENT',
            channel: 'EMAIL',
            sentAt: new Date(),
          },
        });

        console.log(`Sent reminder for appointment ${appointment.id}`);
      } else {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, result.error);
      }
    } catch (error) {
      console.error(`Error processing appointment ${appointment.id}:`, error);
    }
  }
} 