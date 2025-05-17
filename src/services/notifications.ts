import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

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

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export class NotificationService {
  async sendAppointmentConfirmation(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            preferences: true
          }
        },
        service: true,
        staff: true,
        business: true
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const { patient, service, staff, business } = appointment;

    // Send email notification
    if (patient.preferences?.emailNotifications) {
      await this.sendEmail({
        to: patient.email,
        subject: 'Appointment Confirmation',
        html: this.getAppointmentConfirmationTemplate({
          patientName: patient.name,
          serviceName: service.name,
          staffName: staff.name,
          businessName: business.name,
          startTime: appointment.startTime,
          endTime: appointment.endTime
        })
      });
    }

    // Send SMS notification
    if (patient.preferences?.smsNotifications && patient.phone) {
      await this.sendSMS({
        to: patient.phone,
        body: this.getAppointmentConfirmationSMS({
          serviceName: service.name,
          businessName: business.name,
          startTime: appointment.startTime
        })
      });
    }
  }

  async sendAppointmentReminder(appointmentId: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          include: {
            preferences: true
          }
        },
        service: true,
        business: true
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const { patient, service, business } = appointment;

    // Send email reminder
    if (patient.preferences?.emailNotifications) {
      await this.sendEmail({
        to: patient.email,
        subject: 'Appointment Reminder',
        html: this.getAppointmentReminderTemplate({
          patientName: patient.name,
          serviceName: service.name,
          businessName: business.name,
          startTime: appointment.startTime
        })
      });
    }

    // Send SMS reminder
    if (patient.preferences?.smsNotifications && patient.phone) {
      await this.sendSMS({
        to: patient.phone,
        body: this.getAppointmentReminderSMS({
          serviceName: service.name,
          businessName: business.name,
          startTime: appointment.startTime
        })
      });
    }

    // Update reminder status
    await prisma.appointmentReminder.updateMany({
      where: {
        appointmentId,
        status: 'PENDING'
      },
      data: {
        status: 'SENT',
        sentAt: new Date()
      }
    });
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

  private async sendSMS({ to, body }: { to: string; body: string }) {
    try {
      await twilioClient.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body
      });
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw new Error('Failed to send SMS notification');
    }
  }

  private getAppointmentConfirmationTemplate({
    patientName,
    serviceName,
    staffName,
    businessName,
    startTime,
    endTime
  }: {
    patientName: string;
    serviceName: string;
    staffName: string;
    businessName: string;
    startTime: Date;
    endTime: Date;
  }) {
    return `
      <h2>Appointment Confirmation</h2>
      <p>Dear ${patientName},</p>
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
    patientName,
    serviceName,
    businessName,
    startTime
  }: {
    patientName: string;
    serviceName: string;
    businessName: string;
    startTime: Date;
  }) {
    return `
      <h2>Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
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
    return `Reminder: Your ${serviceName} appointment at ${businessName} is tomorrow at ${startTime.toLocaleTimeString()}. See you then!`;
  }
} 