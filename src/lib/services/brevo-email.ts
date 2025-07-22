import * as SibApiV3Sdk from '@sendinblue/client';

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Initialize Brevo API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Set API key
const apiKey = process.env.BREVO_API_KEY;
if (apiKey) {
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  console.log('✅ Brevo initialized successfully');
} else {
  console.error('⚠️ BREVO_API_KEY not found in environment variables');
}

export async function sendBrevoEmail({
  to,
  subject,
  html,
  text,
  from = process.env.BREVO_FROM_EMAIL || 'admin@koobings.com'
}: EmailParams) {
  try {
    console.log(`📧 [BREVO] Sending email to: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📧 [BREVO] Subject: ${subject}`);
    console.log(`📧 [BREVO] From: ${from}`);

    // Prepare recipients
    const recipients = Array.isArray(to) ? 
      to.map(email => ({ email })) : 
      [{ email: to }];

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = {
      name: 'Koobings',
      email: from
    };
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.textContent = text || subject;

    console.log('📤 [BREVO] Sending email with Brevo...');
    
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('✅ [BREVO] Email sent successfully');
    console.log('📊 [BREVO] Message ID:', result.body?.messageId);
    
    return {
      success: true,
      messageId: result.body?.messageId || 'unknown',
      response: result.body
    };

  } catch (error: any) {
    console.error('❌ [BREVO] Error sending email:', error);
    return {
      success: false,
      error: error.message || 'Unknown Brevo error',
      details: error
    };
  }
} 