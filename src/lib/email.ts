import sgMail from '@sendgrid/mail';
import { emailTemplates } from './email-templates';
import { format } from 'date-fns';
import type { Appointment, Service, Staff, Client, Business } from '@prisma/client';

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

export type AppointmentWithRelations = Appointment & {
  service: Service;
  staff: Staff;
  client: Client & {
    sensitiveInfo: {
      email: string;
    } | null;
  };
  business: Business;
};

interface AppointmentEmailData {
  appointment: AppointmentWithRelations;
}

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

  return sendEmail({
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

  return sendEmail({
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

  return sendEmail({
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

  return sendEmail({
    to: data.appointment.client.sensitiveInfo.email,
    subject: template.subject,
    html: template.html,
  });
} 