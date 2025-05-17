import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notifications';
import { CronJob } from 'cron';
import { addHours, subHours, isAfter } from 'date-fns';

const prisma = new PrismaClient();
const notificationService = new NotificationService();

export class SchedulerService {
  private reminderJob: CronJob;
  private cleanupJob: CronJob;

  constructor() {
    // Run reminder check every 5 minutes
    this.reminderJob = new CronJob('*/5 * * * *', () => {
      this.processReminders().catch(error => {
        console.error('Failed to process reminders:', error);
      });
    });

    // Run cleanup at 2 AM daily
    this.cleanupJob = new CronJob('0 2 * * *', () => {
      this.cleanupOldData().catch(error => {
        console.error('Failed to clean up old data:', error);
      });
    });
  }

  start() {
    this.reminderJob.start();
    this.cleanupJob.start();
    console.log('Scheduler service started');
  }

  stop() {
    this.reminderJob.stop();
    this.cleanupJob.stop();
    console.log('Scheduler service stopped');
  }

  private async processReminders() {
    try {
      const now = new Date();
      const appointments = await prisma.appointment.findMany({
        where: {
          status: 'CONFIRMED',
          startTime: {
            gt: now,
            lt: addHours(now, 24) // Next 24 hours
          },
          reminders: {
            none: {
              status: 'SENT',
              type: 'REMINDER'
            }
          }
        },
        include: {
          patient: {
            include: {
              preferences: true
            }
          }
        }
      });

      for (const appointment of appointments) {
        const { patient } = appointment;
        const reminderTime = patient.preferences?.reminderTime || 24; // Default 24 hours
        const shouldSendReminder = isAfter(
          appointment.startTime,
          addHours(now, reminderTime - 1) // Send reminder if within the reminder window
        );

        if (shouldSendReminder) {
          await notificationService.sendAppointmentReminder(appointment.id);
        }
      }
    } catch (error) {
      console.error('Error processing reminders:', error);
      throw error;
    }
  }

  private async cleanupOldData() {
    const retentionPeriod = 90; // 90 days
    const cutoffDate = subHours(new Date(), retentionPeriod * 24);

    try {
      // Archive old appointments
      await prisma.appointment.updateMany({
        where: {
          endTime: {
            lt: cutoffDate
          },
          status: {
            in: ['COMPLETED', 'CANCELLED', 'NO_SHOW']
          }
        },
        data: {
          isDeleted: true
        }
      });

      // Clean up old reminders
      await prisma.appointmentReminder.updateMany({
        where: {
          sentAt: {
            lt: cutoffDate
          }
        },
        data: {
          isDeleted: true
        }
      });

      // Clean up old access logs
      await prisma.dataAccessLog.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate
          }
        }
      });

      console.log('Cleanup completed successfully');
    } catch (error) {
      console.error('Error during cleanup:', error);
      throw error;
    }
  }

  // Method to manually trigger reminders (useful for testing)
  async triggerReminders() {
    await this.processReminders();
  }

  // Method to manually trigger cleanup (useful for testing)
  async triggerCleanup() {
    await this.cleanupOldData();
  }
} 