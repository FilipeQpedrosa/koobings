import { PrismaClient } from '@prisma/client';

interface Appointment {
  id: string;
  businessId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationConfig {
  enabled: boolean;
  provider: 'mock' | 'email';
}

export class NotificationService {
  private config: NotificationConfig;
  private prisma: PrismaClient;

  constructor(config: NotificationConfig) {
    this.config = config;
    this.prisma = new PrismaClient();
  }

  private async getClientEmail(clientId: string): Promise<string> {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId }
    });

    if (!client?.email) {
      throw new Error('Client email not found');
    }

    return client.email;
  }

  private async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    // Mock email sending
    console.log('📧 MOCK EMAIL SENT');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('Body:', body);
    return true;
  }

  async sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    const clientEmail = await this.getClientEmail(appointment.clientId);
    const subject = 'Appointment Confirmation';
    const body = `Your appointment has been confirmed for ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString()}.`;

    return this.sendEmail(clientEmail, subject, body);
  }

  async sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    const clientEmail = await this.getClientEmail(appointment.clientId);
    const subject = 'Appointment Reminder';
    const body = `This is a reminder for your appointment tomorrow at ${appointment.startTime.toLocaleTimeString()}.`;

    return this.sendEmail(clientEmail, subject, body);
  }

  async sendAppointmentCancellation(appointment: Appointment): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    const clientEmail = await this.getClientEmail(appointment.clientId);
    const subject = 'Appointment Cancellation';
    const body = `Your appointment scheduled for ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString()} has been cancelled.`;

    return this.sendEmail(clientEmail, subject, body);
  }
} 