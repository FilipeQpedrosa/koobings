import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/services/email';
import { emailTemplates } from '@/lib/email-templates';

export async function POST(request: NextRequest) {
  try {
    const { email, templateType = 'confirmation' } = await request.json();

    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email é obrigatório' 
      }, { status: 400 });
    }

    console.log('📧 [SEND_TEST_EMAIL] Enviando email para:', email);

    // Dados de exemplo para o template
    const sampleData = {
      clientName: 'João Silva (TESTE)',
      serviceName: 'Corte de Cabelo',
      staffName: 'Maria Santos',
      businessName: 'Salão Beleza Total',
      date: new Date('2024-01-20T10:30:00'),
      time: '10:30',
      duration: 60,
      businessPhone: '+351 912 345 678',
      notes: 'Este é um email de teste do sistema!'
    };

    let template;
    switch (templateType) {
      case 'confirmation':
        template = emailTemplates.appointmentConfirmation(sampleData);
        break;
      case 'reminder':
        template = emailTemplates.appointmentReminder(sampleData);
        break;
      case 'completed':
        template = emailTemplates.appointmentCompleted({ ...sampleData, rating: true });
        break;
      case 'rejected':
        template = emailTemplates.appointmentRejected({ 
          ...sampleData, 
          reason: 'Este é apenas um teste - não se preocupe!' 
        });
        break;
      default:
        template = emailTemplates.appointmentConfirmation(sampleData);
    }

    // Usar a mesma função sendEmail que funciona no contacto
    const result = await sendEmail({
      to: email,
      subject: `[TESTE] ${template.subject}`,
      html: template.html
    });

    if (!result.success) {
      console.error('❌ [SEND_TEST_EMAIL] Erro ao enviar:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao enviar email: ' + result.error 
      }, { status: 500 });
    }

    console.log('✅ [SEND_TEST_EMAIL] Email enviado com sucesso!');

    return NextResponse.json({ 
      success: true, 
      message: `Email de teste enviado para ${email}`,
      templateUsed: templateType,
      subject: template.subject
    });

  } catch (error) {
    console.error('❌ [SEND_TEST_EMAIL] Erro:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao enviar email: ' + (error as Error).message 
    }, { status: 500 });
  }
} 