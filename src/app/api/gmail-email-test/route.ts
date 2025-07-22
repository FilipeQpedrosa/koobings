import { NextRequest, NextResponse } from 'next/server';
import { sendGmailEmail } from '@/lib/services/gmail-smtp';

export async function GET() {
  try {
    console.log('🧪 [GMAIL_TEST] Testing Gmail SMTP email sending...');
    
    const result = await sendGmailEmail({
      to: 'admin@koobings.com',
      subject: '🎉 Teste Gmail SMTP - Sistema Funcionando!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #059669; text-align: center;">🎉 Teste Gmail SMTP Sucesso!</h1>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>✅ Sistema de Email Funcionando</h2>
            <p><strong>Serviço:</strong> Gmail SMTP</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
            <p><strong>Status:</strong> ✅ Enviado com sucesso!</p>
          </div>
          <p style="text-align: center; color: #666;">
            Este email confirma que o sistema de notificações está operacional.
          </p>
        </div>
      `,
      text: 'Teste Gmail SMTP - Sistema funcionando!'
    });
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Gmail SMTP' : 'Failed to send email',
      details: result,
      service: 'Gmail SMTP',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ [GMAIL_TEST] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Gmail SMTP test',
      error: error.message,
      service: 'Gmail SMTP'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [GMAIL_TEST] Custom Gmail SMTP email test...');
    
    const { to, subject, html, text } = await request.json();
    
    if (!to || !subject) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: to, subject'
      }, { status: 400 });
    }
    
    const result = await sendGmailEmail({
      to,
      subject,
      html: html || `
        <div style="font-family: Arial, sans-serif;">
          <h1>Teste Gmail SMTP</h1>
          <p>Este é um email de teste enviado via Gmail SMTP.</p>
          <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</p>
        </div>
      `,
      text: text || `Teste Gmail SMTP - ${new Date().toLocaleString('pt-PT')}`
    });
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Gmail SMTP' : 'Failed to send email',
      details: result,
      service: 'Gmail SMTP'
    });

  } catch (error: any) {
    console.error('❌ [GMAIL_TEST] Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Gmail SMTP email sending',
      error: error.message,
      service: 'Gmail SMTP'
    }, { status: 500 });
  }
} 