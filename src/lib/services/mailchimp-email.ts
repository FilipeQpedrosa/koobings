import mailchimp from '@mailchimp/mailchimp_transactional';

// Initialize Mailchimp with API key
const apiKey = process.env.MAILCHIMP_API_KEY;
let mailchimpClient: any = null;

if (apiKey) {
  mailchimpClient = mailchimp(apiKey);
  console.log('✅ Mailchimp initialized successfully');
} else {
  console.error('⚠️ MAILCHIMP_API_KEY not found in environment variables');
}

export interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendMailchimpEmail({
  to,
  subject,
  html,
  text,
  from = process.env.MAILCHIMP_FROM_EMAIL || 'admin@koobings.com'
}: EmailParams) {
  try {
    if (!mailchimpClient) {
      throw new Error('Mailchimp client not initialized');
    }

    console.log(`📧 [MAILCHIMP] Sending email to: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`📧 [MAILCHIMP] Subject: ${subject}`);
    console.log(`📧 [MAILCHIMP] From: ${from}`);

    const recipients = Array.isArray(to) ? to : [to];
    
    const message = {
      html,
      text: text || subject,
      subject,
      from_email: from,
      from_name: 'Koobings',
      to: recipients.map(email => ({
        email,
        type: 'to'
      })),
      headers: {
        'Reply-To': from
      },
      important: false,
      track_opens: true,
      track_clicks: true,
      auto_text: true,
      auto_html: false,
      inline_css: true,
      url_strip_qs: false,
      preserve_recipients: false
    };

    console.log('📤 [MAILCHIMP] Sending email with Mailchimp Transactional...');
    
    const response = await mailchimpClient.messages.send({
      message
    });
    
    console.log('✅ [MAILCHIMP] Email sent successfully');
    console.log('📊 [MAILCHIMP] Response:', response);
    
    return {
      success: true,
      messageId: response[0]?._id || 'unknown',
      response: response[0]
    };

  } catch (error: any) {
    console.error('❌ [MAILCHIMP] Error sending email:', error);
    
    return {
      success: false,
      error: error.message || 'Unknown Mailchimp error',
      details: error
    };
  }
} 