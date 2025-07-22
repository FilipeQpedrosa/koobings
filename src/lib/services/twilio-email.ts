import sgMail from '@sendgrid/mail';

interface TwilioEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Configure Twilio SendGrid API Key
if (process.env.TWILIO_SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.TWILIO_SENDGRID_API_KEY);
} else {
  console.warn('⚠️ [TWILIO_EMAIL] TWILIO_SENDGRID_API_KEY not found');
}

export async function sendTwilioEmail(options: TwilioEmailOptions) {
  try {
    console.log('📧 [TWILIO_EMAIL] Sending email to:', options.to);
    
    if (!process.env.TWILIO_SENDGRID_API_KEY) {
      console.error('❌ [TWILIO_EMAIL] Twilio SendGrid API key not found');
      return { success: false, error: 'Twilio SendGrid API key not found' };
    }

    const fromEmail = options.from || process.env.TWILIO_FROM_EMAIL || 'noreply@koobings.com';
    
    // Convert to array if single email
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const msg = {
          to: recipient,
          from: fromEmail,
          subject: options.subject,
          html: options.html,
          text: options.text || undefined,
        };

        console.log('📤 [TWILIO_EMAIL] Sending to:', recipient);
        
        const response = await sgMail.send(msg);
        
        console.log('✅ [TWILIO_EMAIL] Email sent to:', recipient);
        console.log('📊 [TWILIO_EMAIL] Response status:', response[0]?.statusCode);

        results.push({
          recipient,
          success: true,
          statusCode: response[0]?.statusCode,
          messageId: response[0]?.headers['x-message-id']
        });

      } catch (emailError: any) {
        console.error(`❌ [TWILIO_EMAIL] Error sending to ${recipient}:`, emailError);
        console.error(`❌ [TWILIO_EMAIL] Error details:`, emailError.response?.body);
        
        results.push({
          recipient,
          success: false,
          error: emailError.message,
          code: emailError.code,
          details: emailError.response?.body
        });
      }
    }

    const successfulSends = results.filter(r => r.success);
    const failedSends = results.filter(r => !r.success);

    if (successfulSends.length > 0) {
      return { 
        success: true, 
        results,
        successCount: successfulSends.length,
        failCount: failedSends.length
      };
    } else {
      return { 
        success: false, 
        error: 'All email sends failed',
        results
      };
    }

  } catch (error: any) {
    console.error('❌ [TWILIO_EMAIL] General error:', error);
    
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      details: error.response?.body
    };
  }
}

// Helper function para compatibilidade com sistema atual
export async function sendEmail(options: { to: string; subject: string; html: string }) {
  return sendTwilioEmail(options);
} 