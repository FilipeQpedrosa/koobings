import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('🧪 [SIMPLE_EMAIL_TEST] Testing with:', email);
    console.log('🔑 [SIMPLE_EMAIL_TEST] API Key exists:', !!process.env.SENDGRID_API_KEY);

    if (!process.env.SENDGRID_API_KEY) {
      return NextResponse.json({ 
        success: false, 
        error: 'SendGrid API key not found' 
      });
    }

    // Configure SendGrid
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Simple email message
    const msg = {
      to: email,
      from: 'noreply@service-scheduler.com', // Use the original fallback
      subject: '[SIMPLE TEST] Email System Test',
      text: 'This is a simple text email test from Koobings system.',
      html: `
        <h1>Simple Email Test</h1>
        <p>This is a simple HTML email test from Koobings system.</p>
        <p><strong>Time:</strong> ${new Date().toISOString()}</p>
        <p>If you receive this, the basic email system is working!</p>
      `
    };

    console.log('📧 [SIMPLE_EMAIL_TEST] Sending message:', JSON.stringify(msg, null, 2));

    // Send email
    const [response] = await sgMail.send(msg);
    
    console.log('✅ [SIMPLE_EMAIL_TEST] SendGrid response:', response.statusCode);
    console.log('📊 [SIMPLE_EMAIL_TEST] Response headers:', response.headers);

    return NextResponse.json({
      success: true,
      message: `Simple email sent to ${email}`,
      statusCode: response.statusCode,
      messageId: response.headers['x-message-id'] || 'unknown'
    });

  } catch (error: any) {
    console.error('❌ [SIMPLE_EMAIL_TEST] Error:', error);
    console.error('❌ [SIMPLE_EMAIL_TEST] Error body:', error.response?.body);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.response?.status,
      details: error.response?.body
    }, { status: 500 });
  }
} 