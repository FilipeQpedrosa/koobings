import { NextRequest, NextResponse } from 'next/server';
import { sendResendEmail } from '@/lib/services/resend-email';
import { emailTemplates } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  console.log('🧪 [RESEND_TEST] Testing Resend email service with beautiful templates...');

  try {
    const testEmail = 'admin@koobings.com';
    
    // Sample data for beautiful template
    const sampleData = {
      clientName: 'Filipe Pedrosa',
      serviceName: 'Corte de Cabelo Premium',
      staffName: 'Maria Santos',
      businessName: 'Koobings - Salão Premium',
      date: new Date('2025-01-25T14:30:00'),
      time: '14:30',
      duration: 60,
      businessPhone: '+351 912 345 678',
      notes: 'Cliente prefere corte moderno e profissional'
    };

    // Use the beautiful template
    const template = emailTemplates.appointmentConfirmation(sampleData);
    
    const result = await sendResendEmail({
      to: testEmail,
      subject: template.subject,
      html: template.html,
      from: 'admin@koobings.com'
    });

    console.log('🧪 [RESEND_TEST] Test result:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '🎉 Email bonito enviado com sucesso via Resend!',
        details: result,
        service: 'Resend',
        recipient: testEmail,
        template: 'Beautiful Appointment Confirmation'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Erro ao enviar email via Resend',
        error: result.error,
        details: result,
        service: 'Resend'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ [RESEND_TEST] Unexpected error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro inesperado no teste de email',
      error: error.message,
      service: 'Resend'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, html, text, templateType } = body;

    let result;

    if (templateType) {
      // Use beautiful templates
      const sampleData = {
        clientName: 'Cliente Teste',
        serviceName: 'Serviço Premium',
        staffName: 'Equipa Profissional',
        businessName: 'Koobings',
        date: new Date(),
        time: '14:30',
        duration: 60,
        businessPhone: '+351 912 345 678',
        notes: 'Este é um email de teste com template bonito!'
      };

      let template;
      switch (templateType) {
        case 'confirmation':
          template = emailTemplates.appointmentConfirmation(sampleData);
          break;
        case 'reminder':
          template = emailTemplates.appointmentReminder(sampleData);
          break;
        case 'completion':
          template = emailTemplates.appointmentCompleted({ ...sampleData, rating: true });
          break;
        case 'rejection':
          template = emailTemplates.appointmentRejected({ 
            ...sampleData, 
            reason: 'Este é apenas um teste - não se preocupe!' 
          });
          break;
        default:
          template = emailTemplates.appointmentConfirmation(sampleData);
      }

      result = await sendResendEmail({ 
        to, 
        subject: template.subject, 
        html: template.html,
        from: 'admin@koobings.com'
      });
    } else {
      // Fallback to custom HTML
      if (!to || !subject || !html) {
        return NextResponse.json({
          success: false,
          message: 'Missing required fields: to, subject, html'
        }, { status: 400 });
      }

      result = await sendResendEmail({ 
        to, 
        subject, 
        html, 
        text,
        from: 'admin@koobings.com'
      });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email sent successfully via Resend',
        details: result,
        service: 'Resend'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email via Resend',
        error: result.error,
        details: result,
        service: 'Resend'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ [RESEND_POST] Error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Unexpected error in email sending',
      error: error.message,
      service: 'Resend'
    }, { status: 500 });
  }
} 