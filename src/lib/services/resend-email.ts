import { Resend } from 'resend';

interface ResendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Configure Resend
let resend: Resend | null = null;

if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
} else {
  console.warn('⚠️ [RESEND_EMAIL] RESEND_API_KEY not found');
}

export async function sendResendEmail(options: ResendEmailOptions) {
  try {
    console.log('📧 [RESEND_EMAIL] Sending email to:', options.to);
    
    if (!resend) {
      console.error('❌ [RESEND_EMAIL] Resend not configured');
      return { success: false, error: 'Resend API key not found' };
    }

    // Use properly formatted sender email
    const fromEmail = options.from || process.env.RESEND_FROM_EMAIL || 'Koobings <onboarding@resend.dev>';
    
    // Convert to array if single email
    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    
    const results = [];
    
    for (const recipient of recipients) {
      try {
        console.log('📤 [RESEND_EMAIL] Sending to:', recipient);
        
        const response = await resend.emails.send({
          from: fromEmail,
          to: recipient,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });

        console.log('✅ [RESEND_EMAIL] Email sent to:', recipient);
        console.log('📊 [RESEND_EMAIL] Response:', response);

        results.push({
          recipient,
          success: true,
          id: response.data?.id,
          response: response
        });

      } catch (emailError: any) {
        console.error(`❌ [RESEND_EMAIL] Error sending to ${recipient}:`, emailError);
        
        results.push({
          recipient,
          success: false,
          error: emailError.message,
          details: emailError
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
    console.error('❌ [RESEND_EMAIL] General error:', error);
    
    return { 
      success: false, 
      error: error.message,
      details: error
    };
  }
}

// Helper function para compatibilidade com sistema atual
export async function sendEmail(options: { to: string; subject: string; html: string }) {
  return sendResendEmail(options);
} 