import sgMail from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Configure SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not found');
      return { success: false, error: 'SendGrid API key not found' };
    }

    const msg = {
      to: options.to,
      from: process.env.EMAIL_FROM || 'noreply@service-scheduler.com',
      subject: options.subject,
      html: options.html,
    };

    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
} 