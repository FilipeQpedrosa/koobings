import { NextRequest, NextResponse } from 'next/server';
import { sendBrevoEmail } from '@/lib/services/brevo-email';

export async function GET() {
  try {
    console.log('🧪 [BREVO_TEST] Testing Brevo email sending...');
    
    const result = await sendBrevoEmail({
      to: 'admin@koobings.com',
      subject: '🚀 Teste Brevo - Sistema Funcionando!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #059669; text-align: center;">🚀 Teste Brevo Sucesso!</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>✅ Sistema de Email Funcionando</h2>
            <p><strong>Serviço:</strong> Brevo (ex-SendinBlue)</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
            <p><strong>Status:</strong> ✅ Enviado com sucesso!</p>
            <p><strong>Limite Grátis:</strong> 300 emails/dia</p>
          </div>
          <p style="text-align: center; color: #666;">
            Este email confirma que o sistema de notificações está operacional.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #059669; font-weight: bold;">
              🎉 Brevo é uma excelente escolha para emails transacionais!
            </p>
          </div>
        </div>
      `,
      text: 'Teste Brevo - Sistema funcionando!'
    });
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Brevo' : 'Failed to send email',
      details: result,
      service: 'Brevo',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ [BREVO_TEST] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Brevo test',
      error: error.message,
      service: 'Brevo'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [BREVO_TEST] Custom Brevo email test...');
    
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: to, subject'
      }, { status: 400 });
    }
    
    const result = await sendBrevoEmail({
      to,
      subject,
      html: html || `
        <div style="font-family: Arial, sans-serif;">
          <h1>Teste Brevo</h1>
          <p>Este é um email de teste enviado via Brevo (ex-SendinBlue).</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
          <p>🚀 Brevo oferece 300 emails/dia grátis!</p>
        </div>
      `,
      text: text || `Teste Brevo - ${new Date().toLocaleString('pt-PT')}`
    });
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Brevo' : 'Failed to send email',
      details: result,
      service: 'Brevo'
    });

  } catch (error: any) {
    console.error('❌ [BREVO_TEST] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Brevo email sending',
      error: error.message,
      service: 'Brevo'
    }, { status: 500 });
  }
} 