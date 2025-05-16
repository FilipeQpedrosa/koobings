import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { Appointment, Service, Staff, Business } from '@prisma/client';
import { sendEmail as sendEmailService } from '@/lib/services/email';

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions) {
  try {
    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@example.com', // Precisa ser um email verificado no SendGrid
      subject: options.subject,
      html: options.html,
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully');
    return { success: true, messageId: result[0]?.headers['x-message-id'] };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(
  businessEmail: string,
  businessName: string,
  status: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const subject = status === 'APPROVED'
    ? 'Your business has been approved!'
    : 'Business verification update';

  const text = status === 'APPROVED'
    ? `Congratulations! Your business "${businessName}" has been approved. You can now start using the platform.\n\n${notes ? `Notes: ${notes}` : ''}`
    : `Your business "${businessName}" verification status has been updated to ${status}.\n\n${notes ? `Notes: ${notes}` : ''}`;

  return sendEmail({
    to: businessEmail,
    subject,
    html: `<div style="font-family: Arial, sans-serif;">${text.replace(/\n/g, '<br>')}</div>`,
  });
}

export interface AppointmentWithRelations extends Appointment {
  client: {
    name: string;
    sensitiveInfo: {
      email: string;
    } | null;
  };
  service: Service;
  staff: Staff;
  business: Business;
}

export interface AppointmentEmailData {
  appointment: AppointmentWithRelations;
}

interface EmailTemplateData {
  serviceName: string;
  date: Date;
  time: string;
  businessName: string;
  providerName: string;
  patientName: string;
  cancellationReason?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
}

export const emailTemplates = {
  appointmentReminder: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Reminder: Upcoming Appointment',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Reminder</h1>
        <p>Hello ${data.patientName},</p>
        <p>This is a friendly reminder of your upcoming appointment:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
        </div>
        <p>Please arrive 5-10 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
      </div>
    `,
  }),

  appointmentConfirmation: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Confirmed</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been confirmed:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
        </div>
        <p>Please arrive 5-10 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
      </div>
    `,
  }),

  appointmentCancellation: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Appointment Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Appointment Cancelled</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been cancelled:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          ${data.cancellationReason ? `<p><strong>Reason:</strong> ${data.cancellationReason}</p>` : ''}
        </div>
        <p>If you would like to reschedule, please book a new appointment at your convenience.</p>
      </div>
    `,
  }),

  appointmentRescheduled: (data: EmailTemplateData): EmailTemplate => ({
    subject: 'Appointment Rescheduled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Rescheduled</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been rescheduled to:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
        </div>
        <p>Please arrive 5-10 minutes before your scheduled time.</p>
        <p>If you need to make any changes, please contact us at least 24 hours in advance.</p>
      </div>
    `,
  }),
};

export async function sendAppointmentConfirmation(data: AppointmentEmailData) {
  const template = emailTemplates.appointmentConfirmation({
    serviceName: data.appointment.service.name,
    date: data.appointment.startTime,
    time: format(data.appointment.startTime, 'HH:mm'),
    businessName: data.appointment.business.name,
    providerName: data.appointment.staff.name,
    patientName: data.appointment.client.name,
  });

  if (!data.appointment.client.sensitiveInfo?.email) {
    console.error('Client email not found');
    return { success: false, error: 'Client email not found' };
  }

  return sendEmailService({
    to: data.appointment.client.sensitiveInfo.email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentReminder(data: AppointmentEmailData) {
  const template = emailTemplates.appointmentReminder({
    serviceName: data.appointment.service.name,
    date: data.appointment.startTime,
    time: format(data.appointment.startTime, 'HH:mm'),
    businessName: data.appointment.business.name,
    providerName: data.appointment.staff.name,
    patientName: data.appointment.client.name,
  });

  if (!data.appointment.client.sensitiveInfo?.email) {
    console.error('Client email not found');
    return { success: false, error: 'Client email not found' };
  }

  return sendEmailService({
    to: data.appointment.client.sensitiveInfo.email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentCancellation(
  data: AppointmentEmailData & { cancellationReason?: string }
) {
  const template = emailTemplates.appointmentCancellation({
    serviceName: data.appointment.service.name,
    date: data.appointment.startTime,
    time: format(data.appointment.startTime, 'HH:mm'),
    businessName: data.appointment.business.name,
    providerName: data.appointment.staff.name,
    patientName: data.appointment.client.name,
    cancellationReason: data.cancellationReason,
  });

  if (!data.appointment.client.sensitiveInfo?.email) {
    console.error('Client email not found');
    return { success: false, error: 'Client email not found' };
  }

  return sendEmailService({
    to: data.appointment.client.sensitiveInfo.email,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAppointmentRescheduled(data: AppointmentEmailData) {
  const template = emailTemplates.appointmentRescheduled({
    serviceName: data.appointment.service.name,
    date: data.appointment.startTime,
    time: format(data.appointment.startTime, 'HH:mm'),
    businessName: data.appointment.business.name,
    providerName: data.appointment.staff.name,
    patientName: data.appointment.client.name,
  });

  if (!data.appointment.client.sensitiveInfo?.email) {
    console.error('Client email not found');
    return { success: false, error: 'Client email not found' };
  }

  return sendEmailService({
    to: data.appointment.client.sensitiveInfo.email,
    subject: template.subject,
    html: template.html,
  });
} 