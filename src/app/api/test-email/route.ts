import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';
import { getRequestAuthUser } from '@/lib/jwt-safe';

export async function POST(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    // Só permitir para admins
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized - Admin access required' 
      }, { status: 401 });
    }

    const { emailType, to, appointmentId, businessId, reason } = await request.json();

    console.log('🧪 [TEST_EMAIL] Request:', { emailType, to, appointmentId, businessId });

    let result;

    switch (emailType) {
      case 'test':
        if (!to) {
          return NextResponse.json({ 
            success: false, 
            error: 'Email "to" is required for test emails' 
          }, { status: 400 });
        }
        result = await EmailService.sendTestEmail(to, 'admin-test');
        break;

      case 'appointment-confirmation':
        if (!appointmentId) {
          return NextResponse.json({ 
            success: false, 
            error: 'appointmentId is required' 
          }, { status: 400 });
        }
        result = await EmailService.sendAppointmentEmail({
          appointmentId,
          type: 'confirmation'
        });
        break;

      case 'appointment-reminder':
        if (!appointmentId) {
          return NextResponse.json({ 
            success: false, 
            error: 'appointmentId is required' 
          }, { status: 400 });
        }
        result = await EmailService.sendAppointmentEmail({
          appointmentId,
          type: 'reminder'
        });
        break;

      case 'appointment-rejection':
        if (!appointmentId) {
          return NextResponse.json({ 
            success: false, 
            error: 'appointmentId is required' 
          }, { status: 400 });
        }
        result = await EmailService.sendAppointmentEmail({
          appointmentId,
          type: 'rejection',
          reason: reason || 'Teste de rejeição'
        });
        break;

      case 'appointment-completion':
        if (!appointmentId) {
          return NextResponse.json({ 
            success: false, 
            error: 'appointmentId is required' 
          }, { status: 400 });
        }
        result = await EmailService.sendAppointmentEmail({
          appointmentId,
          type: 'completion',
          rating: true
        });
        break;

      case 'business-notification':
        if (!appointmentId || !businessId) {
          return NextResponse.json({ 
            success: false, 
            error: 'appointmentId and businessId are required' 
          }, { status: 400 });
        }
        result = await EmailService.sendBusinessNotification({
          businessId,
          appointmentId,
          type: 'newAppointment'
        });
        break;

      case 'welcome-business':
        if (!businessId) {
          return NextResponse.json({ 
            success: false, 
            error: 'businessId is required' 
          }, { status: 400 });
        }
        result = await EmailService.sendWelcomeEmail({
          businessId,
          type: 'business'
        });
        break;

      default:
        return NextResponse.json({ 
          success: false, 
          error: `Unknown email type: ${emailType}` 
        }, { status: 400 });
    }

    console.log('🧪 [TEST_EMAIL] Result:', { emailType, success: result.success });

    return NextResponse.json({
      success: true,
      data: {
        emailType,
        result
      }
    });

  } catch (error) {
    console.error('❌ [TEST_EMAIL] Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getRequestAuthUser(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Retornar tipos de email disponíveis para teste
    const emailTypes = [
      {
        type: 'test',
        name: 'Email de Teste',
        description: 'Email simples para testar configuração',
        params: ['to']
      },
      {
        type: 'appointment-confirmation',
        name: 'Confirmação de Agendamento',
        description: 'Email enviado quando agendamento é confirmado',
        params: ['appointmentId']
      },
      {
        type: 'appointment-reminder',
        name: 'Lembrete de Agendamento',
        description: 'Email lembrete enviado antes do agendamento',
        params: ['appointmentId']
      },
      {
        type: 'appointment-rejection',
        name: 'Rejeição de Agendamento',
        description: 'Email enviado quando agendamento é rejeitado',
        params: ['appointmentId', 'reason?']
      },
      {
        type: 'appointment-completion',
        name: 'Serviço Concluído',
        description: 'Email enviado quando serviço é concluído',
        params: ['appointmentId']
      },
      {
        type: 'business-notification',
        name: 'Notificação para Negócio',
        description: 'Email enviado para o negócio sobre novo agendamento',
        params: ['appointmentId', 'businessId']
      },
      {
        type: 'welcome-business',
        name: 'Boas-vindas Negócio',
        description: 'Email de boas-vindas para novo negócio',
        params: ['businessId']
      }
    ];

    return NextResponse.json({
      success: true,
      data: emailTypes
    });

  } catch (error) {
    console.error('❌ [TEST_EMAIL] GET Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
} 