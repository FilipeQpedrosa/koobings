import { NextRequest, NextResponse } from 'next/server';
import { sendTwilioEmail } from '@/lib/services/twilio-email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    console.log('🔧 [TWILIO_TEST] Testing Twilio email with:', email);

    // Check environment variables
    const hasTwilioKey = !!process.env.TWILIO_SENDGRID_API_KEY;
    const hasSendGridKey = !!process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.TWILIO_FROM_EMAIL || 'noreply@koobings.com';

    console.log('🔑 [TWILIO_TEST] Twilio API Key exists:', hasTwilioKey);
    console.log('🔑 [TWILIO_TEST] SendGrid API Key exists:', hasSendGridKey);
    console.log('📧 [TWILIO_TEST] From email:', fromEmail);

    if (!hasTwilioKey && !hasSendGridKey) {
      return NextResponse.json({
        success: false,
        error: 'No Twilio SendGrid API key configured',
        config: { hasTwilioKey, hasSendGridKey, fromEmail }
      });
    }

    // Send test email
    const result = await sendTwilioEmail({
      to: email,
      subject: '[TWILIO TEST] Sistema de Email Koobings 🚀',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: #0070f3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .success { color: #0070f3; font-size: 18px; font-weight: bold; }
            .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Twilio Email Funciona!</h1>
          </div>
          <div class="content">
            <p class="success">✅ O sistema de emails via Twilio está configurado corretamente!</p>
            
            <h3>📋 Detalhes do Teste:</h3>
            <ul>
              <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</li>
              <li><strong>Email de origem:</strong> ${fromEmail}</li>
              <li><strong>Destinatário:</strong> ${email}</li>
              <li><strong>Serviço:</strong> Twilio SendGrid</li>
              <li><strong>Sistema:</strong> Koobings via Vercel</li>
            </ul>
            
            <h3>🚀 Sistema Pronto!</h3>
            <p>Agora podes:</p>
            <ul>
              <li>✅ Enviar confirmações de agendamento</li>
              <li>✅ Notificar clientes sobre lembretes</li>
              <li>✅ Comunicar com a equipa</li>
              <li>✅ Enviar emails promocionais</li>
            </ul>
          </div>
          <div class="footer">
            <p>Este email foi enviado via Twilio SendGrid • Sistema Koobings</p>
            <p>Não respondas a este email - é apenas um teste!</p>
          </div>
        </body>
        </html>
      `,
      text: `
        🎉 Twilio Email Funciona!
        
        ✅ O sistema de emails via Twilio está configurado corretamente!
        
        Detalhes:
        - Data/Hora: ${new Date().toLocaleString('pt-PT')}
        - Email origem: ${fromEmail}
        - Destinatário: ${email}
        - Serviço: Twilio SendGrid
        
        Sistema pronto para enviar emails!
      `
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Email Twilio enviado para ${email}`,
        messageId: result.messageId,
        statusCode: result.statusCode,
        config: { hasTwilioKey, hasSendGridKey, fromEmail }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        details: result.details,
        config: { hasTwilioKey, hasSendGridKey, fromEmail }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ [TWILIO_TEST] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 