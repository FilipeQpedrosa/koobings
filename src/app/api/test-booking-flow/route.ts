import { NextRequest, NextResponse } from 'next/server';
import { sendResendEmail } from '@/lib/services/resend-email';
import { emailTemplates } from '@/lib/email-templates';

export async function GET(request: NextRequest) {
  console.log('🧪 [TEST_BOOKING_FLOW] Starting complete booking flow simulation...');
  
  try {
    const results = {
      step1_newBooking: false,
      step2_businessNotification: false,
      step3_clientConfirmation: false,
      step4_appointmentCompletion: false,
      notifications: [] as string[],
      emailsSent: 0
    };

    // SIMULATED APPOINTMENT DATA
    const mockAppointment = {
      id: 'test_' + Date.now(),
      clientName: 'João Silva',
      clientEmail: 'admin@koobings.com', // Use verified email
      serviceName: 'Corte de Cabelo Premium',
      staffName: 'Maria Santos',
      businessName: 'Koobings - Salão Premium',
      businessEmail: 'admin@koobings.com', // Use verified email
      date: new Date('2025-01-25T14:30:00'),
      time: '14:30',
      duration: 60,
      businessPhone: '+351 912 345 678',
      notes: 'Cliente prefere corte moderno e profissional'
    };

    console.log('📋 [TEST_BOOKING_FLOW] Mock appointment data:', mockAppointment);

    // ===============================================
    // STEP 1: NEW BOOKING NOTIFICATION TO BUSINESS
    // ===============================================
    try {
      console.log('🔔 [TEST_BOOKING_FLOW] Step 1: Sending business notification...');
      
      const businessTemplate = {
        subject: `🔔 Nova Marcação - ${mockAppointment.clientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #1f2937; margin: 0; font-size: 28px; font-weight: bold;">🔔 Nova Marcação</h1>
                <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">Recebeu uma nova marcação!</p>
              </div>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 24px; border-radius: 8px; margin: 24px 0;">
                <h2 style="color: #1e40af; margin: 0 0 16px 0; font-size: 20px;">📋 Detalhes da Marcação</h2>
                <div style="color: #374151; line-height: 1.6;">
                  <p style="margin: 8px 0;"><strong>👤 Cliente:</strong> ${mockAppointment.clientName}</p>
                  <p style="margin: 8px 0;"><strong>📧 Email:</strong> ${mockAppointment.clientEmail}</p>
                  <p style="margin: 8px 0;"><strong>💼 Serviço:</strong> ${mockAppointment.serviceName}</p>
                  <p style="margin: 8px 0;"><strong>👨‍💼 Profissional:</strong> ${mockAppointment.staffName}</p>
                  <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${mockAppointment.date.toLocaleDateString('pt-PT')}</p>
                  <p style="margin: 8px 0;"><strong>⏰ Hora:</strong> ${mockAppointment.time}</p>
                  <p style="margin: 8px 0;"><strong>⌛ Duração:</strong> ${mockAppointment.duration} minutos</p>
                  <p style="margin: 8px 0;"><strong>📝 Notas:</strong> ${mockAppointment.notes}</p>
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">⚡ Ação Necessária</h3>
                <p style="color: #78350f; margin: 0; line-height: 1.5;">
                  Esta marcação está <strong>PENDENTE</strong> e aguarda a sua confirmação. 
                  Aceda ao dashboard para aceitar ou rejeitar a marcação.
                </p>
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <a href="https://koobings.com" style="background: #3b82f6; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  🏪 Ver Dashboard
                </a>
              </div>

              <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  Este email foi enviado automaticamente pelo sistema Koobings.<br>
                  <strong>${mockAppointment.businessName}</strong>
                </p>
              </div>
            </div>
          </div>
        `
      };

      const businessResult = await sendResendEmail({
        to: mockAppointment.businessEmail,
        subject: businessTemplate.subject,
        html: businessTemplate.html,
        from: 'admin@koobings.com'
      });

      results.step1_newBooking = businessResult.success;
      if (businessResult.success) {
        results.emailsSent++;
        results.notifications.push('✅ Notificação enviada para o estabelecimento');
        console.log('✅ [TEST_BOOKING_FLOW] Business notification sent');
      } else {
        results.notifications.push('❌ Falha na notificação do estabelecimento');
        console.error('❌ [TEST_BOOKING_FLOW] Business notification failed:', businessResult.error);
      }
    } catch (error) {
      console.error('❌ [TEST_BOOKING_FLOW] Business notification error:', error);
      results.notifications.push('❌ Erro na notificação do estabelecimento');
    }

    // Simulate wait time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ===============================================
    // STEP 2: BUSINESS ACCEPTS → CLIENT CONFIRMATION
    // ===============================================
    try {
      console.log('✅ [TEST_BOOKING_FLOW] Step 2: Sending client confirmation...');
      
      const confirmationTemplate = emailTemplates.appointmentConfirmation(mockAppointment);

      const confirmationResult = await sendResendEmail({
        to: mockAppointment.clientEmail,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html,
        from: 'admin@koobings.com'
      });

      results.step2_businessNotification = confirmationResult.success;
      if (confirmationResult.success) {
        results.emailsSent++;
        results.notifications.push('✅ Confirmação enviada para o cliente');
        console.log('✅ [TEST_BOOKING_FLOW] Client confirmation sent');
      } else {
        results.notifications.push('❌ Falha na confirmação do cliente');
        console.error('❌ [TEST_BOOKING_FLOW] Client confirmation failed:', confirmationResult.error);
      }
    } catch (error) {
      console.error('❌ [TEST_BOOKING_FLOW] Client confirmation error:', error);
      results.notifications.push('❌ Erro na confirmação do cliente');
    }

    // Simulate wait time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ===============================================
    // STEP 3: APPOINTMENT COMPLETED
    // ===============================================
    try {
      console.log('🏆 [TEST_BOOKING_FLOW] Step 3: Sending completion notification...');
      
      const completionTemplate = emailTemplates.appointmentCompleted({
        ...mockAppointment,
        rating: true
      });

      const completionResult = await sendResendEmail({
        to: mockAppointment.clientEmail,
        subject: completionTemplate.subject,
        html: completionTemplate.html,
        from: 'admin@koobings.com'
      });

      results.step3_clientConfirmation = completionResult.success;
      if (completionResult.success) {
        results.emailsSent++;
        results.notifications.push('✅ Email de conclusão enviado para o cliente');
        console.log('✅ [TEST_BOOKING_FLOW] Completion notification sent');
      } else {
        results.notifications.push('❌ Falha no email de conclusão');
        console.error('❌ [TEST_BOOKING_FLOW] Completion failed:', completionResult.error);
      }
    } catch (error) {
      console.error('❌ [TEST_BOOKING_FLOW] Completion error:', error);
      results.notifications.push('❌ Erro no email de conclusão');
    }

    // Simulate wait time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ===============================================
    // STEP 4: REJECTION TEST (ALTERNATIVE FLOW)
    // ===============================================
    try {
      console.log('❌ [TEST_BOOKING_FLOW] Step 4: Testing rejection flow...');
      
      const rejectionTemplate = emailTemplates.appointmentRejected({
        ...mockAppointment,
        reason: 'Esta é uma demonstração do email de rejeição. Não se preocupe - este é apenas um teste!'
      });

      const rejectionResult = await sendResendEmail({
        to: mockAppointment.clientEmail,
        subject: rejectionTemplate.subject,
        html: rejectionTemplate.html,
        from: 'admin@koobings.com'
      });

      results.step4_appointmentCompletion = rejectionResult.success;
      if (rejectionResult.success) {
        results.emailsSent++;
        results.notifications.push('✅ Email de rejeição (teste) enviado');
        console.log('✅ [TEST_BOOKING_FLOW] Rejection test sent');
      } else {
        results.notifications.push('❌ Falha no teste de rejeição');
        console.error('❌ [TEST_BOOKING_FLOW] Rejection test failed:', rejectionResult.error);
      }
    } catch (error) {
      console.error('❌ [TEST_BOOKING_FLOW] Rejection test error:', error);
      results.notifications.push('❌ Erro no teste de rejeição');
    }

    console.log('🎯 [TEST_BOOKING_FLOW] Complete flow test finished:', results);

    const successRate = (results.emailsSent / 4) * 100;

    return NextResponse.json({
      success: true,
      message: `🎉 Teste completo do fluxo de marcações concluído!`,
      data: {
        ...results,
        mockAppointment: {
          id: mockAppointment.id,
          clientName: mockAppointment.clientName,
          serviceName: mockAppointment.serviceName,
          date: mockAppointment.date.toLocaleDateString('pt-PT'),
          time: mockAppointment.time
        },
        summary: {
          totalEmails: 4,
          emailsSent: results.emailsSent,
          successRate: `${successRate}%`,
          recipient: mockAppointment.clientEmail
        }
      }
    });

  } catch (error: any) {
    console.error('❌ [TEST_BOOKING_FLOW] General error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Erro no teste do fluxo de marcações',
      error: error.message
    }, { status: 500 });
  }
} 