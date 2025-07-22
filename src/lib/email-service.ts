import { sendEmail } from '@/lib/services/email';
import { emailTemplates } from '@/lib/email-templates';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentEmailData {
  appointmentId: string;
  type: 'confirmation' | 'reminder' | 'rejection' | 'completion' | 'newAppointment';
  reason?: string; // Para rejeições
  rating?: boolean; // Para conclusões
}

interface BusinessNotificationData {
  businessId: string;
  appointmentId: string;
  type: 'newAppointment' | 'cancellation' | 'reminder';
}

interface WelcomeEmailData {
  businessId: string;
  type: 'business' | 'client';
}

export class EmailService {
  
  /**
   * 📧 Envia email relacionado a agendamento
   */
  static async sendAppointmentEmail(data: AppointmentEmailData) {
    try {
      console.log(`📧 [EMAIL_SERVICE] Sending ${data.type} email for appointment:`, data.appointmentId);

      // Buscar dados completos do agendamento
      const appointment = await prisma.appointments.findUnique({
        where: { id: data.appointmentId },
        include: {
          Client: true,
          Service: true,
          Staff: true,
          Business: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              // settings podem incluir configurações de email
            }
          }
        }
      });

      if (!appointment) {
        throw new Error(`Appointment not found: ${data.appointmentId}`);
      }

      if (!appointment.Client?.email) {
        console.warn(`⚠️ No client email for appointment: ${data.appointmentId}`);
        return { success: false, error: 'Client email not found' };
      }

      // Preparar dados para o template
      const templateData = {
        clientName: appointment.Client.name,
        serviceName: appointment.Service?.name || 'Serviço',
        staffName: appointment.Staff?.name || 'Equipa',
        businessName: appointment.Business?.name || 'Negócio',
        date: appointment.scheduledFor,
        time: format(appointment.scheduledFor, 'HH:mm'),
        duration: appointment.duration || 60,
        businessPhone: appointment.Business?.phone || undefined,
        notes: appointment.notes || undefined,
        reason: data.reason
      };

      // Escolher template
      let template;
      switch (data.type) {
        case 'confirmation':
          template = emailTemplates.appointmentConfirmation(templateData);
          break;
        case 'reminder':
          template = emailTemplates.appointmentReminder(templateData);
          break;
        case 'rejection':
          template = emailTemplates.appointmentRejected({ ...templateData, reason: data.reason });
          break;
        case 'completion':
          template = emailTemplates.appointmentCompleted({ ...templateData, rating: data.rating });
          break;
        default:
          throw new Error(`Unknown email type: ${data.type}`);
      }

      // Enviar email
      const result = await sendEmail({
        to: appointment.Client.email,
        subject: template.subject,
        html: template.html
      });

      if (result.success) {
        console.log(`✅ [EMAIL_SERVICE] ${data.type} email sent successfully to:`, appointment.Client.email);
        
        // Opcional: Registar no histórico de emails (futura implementação)
        // await this.logEmailSent(appointment.id, data.type, appointment.Client.email);
      }

      return result;

    } catch (error) {
      console.error(`❌ [EMAIL_SERVICE] Error sending ${data.type} email:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * 📧 Envia notificação para o negócio
   */
  static async sendBusinessNotification(data: BusinessNotificationData) {
    try {
      console.log(`📧 [EMAIL_SERVICE] Sending business notification:`, data.type);

      // Buscar dados do agendamento e negócio
      const appointment = await prisma.appointments.findUnique({
        where: { id: data.appointmentId },
        include: {
          Client: true,
          Service: true,
          Staff: true,
          Business: true
        }
      });

      if (!appointment) {
        throw new Error(`Appointment not found: ${data.appointmentId}`);
      }

      // Buscar emails do negócio (owner + staff admins)
      const businessEmails: string[] = [];
      
      // Email do negócio
      if (appointment.Business?.email) {
        businessEmails.push(appointment.Business.email);
      }

      // Emails de staff admin
      const adminStaff = await prisma.staff.findMany({
        where: {
          businessId: data.businessId,
          role: 'ADMIN'
        },
        select: { email: true }
      });

      adminStaff.forEach(staff => {
        if (staff.email && !businessEmails.includes(staff.email)) {
          businessEmails.push(staff.email);
        }
      });

      if (businessEmails.length === 0) {
        console.warn(`⚠️ No business emails found for business: ${data.businessId}`);
        return { success: false, error: 'No business emails found' };
      }

      // Preparar dados para template
      const templateData = {
        clientName: appointment.Client?.name || 'Cliente',
        serviceName: appointment.Service?.name || 'Serviço',
        staffName: appointment.Staff?.name || 'Equipa',
        businessName: appointment.Business?.name || 'Negócio',
        date: appointment.scheduledFor,
        time: format(appointment.scheduledFor, 'HH:mm'),
        duration: appointment.duration || 60,
        notes: appointment.notes || undefined
      };

      // Usar template adequado
      let template;
      if (data.type === 'newAppointment') {
        template = emailTemplates.newAppointmentNotification(templateData);
      } else {
        // Para outros tipos, pode usar templates específicos
        template = emailTemplates.newAppointmentNotification(templateData);
      }

      // Enviar para todos os emails do negócio
      const results = await Promise.all(
        businessEmails.map(email => 
          sendEmail({
            to: email,
            subject: template.subject,
            html: template.html
          })
        )
      );

      const successCount = results.filter(r => r.success).length;
      console.log(`✅ [EMAIL_SERVICE] Business notification sent to ${successCount}/${businessEmails.length} recipients`);

      return { 
        success: successCount > 0, 
        emailsSent: successCount,
        totalEmails: businessEmails.length 
      };

    } catch (error) {
      console.error(`❌ [EMAIL_SERVICE] Error sending business notification:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * 📧 Teste de email
   */
  static async sendTestEmail(to: string, type: string = 'test') {
    try {
      const testTemplate = {
        subject: '🧪 Email de Teste - Sistema Koobings',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4f46e5;">🧪 Email de Teste</h2>
            <p>Este é um email de teste do sistema de agendamentos Koobings.</p>
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>✅ Sistema funcionando:</strong> Se recebeu este email, significa que o sistema de emails está configurado correctamente.</p>
            </div>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-PT')}</p>
            <p><strong>Tipo:</strong> ${type}</p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #6b7280;">
              Este é um email automático gerado para teste. Não é necessário responder.
            </p>
          </div>
        `
      };

      const result = await sendEmail({
        to,
        subject: testTemplate.subject,
        html: testTemplate.html
      });

      console.log(`🧪 [EMAIL_SERVICE] Test email result:`, { to, success: result.success });
      return result;

    } catch (error) {
      console.error(`❌ [EMAIL_SERVICE] Test email error:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * 📧 Email de boas-vindas
   */
  static async sendWelcomeEmail(data: WelcomeEmailData) {
    try {
      if (data.type === 'business') {
        const business = await prisma.business.findUnique({
          where: { id: data.businessId },
          select: { name: true, email: true, ownerName: true }
        });

        if (!business?.email) {
          return { success: false, error: 'Business email not found' };
        }

        const welcomeTemplate = {
          subject: '🎉 Bem-vindo ao Koobings!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
                <h1>🎉 Bem-vindo ao Koobings!</h1>
                <p>Obrigado por se juntar à nossa plataforma</p>
              </div>
              
              <div style="padding: 30px 20px;">
                <p>Olá <strong>${business.ownerName || 'Empresário'}</strong>,</p>
                
                <p>É com grande prazer que damos as boas-vindas ao <strong>${business.name}</strong> na plataforma Koobings!</p>
                
                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1e40af;">🚀 Próximos Passos:</h3>
                  <ul>
                    <li>Configure os seus serviços</li>
                    <li>Adicione membros da equipa</li>
                    <li>Defina horários de funcionamento</li>
                    <li>Comece a receber agendamentos!</li>
                  </ul>
                </div>
                
                <p>Se tiver alguma dúvida, não hesite em contactar-nos.</p>
                
                <p>Bem-vindo a bordo! 🚀</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #6b7280;">
                <p><strong>Equipa Koobings</strong></p>
              </div>
            </div>
          `
        };

        return await sendEmail({
          to: business.email,
          subject: welcomeTemplate.subject,
          html: welcomeTemplate.html
        });
      }

      return { success: false, error: 'Unsupported welcome email type' };

    } catch (error) {
      console.error(`❌ [EMAIL_SERVICE] Welcome email error:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * 📊 Estatísticas de emails (futura implementação)
   */
  static async getEmailStats(businessId?: string) {
    // Implementar no futuro com tabela de histórico de emails
    return {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    };
  }
} 