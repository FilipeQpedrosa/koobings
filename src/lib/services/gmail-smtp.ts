import nodemailer from 'nodemailer';

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App-specific password
  },
});

export async function sendGmailEmail({
  to,
  subject,
  html,
  text,
  from = process.env.GMAIL_USER || 'admin@koobings.com'
}: EmailParams) {
  try {
    console.log(`📧 [GMAIL_SMTP] Sending email to: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📧 [GMAIL_SMTP] Subject: ${subject}`);
    console.log(`📧 [GMAIL_SMTP] From: ${from}`);

    const mailOptions = {
      from: `Koobings <${from}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      text: text || subject
    };

    console.log('📤 [GMAIL_SMTP] Sending email with Gmail SMTP...');
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ [GMAIL_SMTP] Email sent successfully');
    console.log('📊 [GMAIL_SMTP] Message ID:', result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result
    };

  } catch (error: any) {
    console.error('❌ [GMAIL_SMTP] Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Unknown Gmail SMTP error',
      details: error
    };
  }
} 