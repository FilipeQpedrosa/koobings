import { PrismaClient } from '@prisma/client';

interface Appointment {
  id: string;
  businessId: string;
  patientId: string;
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

  private async getPatientEmail(patientId: string): Promise<string> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient?.email) {
      throw new Error('Patient email not found');
    }

    return patient.email;
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

    const patientEmail = await this.getPatientEmail(appointment.patientId);
    const subject = 'Appointment Confirmation';
    const body = `Your appointment has been confirmed for ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString()}.`;

    return this.sendEmail(patientEmail, subject, body);
  }

  async sendAppointmentReminder(appointment: Appointment): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    const patientEmail = await this.getPatientEmail(appointment.patientId);
    const subject = 'Appointment Reminder';
    const body = `This is a reminder for your appointment tomorrow at ${appointment.startTime.toLocaleTimeString()}.`;

    return this.sendEmail(patientEmail, subject, body);
  }

  async sendAppointmentCancellation(appointment: Appointment): Promise<boolean> {
    if (!this.config.enabled) {
      console.log('Notifications disabled');
      return false;
    }

    const patientEmail = await this.getPatientEmail(appointment.patientId);
    const subject = 'Appointment Cancellation';
    const body = `Your appointment scheduled for ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString()} has been cancelled.`;

    return this.sendEmail(patientEmail, subject, body);
  }
} 