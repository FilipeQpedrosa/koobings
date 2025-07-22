import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/services/email';
import { emailTemplates } from '@/lib/email-templates';

// EMAIL TEMPLATES FOR REAL NOTIFICATIONS
const getClientEmailTemplate = (status: string, appointment: any) => {
  const baseData = {
    clientName: appointment.Client?.name || 'Cliente',
    serviceName: appointment.Service?.name || 'Serviço',
    staffName: appointment.Staff?.name || 'Equipa',
    businessName: appointment.Business?.name || 'Negócio',
    date: new Date(appointment.scheduledFor),
    time: new Date(appointment.scheduledFor).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    duration: appointment.duration || 60,
    businessPhone: appointment.Business?.phone || '+351 912 345 678',
    notes: appointment.notes || null
  };

  switch (status) {
    case 'PENDING':
      // NEW: Client confirmation when appointment is created
      return {
        subject: `✅ Marcação Criada - ${baseData.serviceName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #059669; margin: 0; font-size: 28px; font-weight: bold;">✅ Marcação Criada!</h1>
                <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">A sua marcação foi criada com sucesso</p>
              </div>
              
              <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 24px; border-radius: 8px; margin: 24px 0;">
                <h2 style="color: #065f46; margin: 0 0 16px 0; font-size: 20px;">📋 Detalhes da Sua Marcação</h2>
                <div style="color: #374151; line-height: 1.6;">
                  <p style="margin: 8px 0;"><strong>🏢 Estabelecimento:</strong> ${baseData.businessName}</p>
                  <p style="margin: 8px 0;"><strong>💼 Serviço:</strong> ${baseData.serviceName}</p>
                  <p style="margin: 8px 0;"><strong>👨‍💼 Profissional:</strong> ${baseData.staffName}</p>
                  <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${baseData.date.toLocaleDateString('pt-PT')}</p>
                  <p style="margin: 8px 0;"><strong>⏰ Hora:</strong> ${baseData.time}</p>
                  <p style="margin: 8px 0;"><strong>⌛ Duração:</strong> ${baseData.duration} minutos</p>
                  ${baseData.notes ? `<p style="margin: 8px 0;"><strong>📝 Notas:</strong> ${baseData.notes}</p>` : ''}
                </div>
              </div>

              <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #92400e; margin: 0 0 12px 0; font-size: 16px;">⏳ Estado Atual</h3>
                <p style="color: #78350f; margin: 0; line-height: 1.5;">
                  A sua marcação está <strong>PENDENTE</strong> de confirmação. 
                  Receberá um email de confirmação assim que o estabelecimento aceitar a marcação.
                </p>
              </div>

              <div style="text-align: center; margin-top: 32px;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  Se tiver alguma questão, contacte-nos:<br>
                  📞 ${baseData.businessPhone}
                </p>
              </div>

              <div style="border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  Obrigado por escolher <strong>${baseData.businessName}</strong><br>
                  Este email foi enviado automaticamente pelo sistema Koobings.
                </p>
              </div>
            </div>
          </div>
        `
      };
    
    case 'ACCEPTED':
      return emailTemplates.appointmentConfirmation(baseData);
    
    case 'REJECTED':
      return emailTemplates.appointmentRejected({
        ...baseData,
        reason: 'Não foi possível confirmar o agendamento para a data/hora solicitada. Entre em contacto connosco para reagendar.'
      });
    
    case 'COMPLETED':
      return emailTemplates.appointmentCompleted({
        ...baseData,
        rating: true
      });
    
    case 'CANCELLED':
      return emailTemplates.appointmentRejected({
        ...baseData,
        reason: 'O seu agendamento foi cancelado. Entre em contacto connosco se tiver alguma questão.'
      });
    
    default:
      return null;
  }
};

// BUSINESS NOTIFICATION TEMPLATE
const getBusinessNotificationTemplate = (appointment: any, type: 'new' | 'status_change') => {
  const baseData = {
    clientName: appointment.Client?.name || 'Cliente',
    serviceName: appointment.Service?.name || 'Serviço',
    staffName: appointment.Staff?.name || 'Equipa',
    businessName: appointment.Business?.name || 'Negócio',
    date: new Date(appointment.scheduledFor),
    time: new Date(appointment.scheduledFor).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
    duration: appointment.duration || 60,
    businessPhone: appointment.Business?.phone || '+351 912 345 678',
    notes: appointment.notes || null
  };

  if (type === 'new') {
    return {
      subject: `🔔 Nova Marcação - ${baseData.clientName}`,
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
                <p style="margin: 8px 0;"><strong>👤 Cliente:</strong> ${baseData.clientName}</p>
                <p style="margin: 8px 0;"><strong>💼 Serviço:</strong> ${baseData.serviceName}</p>
                <p style="margin: 8px 0;"><strong>👨‍💼 Profissional:</strong> ${baseData.staffName}</p>
                <p style="margin: 8px 0;"><strong>📅 Data:</strong> ${baseData.date.toLocaleDateString('pt-PT')}</p>
                <p style="margin: 8px 0;"><strong>⏰ Hora:</strong> ${baseData.time}</p>
                <p style="margin: 8px 0;"><strong>⌛ Duração:</strong> ${baseData.duration} minutos</p>
                ${baseData.notes ? `<p style="margin: 8px 0;"><strong>📝 Notas:</strong> ${baseData.notes}</p>` : ''}
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
                <strong>${baseData.businessName}</strong>
              </p>
            </div>
          </div>
        </div>
      `
    };
  }

  return null;
};

// Simulate payment processing (placeholder)
async function processPayment(data: {
  appointmentId: string;
  clientId: string;
  amount: number;
  description: string;
}) {
  // Placeholder for payment processing
  console.log('💳 Processing payment:', data);
  return { success: true, transactionId: `txn_${Date.now()}` };
}

// POST /api/appointments/[id]/notifications
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔔 [NOTIFICATIONS] Processing notifications for appointment:', params.id);
    
    // Allow internal requests (from appointment creation)
    const isInternalRequest = request.headers.get('X-Internal-Request') === 'true';
    
    if (!isInternalRequest) {
      const user = getRequestAuthUser(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const { status, sendEmail = true } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Get appointment with all related data
    const appointment = await prisma.appointments.findUnique({
      where: { id: params.id },
      include: {
        Client: { select: { id: true, name: true, email: true } },
        Service: { select: { name: true, price: true } },
        Business: { select: { name: true, email: true, phone: true } },
        Staff: { select: { name: true, email: true } }
      }
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    console.log('📋 [NOTIFICATIONS] Appointment found:', {
      id: appointment.id,
      client: appointment.Client?.email,
      business: appointment.Business?.email,
      status: status
    });

    const results = {
      clientEmailSent: false,
      businessEmailSent: false,
      paymentProcessed: false,
      notifications: [] as string[]
    };

    // 1. SEND EMAIL TO CLIENT
    if (sendEmail && appointment.Client?.email) {
      const clientTemplate = getClientEmailTemplate(status, appointment);
      
      if (clientTemplate) {
        try {
          console.log('📧 [NOTIFICATIONS] Sending client email:', {
            to: appointment.Client.email,
            subject: clientTemplate.subject,
            status: status
          });

          const clientEmailResult = await sendEmail({
            to: appointment.Client.email,
            subject: clientTemplate.subject,
            html: clientTemplate.html,
            from: 'admin@koobings.com'
          });

          results.clientEmailSent = clientEmailResult.success;
          
          if (clientEmailResult.success) {
            results.notifications.push(`✅ Email enviado para cliente: ${appointment.Client.email}`);
            console.log('✅ [NOTIFICATIONS] Client email sent successfully');
          } else {
            results.notifications.push(`❌ Falha ao enviar email para cliente: ${clientEmailResult.error}`);
            console.error('❌ [NOTIFICATIONS] Client email failed:', clientEmailResult.error);
          }
        } catch (error) {
          console.error('❌ [NOTIFICATIONS] Client email error:', error);
          results.notifications.push(`❌ Erro no email do cliente: ${error}`);
        }
      }
    }

    // 2. SEND NOTIFICATION TO BUSINESS (for new appointments or status changes)
    if (sendEmail && appointment.Business?.email && status === 'PENDING') {
      const businessTemplate = getBusinessNotificationTemplate(appointment, 'new');
      
      if (businessTemplate) {
        try {
          console.log('🏪 [NOTIFICATIONS] Sending business notification:', {
            to: appointment.Business.email,
            subject: businessTemplate.subject
          });

          const businessEmailResult = await sendEmail({
            to: appointment.Business.email,
            subject: businessTemplate.subject,
            html: businessTemplate.html,
            from: 'admin@koobings.com'
          });

          results.businessEmailSent = businessEmailResult.success;
          
          if (businessEmailResult.success) {
            results.notifications.push(`✅ Notificação enviada para negócio: ${appointment.Business.email}`);
            console.log('✅ [NOTIFICATIONS] Business email sent successfully');
          } else {
            results.notifications.push(`❌ Falha ao enviar notificação para negócio: ${businessEmailResult.error}`);
            console.error('❌ [NOTIFICATIONS] Business email failed:', businessEmailResult.error);
          }
        } catch (error) {
          console.error('❌ [NOTIFICATIONS] Business email error:', error);
          results.notifications.push(`❌ Erro no email do negócio: ${error}`);
        }
      }
    }

    // 3. PROCESS PAYMENT FOR COMPLETED APPOINTMENTS (if enabled)
    if (status === 'COMPLETED' && appointment.Service?.price) {
      try {
        console.log('💳 [NOTIFICATIONS] Processing payment for completed appointment');
        
        const paymentResult = await processPayment({
          appointmentId: appointment.id,
          clientId: appointment.clientId,
          amount: appointment.Service.price,
          description: `${appointment.Service.name} - ${appointment.Client?.name}`
        });

        results.paymentProcessed = paymentResult.success;
        results.notifications.push(paymentResult.success ? 
          `💳 Pagamento de €${appointment.Service.price} processado` : 
          '💳 Falha no processamento do pagamento'
        );
      } catch (error) {
        console.error('❌ [NOTIFICATIONS] Payment processing error:', error);
        results.notifications.push('💳 Erro no processamento do pagamento');
      }
    }

    // 4. LOG THE NOTIFICATION IN DATABASE
    await prisma.appointments.update({
      where: { id: params.id },
      data: {
        notes: appointment.notes ? 
          `${appointment.notes}\n[${new Date().toISOString()}] Status: ${status} - Notificações enviadas` :
          `[${new Date().toISOString()}] Status: ${status} - Notificações enviadas`
      }
    });

    console.log('✅ [NOTIFICATIONS] Processing complete:', results);

    return NextResponse.json({
      success: true,
      message: 'Notificações processadas com sucesso',
      data: results
    });

  } catch (error) {
    console.error('❌ [NOTIFICATIONS] Processing error:', error);
    return NextResponse.json({
      error: 'Falha no processamento das notificações',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
} 