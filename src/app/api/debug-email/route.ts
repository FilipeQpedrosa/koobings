import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [DEBUG_EMAIL] Starting email debug...');

    // Check environment variables
    const hasApiKey = !!process.env.SENDGRID_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'noreply@koobings.com';

    console.log('📧 [DEBUG_EMAIL] HasApiKey:', hasApiKey);
    console.log('📧 [DEBUG_EMAIL] EmailFrom:', emailFrom);

    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured',
        config: {
          hasApiKey: false,
          emailFrom
        }
      });
    }

    // Test sending a simple email
    const testEmail = 'admin@koobings.com';
    
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
      
      const msg = {
        to: testEmail,
        from: emailFrom,
        subject: '[DEBUG] Email Test - ' + new Date().toISOString(),
        html: `
          <h1>🔧 Email Debug Test</h1>
          <p>This is a debug email sent at: ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${emailFrom}</p>
          <p><strong>API Key configured:</strong> ${hasApiKey ? '✅ Yes' : '❌ No'}</p>
          <p>If you received this, the email system is working!</p>
        `
      };

      console.log('📧 [DEBUG_EMAIL] Attempting to send email...');
      console.log('📧 [DEBUG_EMAIL] Message:', JSON.stringify(msg, null, 2));

      const result = await sgMail.send(msg);
      
      console.log('✅ [DEBUG_EMAIL] Email sent successfully!');
      console.log('📧 [DEBUG_EMAIL] SendGrid response:', result);

      return NextResponse.json({
        success: true,
        message: 'Debug email sent successfully',
        config: {
          hasApiKey,
          emailFrom,
          testEmail
        },
        sendGridResponse: result[0]?.statusCode || 'unknown'
      });

    } catch (sendError) {
      console.error('❌ [DEBUG_EMAIL] SendGrid error:', sendError);
      
      return NextResponse.json({
        success: false,
        error: 'SendGrid send failed',
        details: sendError instanceof Error ? sendError.message : 'Unknown error',
        config: {
          hasApiKey,
          emailFrom,
          testEmail
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ [DEBUG_EMAIL] General error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        error: 'Email parameter required'
      }, { status: 400 });
    }

    // Test with custom email
    const hasApiKey = !!process.env.SENDGRID_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || 'noreply@koobings.com';

    if (!hasApiKey) {
      return NextResponse.json({
        success: false,
        error: 'SENDGRID_API_KEY not configured'
      });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    
    const msg = {
      to: email,
      from: emailFrom,
      subject: '[TESTE] Sistema de Email Funcionando! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success { color: #4CAF50; font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Email Recebido!</h1>
            </div>
            <div class="content">
              <p class="success">✅ O sistema de emails está a funcionar perfeitamente!</p>
              
              <h3>📋 Detalhes do Teste:</h3>
              <ul>
                <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</li>
                <li><strong>Email de origem:</strong> ${emailFrom}</li>
                <li><strong>Destinatário:</strong> ${email}</li>
                <li><strong>Sistema:</strong> SendGrid via Vercel</li>
              </ul>
              
              <h3>🚀 Próximos Passos:</h3>
              <p>Agora que confirmámos que o email funciona, podes:</p>
              <ul>
                <li>Integrar emails com agendamentos</li>
                <li>Personalizar templates</li>
                <li>Configurar notificações automáticas</li>
              </ul>
              
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                Este é um email de teste do sistema koobings.com
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await sgMail.send(msg);
    
    console.log('✅ [DEBUG_EMAIL] Custom email sent to:', email);

    return NextResponse.json({
      success: true,
      message: `Email de teste enviado para ${email}`,
      statusCode: result[0]?.statusCode || 'unknown'
    });

  } catch (error) {
    console.error('❌ [DEBUG_EMAIL] POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 