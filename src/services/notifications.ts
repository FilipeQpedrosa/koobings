import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Initialize email transporter
const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export class NotificationService {
  async sendAppointmentConfirmation(appointmentId: string) {
    const appointment = await prisma.appointments.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
        staff: true,
        business: true
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const { client, service, staff, business } = appointment;
    const preferences = client.preferences as any || {};

    // Send email notification
    if (preferences.emailNotifications !== false) {
      await this.sendEmail({
        to: client.email,
        subject: 'Appointment Confirmation',
        html: this.getAppointmentConfirmationTemplate({
          clientName: client.name,
          serviceName: service.name,
          staffName: staff.name,
          businessName: business.name,
          startTime: appointment.scheduledFor,
          duration: appointment.duration
        })
      });
    }
  }

  async sendAppointmentReminder(appointmentId: string) {
    const appointment = await prisma.appointments.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        service: true,
        business: true
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const { client, service, business } = appointment;
    const preferences = client.preferences as any || {};

    // Send email reminder
    if (preferences.emailNotifications !== false) {
      await this.sendEmail({
        to: client.email,
        subject: 'Appointment Reminder',
        html: this.getAppointmentReminderTemplate({
          clientName: client.name,
          serviceName: service.name,
          businessName: business.name,
          startTime: appointment.scheduledFor
        })
      });
    }

    // Reminder status update removed (appointmentReminder model does not exist)
  }

  private async sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    try {
      await emailTransporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email notification');
    }
  }

  private getAppointmentConfirmationTemplate({
    clientName,
    serviceName,
    staffName,
    businessName,
    startTime,
    duration
  }: {
    clientName: string;
    serviceName: string;
    staffName: string;
    businessName: string;
    startTime: Date;
    duration: number;
  }) {
    const endTime = new Date(startTime.getTime() + duration * 60000);
    return `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${clientName},</p>
      <p>Your appointment has been confirmed:</p>
      <ul>
        <li>Service: ${serviceName}</li>
        <li>Provider: ${staffName}</li>
        <li>Business: ${businessName}</li>
        <li>Date: ${startTime.toLocaleDateString()}</li>
        <li>Time: ${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}</li>
      </ul>
      <p>Thank you for choosing ${businessName}!</p>
    `;
  }

  private getAppointmentConfirmationSMS({
    serviceName,
    businessName,
    startTime
  }: {
    serviceName: string;
    businessName: string;
    startTime: Date;
  }) {
    return `Your ${serviceName} appointment at ${businessName} is confirmed for ${startTime.toLocaleString()}. Thank you!`;
  }

  private getAppointmentReminderTemplate({
    clientName,
    serviceName,
    businessName,
    startTime
  }: {
    clientName: string;
    serviceName: string;
    businessName: string;
    startTime: Date;
  }) {
    return `
      <h2>Appointment Reminder</h2>
      <p>Dear ${clientName},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li>Service: ${serviceName}</li>
        <li>Business: ${businessName}</li>
        <li>Date: ${startTime.toLocaleDateString()}</li>
        <li>Time: ${startTime.toLocaleTimeString()}</li>
      </ul>
      <p>We look forward to seeing you!</p>
    `;
  }

  private getAppointmentReminderSMS({
    serviceName,
    businessName,
    startTime
  }: {
    serviceName: string;
    businessName: string;
    startTime: Date;
  }) {
    return `Reminder: Your ${serviceName} appointment at ${businessName} is scheduled for ${startTime.toLocaleString()}.`;
  }
} 