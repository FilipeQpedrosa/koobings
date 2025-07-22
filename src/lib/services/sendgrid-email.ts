import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('⚠️ SENDGRID_API_KEY not found in environment variables');
} else {
  sgMail.setApiKey(apiKey);
  console.log('✅ SendGrid initialized successfully');
}

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendSendGridEmail({
  to,
  subject,
  html,
  text,
  from = process.env.SENDGRID_FROM_EMAIL || 'admin@koobings.com'
}: EmailParams) {
  try {
    console.log(`📧 [SENDGRID] Sending email to: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📧 [SENDGRID] Subject: ${subject}`);
    console.log(`📧 [SENDGRID] From: ${from}`);

    const msg = {
      to: Array.isArray(to) ? to : [to],
      from: {
        email: from,
        name: 'Koobings'
      },
      subject,
      html,
      text: text || subject // Fallback to subject if no text provided
    };

    console.log('📤 [SENDGRID] Sending email with SendGrid...');
    
    const response = await sgMail.send(msg);
    
    console.log('✅ [SENDGRID] Email sent successfully');
    console.log('📊 [SENDGRID] Response status:', response[0]?.statusCode);
    
    return {
      success: true,
      messageId: response[0]?.headers?.['x-message-id'] || 'unknown',
      response: response[0]
    };

  } catch (error: any) {
    console.error('❌ [SENDGRID] Error sending email:', error);
    
    // Enhanced error logging for SendGrid
    if (error.response) {
      console.error('❌ [SENDGRID] Response body:', error.response.body);
      console.error('❌ [SENDGRID] Response status:', error.response.status);
    }
    
    return {
      success: false,
      error: error.message || 'Unknown SendGrid error',
      details: error.response?.body || error
    };
  }
} 