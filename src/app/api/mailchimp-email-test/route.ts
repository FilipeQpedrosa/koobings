import { NextRequest, NextResponse } from 'next/server';
import { sendMailchimpEmail } from '@/lib/services/mailchimp-email';

export async function GET() {
  try {
    console.log('🧪 [MAILCHIMP_TEST] Testing Mailchimp email sending...');

    const result = await sendMailchimpEmail({
      to: 'admin@koobings.com',
      subject: '🎉 Teste Mailchimp - Sistema Funcionando!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #059669; margin: 0; font-size: 28px; font-weight: bold;">🎉 Mailchimp Funcionando!</h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">Sistema de emails com Mailchimp Transactional</p>
            </div>
            
            <div style="background: #dcfce7; border-left: 4px solid #16a34a; padding: 24px; border-radius: 8px; margin: 24px 0;">
              <h2 style="color: #15803d; margin: 0 0 16px 0; font-size: 20px;">✅ Mailchimp Mandrill</h2>
              <div style="color: #374151; line-height: 1.6;">
                <p style="margin: 8px 0;"><strong>📧 Limite:</strong> 500 emails/mês GRÁTIS</p>
                <p style="margin: 8px 0;"><strong>💰 Custo:</strong> €0/mês</p>
                <p style="margin: 8px 0;"><strong>🎯 Status:</strong> Alternativa confiável!</p>
                <p style="margin: 8px 0;"><strong>🚀 Vantagem:</strong> Setup mais simples</p>
              </div>
            </div>

            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">🔧 Configuração</h3>
              <p style="color: #78350f; margin: 0; line-height: 1.5;">
                Mailchimp funciona como backup ao SendGrid:
                <br>• <strong>Produção:</strong> SendGrid (já configurado no Vercel)
                <br>• <strong>Desenvolvimento:</strong> Mailchimp (mais fácil)
                <br>• <strong>Backup:</strong> Switch automático se SendGrid falhar
              </p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 20px; text-align: center;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Sistema Koobings powered by <strong>Mailchimp Transactional</strong><br>
                Testado em: ${new Date().toLocaleString('pt-PT')}
              </p>
            </div>
          </div>
        </div>
      `,
      text: 'Teste Mailchimp - Sistema funcionando!'
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Mailchimp' : 'Failed to send email',
      details: result,
      service: 'Mailchimp',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ [MAILCHIMP_TEST] Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Mailchimp test',
      error: error.message,
      service: 'Mailchimp'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [MAILCHIMP_TEST] Custom Mailchimp email test...');

    const { to, subject, html, text } = await request.json();

    if (!to || !subject) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: to, subject'
      }, { status: 400 });
    }

    const result = await sendMailchimpEmail({
      to,
      subject,
      html: html || `<h2>${subject}</h2><p>Test email sent via Mailchimp at ${new Date().toLocaleString('pt-PT')}</p>`,
      text: text || `${subject} - Test email sent via Mailchimp`
    });

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'Email sent successfully via Mailchimp' : 'Failed to send email',
      details: result,
      service: 'Mailchimp'
    });

  } catch (error: any) {
    console.error('❌ [MAILCHIMP_TEST] Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in Mailchimp email sending',
      error: error.message,
      service: 'Mailchimp'
    }, { status: 500 });
  }
} 