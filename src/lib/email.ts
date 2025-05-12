import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  return resend.emails.send({
    from: 'Service Scheduler <noreply@servicescheduler.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to Service Scheduler!</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${confirmLink}">${confirmLink}</a>
    `,
  });
}

export async function sendAppointmentConfirmation(
  email: string,
  appointment: {
    serviceName: string;
    date: string;
    time: string;
    businessName: string;
  }
) {
  return resend.emails.send({
    from: 'Service Scheduler <noreply@servicescheduler.com>',
    to: email,
    subject: 'Appointment Confirmation',
    html: `
      <h1>Your appointment is confirmed!</h1>
      <p>Here are your appointment details:</p>
      <ul>
        <li>Service: ${appointment.serviceName}</li>
        <li>Date: ${appointment.date}</li>
        <li>Time: ${appointment.time}</li>
        <li>Business: ${appointment.businessName}</li>
      </ul>
    `,
  });
}

export async function sendAppointmentReminder(
  email: string,
  appointment: {
    serviceName: string;
    date: string;
    time: string;
    businessName: string;
  }
) {
  return resend.emails.send({
    from: 'Service Scheduler <noreply@servicescheduler.com>',
    to: email,
    subject: 'Appointment Reminder',
    html: `
      <h1>Reminder: Your upcoming appointment</h1>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li>Service: ${appointment.serviceName}</li>
        <li>Date: ${appointment.date}</li>
        <li>Time: ${appointment.time}</li>
        <li>Business: ${appointment.businessName}</li>
      </ul>
    `,
  });
} 