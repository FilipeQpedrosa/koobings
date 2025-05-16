import { format } from 'date-fns';

interface AppointmentTemplateData {
  serviceName: string;
  date: Date;
  time: string;
  businessName: string;
  providerName: string;
  patientName: string;
  cancellationReason?: string;
}

export const emailTemplates = {
  appointmentConfirmation: (data: AppointmentTemplateData) => ({
    subject: 'Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Your appointment is confirmed!</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
        </div>
        <p>If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</p>
        <p>We look forward to seeing you!</p>
      </div>
    `,
  }),

  appointmentReminder: (data: AppointmentTemplateData) => ({
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

  appointmentCancellation: (data: AppointmentTemplateData) => ({
    subject: 'Appointment Cancellation Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626;">Appointment Cancelled</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been cancelled successfully.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
          ${data.cancellationReason ? `<p><strong>Reason:</strong> ${data.cancellationReason}</p>` : ''}
        </div>
        <p>To schedule a new appointment, please visit our booking portal.</p>
      </div>
    `,
  }),

  appointmentRescheduled: (data: AppointmentTemplateData) => ({
    subject: 'Appointment Rescheduled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Appointment Rescheduled</h1>
        <p>Hello ${data.patientName},</p>
        <p>Your appointment has been rescheduled to the following time:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Provider:</strong> ${data.providerName}</p>
          <p><strong>Date:</strong> ${format(data.date, 'EEEE, MMMM d, yyyy')}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Location:</strong> ${data.businessName}</p>
        </div>
        <p>If this new time doesn't work for you, please contact us to find a better time.</p>
      </div>
    `,
  }),
}; 