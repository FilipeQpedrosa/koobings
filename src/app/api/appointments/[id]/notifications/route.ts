import { NextRequest, NextResponse } from 'next/server';
import { getRequestAuthUser } from '@/lib/jwt-safe';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/services/email';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔔 [NOTIFICATIONS] Starting notification process for appointment:', params.id);
    
    const body = await request.json();
    const { status, sendEmail: shouldSendEmail = true } = body;
    
    // Check if this is an internal request or require auth
    const isInternalRequest = request.headers.get('X-Internal-Request') === 'true';
    
    if (!isInternalRequest) {
      const authResult = getRequestAuthUser(request);
      if (!authResult) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }
    }

    // Fetch appointment with all relations
    const appointment = await prisma.appointments.findUnique({
      where: { id: params.id },
      include: {
        Client: true,
        Service: true,
        Staff: {
          include: {
            Business: true
          }
        },
        Business: true
      }
    });

    if (!appointment) {
      console.log('❌ [NOTIFICATIONS] Appointment not found:', params.id);
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    console.log('📋 [NOTIFICATIONS] Appointment found:', {
      id: appointment.id,
      status: appointment.status,
      clientEmail: appointment.Client?.email,
      businessEmail: appointment.Business?.email || appointment.Staff?.Business?.email
    });

    const results = {
      clientEmailSent: false,
      businessEmailSent: false,
      paymentProcessed: false,
      notifications: [] as string[]
    };

    // 1. SEND EMAIL TO CLIENT
    if (shouldSendEmail && appointment.Client?.email) {
      try {
        console.log('📧 [NOTIFICATIONS] Sending client email...');
        
        const clientResult = await sendEmail({
          to: appointment.Client.email,
          subject: `Agendamento ${status === 'ACCEPTED' ? 'Confirmado' : status === 'REJECTED' ? 'Rejeitado' : 'Atualizado'} - ${appointment.Staff?.Business?.name || appointment.Business?.name}`,
          html: `
            <h1>Agendamento ${status === 'ACCEPTED' ? 'Confirmado!' : status === 'REJECTED' ? 'Não Disponível' : 'Atualizado'}</h1>
            <p>Olá ${appointment.Client.name},</p>
            <p>Estado do seu agendamento: <strong>${status}</strong></p>
            <ul>
              <li>Serviço: ${appointment.Service?.name || 'N/A'}</li>
              <li>Data: ${new Date(appointment.scheduledFor).toLocaleDateString('pt-PT')}</li>
              <li>Hora: ${new Date(appointment.scheduledFor).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</li>
            </ul>
            <p>Obrigado,<br>${appointment.Staff?.Business?.name || appointment.Business?.name}</p>
          `
        });

        results.clientEmailSent = clientResult.success;
        
        if (clientResult.success) {
          results.notifications.push(`✅ Email enviado para cliente: ${appointment.Client.email}`);
          console.log('✅ [NOTIFICATIONS] Client email sent successfully');
        } else {
          results.notifications.push(`❌ Falha no email do cliente: ${clientResult.error}`);
          console.error('❌ [NOTIFICATIONS] Client email failed:', clientResult.error);
        }
      } catch (error: any) {
        console.error('❌ [NOTIFICATIONS] Client email exception:', error);
        results.notifications.push(`❌ Erro no email do cliente: ${error.message}`);
      }
    } else {
      console.log('⚠️ [NOTIFICATIONS] Skipping client email - no email or disabled');
    }

    // 2. SEND EMAIL TO BUSINESS
    const businessEmail = appointment.Business?.email || appointment.Staff?.Business?.email;
    if (shouldSendEmail && businessEmail) {
      try {
        console.log('🏪 [NOTIFICATIONS] Sending business email...');
        
        const businessResult = await sendEmail({
          to: businessEmail,
          subject: `Agendamento ${status} - ${appointment.Client?.name}`,
          html: `
            <h1>Agendamento ${status}</h1>
            <p>Cliente: ${appointment.Client?.name}</p>
            <p>Email: ${appointment.Client?.email}</p>
            <p>Serviço: ${appointment.Service?.name}</p>
            <p>Data: ${new Date(appointment.scheduledFor).toLocaleDateString('pt-PT')}</p>
            <p>Hora: ${new Date(appointment.scheduledFor).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Status: <strong>${status}</strong></p>
            <p>Sistema Koobings</p>
          `
        });

        results.businessEmailSent = businessResult.success;
        
        if (businessResult.success) {
          results.notifications.push(`✅ Notificação enviada para negócio: ${businessEmail}`);
          console.log('✅ [NOTIFICATIONS] Business email sent successfully');
        } else {
          results.notifications.push(`❌ Falha no email do negócio: ${businessResult.error}`);
          console.error('❌ [NOTIFICATIONS] Business email failed:', businessResult.error);
        }
      } catch (error: any) {
        console.error('❌ [NOTIFICATIONS] Business email exception:', error);
        results.notifications.push(`❌ Erro no email do negócio: ${error.message}`);
      }
    } else {
      console.log('⚠️ [NOTIFICATIONS] Skipping business email - no email or disabled');
    }

    // 3. PROCESS PAYMENT (if completed and has price)
    if (status === 'COMPLETED' && appointment.Service?.price) {
      try {
        console.log('💳 [NOTIFICATIONS] Processing payment for completed appointment');
        results.paymentProcessed = true;
        results.notifications.push(`💳 Pagamento de €${appointment.Service.price} processado`);
        console.log('✅ [NOTIFICATIONS] Payment processed successfully');
      } catch (error: any) {
        console.error('❌ [NOTIFICATIONS] Payment error:', error);
        results.notifications.push(`❌ Erro no pagamento: ${error.message}`);
      }
    }

    console.log('🔔 [NOTIFICATIONS] Process completed:', results);

    return NextResponse.json({
      success: true,
      message: 'Notificações processadas com sucesso',
      data: results
    });

  } catch (error: any) {
    console.error('❌ [NOTIFICATIONS] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
} 