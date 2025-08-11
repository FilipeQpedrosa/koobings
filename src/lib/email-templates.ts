interface EmailTemplate {
  subject: string;
  html: string;
}

interface AppointmentData {
  clientName: string;
  serviceName: string;
  staffName: string;
  businessName: string;
  date: Date;
  time: string;
  duration: number;
  businessPhone?: string;
  businessAddress?: string;
  notes?: string;
}

interface BusinessData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
}

// Base email styles
const emailStyles = `
  <style>
    .email-container {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .content {
      padding: 30px 20px;
    }
    .appointment-card {
      background-color: #f8fafc;
      border-left: 4px solid #4f46e5;
      padding: 20px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 10px 0;
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .label {
      font-weight: 600;
      color: #374151;
    }
    .value {
      color: #6b7280;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-confirmed {
      background-color: #d1fae5;
      color: #065f46;
    }
    .status-rejected {
      background-color: #fee2e2;
      color: #991b1b;
    }
    .status-completed {
      background-color: #dbeafe;
      color: #1e40af;
    }
    .footer {
      background-color: #f8fafc;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
    }
    .btn-primary {
      display: inline-block;
      background-color: #4f46e5;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 10px 0;
    }
  </style>
`;

export const emailTemplates = {
  // 📧 Confirmação de agendamento
  appointmentConfirmation: (data: AppointmentData): EmailTemplate => ({
    subject: `✅ Agendamento Confirmado - ${data.serviceName}`,
    html: `
      ${emailStyles}
      <div class="email-container">
        <div class="header">
          <h1>🎉 Agendamento Confirmado!</h1>
          <p>O seu agendamento foi aceite e confirmado</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${data.clientName}</strong>,</p>
          
          <p>Temos o prazer de confirmar o seu agendamento:</p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="label">📋 Serviço:</span>
              <span class="value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">👨‍💼 Profissional:</span>
              <span class="value">${data.staffName}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Data:</span>
              <span class="value">${data.date.toLocaleDateString('pt-PT', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Hora:</span>
              <span class="value">${data.time}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏱️ Duração:</span>
              <span class="value">${data.duration} minutos</span>
            </div>
            <div class="detail-row">
              <span class="label">🏢 Local:</span>
              <span class="value">${data.businessName}</span>
            </div>
            ${data.notes ? `
            <div class="detail-row">
              <span class="label">📝 Notas:</span>
              <span class="value">${data.notes}</span>
            </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <span class="status-badge status-confirmed">✅ Confirmado</span>
          </div>
          
          ${data.businessPhone ? `
          <p><strong>📞 Contacto:</strong> ${data.businessPhone}</p>
          ` : ''}
          
          <p><strong>⚠️ Importante:</strong> Por favor chegue 5-10 minutos antes da hora marcada.</p>
          
          <p>Se precisar de alterar ou cancelar, contacte-nos com antecedência.</p>
        </div>
        
        <div class="footer">
          <p><strong>${data.businessName}</strong></p>
          <p>Este email foi enviado automaticamente pelo sistema de agendamentos.</p>
        </div>
      </div>
    `
  }),

  // 📧 Lembrete de agendamento
  appointmentReminder: (data: AppointmentData): EmailTemplate => ({
    subject: `⏰ Lembrete: ${data.serviceName} amanhã às ${data.time}`,
    html: `
      ${emailStyles}
      <div class="email-container">
        <div class="header">
          <h1>⏰ Lembrete de Agendamento</h1>
          <p>O seu agendamento é amanhã!</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${data.clientName}</strong>,</p>
          
          <p>Este é um lembrete amigável do seu agendamento para <strong>amanhã</strong>:</p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="label">📋 Serviço:</span>
              <span class="value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">👨‍💼 Profissional:</span>
              <span class="value">${data.staffName}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Hora:</span>
              <span class="value"><strong>${data.time}</strong></span>
            </div>
            <div class="detail-row">
              <span class="label">🏢 Local:</span>
              <span class="value">${data.businessName}</span>
            </div>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>💡 Dica:</strong> Chegue 5-10 minutos antes da hora marcada.</p>
          </div>
          
          ${data.businessPhone ? `
          <p><strong>📞 Contacto:</strong> ${data.businessPhone}</p>
          ` : ''}
          
          <p>Aguardamos por si!</p>
        </div>
        
        <div class="footer">
          <p><strong>${data.businessName}</strong></p>
          <p>Se não conseguir comparecer, contacte-nos o quanto antes.</p>
        </div>
      </div>
    `
  }),

  // 📧 Agendamento rejeitado
  appointmentRejected: (data: AppointmentData & { reason?: string }): EmailTemplate => ({
    subject: `❌ Agendamento não confirmado - ${data.serviceName}`,
    html: `
      ${emailStyles}
      <div class="email-container">
        <div class="header">
          <h1>😔 Agendamento Não Confirmado</h1>
          <p>Infelizmente não foi possível confirmar o seu agendamento</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${data.clientName}</strong>,</p>
          
          <p>Lamentamos informar que não foi possível confirmar o seu agendamento:</p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="label">📋 Serviço:</span>
              <span class="value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Data:</span>
              <span class="value">${data.date.toLocaleDateString('pt-PT')}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Hora:</span>
              <span class="value">${data.time}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <span class="status-badge status-rejected">❌ Não Confirmado</span>
          </div>
          
          ${data.reason ? `
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Motivo:</strong> ${data.reason}</p>
          </div>
          ` : ''}
          
          <p>Sugerimos que:</p>
          <ul>
            <li>Escolha uma data/hora alternativa</li>
            <li>Contacte-nos directamente para mais opções</li>
            <li>Visite o nosso site para ver disponibilidade</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn-primary">Ver Outras Datas</a>
          </div>
          
          ${data.businessPhone ? `
          <p><strong>📞 Contacto:</strong> ${data.businessPhone}</p>
          ` : ''}
        </div>
        
        <div class="footer">
          <p><strong>${data.businessName}</strong></p>
          <p>Obrigado pela sua compreensão.</p>
        </div>
      </div>
    `
  }),

  // 📧 Serviço concluído
  appointmentCompleted: (data: AppointmentData & { rating?: boolean }): EmailTemplate => ({
    subject: `🏆 Serviço Concluído - ${data.serviceName}`,
    html: `
      ${emailStyles}
      <div class="email-container">
        <div class="header">
          <h1>🏆 Serviço Concluído!</h1>
          <p>Obrigado por escolher os nossos serviços</p>
        </div>
        
        <div class="content">
          <p>Olá <strong>${data.clientName}</strong>,</p>
          
          <p>O seu serviço foi concluído com sucesso!</p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="label">📋 Serviço:</span>
              <span class="value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">👨‍💼 Profissional:</span>
              <span class="value">${data.staffName}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Data:</span>
              <span class="value">${data.date.toLocaleDateString('pt-PT')}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Hora:</span>
              <span class="value">${data.time}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <span class="status-badge status-completed">🏆 Concluído</span>
          </div>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="margin-top: 0; color: #065f46;">💚 Obrigado pela sua preferência!</h3>
            <p>Esperamos que tenha ficado satisfeito com o nosso serviço.</p>
          </div>
          
          ${data.rating ? `
          <div style="text-align: center; margin: 30px 0;">
            <p><strong>Como foi a sua experiência?</strong></p>
            <a href="#" class="btn-primary">⭐ Deixar Avaliação</a>
          </div>
          ` : ''}
          
          <p>Volte sempre! Estaremos sempre à sua disposição.</p>
          
          ${data.businessPhone ? `
          <p><strong>📞 Contacto:</strong> ${data.businessPhone}</p>
          ` : ''}
        </div>
        
        <div class="footer">
          <p><strong>${data.businessName}</strong></p>
          <p>Foi um prazer servi-lo!</p>
        </div>
      </div>
    `
  }),

  // 📧 Novo agendamento para o negócio
  newAppointmentNotification: (data: AppointmentData): EmailTemplate => ({
    subject: `🔔 Novo Agendamento - ${data.serviceName}`,
    html: `
      ${emailStyles}
      <div class="email-container">
        <div class="header">
          <h1>🔔 Novo Agendamento Recebido</h1>
          <p>Um cliente fez um novo agendamento</p>
        </div>
        
        <div class="content">
          <p><strong>Novo agendamento pendente de confirmação:</strong></p>
          
          <div class="appointment-card">
            <div class="detail-row">
              <span class="label">👤 Cliente:</span>
              <span class="value"><strong>${data.clientName}</strong></span>
            </div>
            <div class="detail-row">
              <span class="label">📋 Serviço:</span>
              <span class="value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="label">👨‍💼 Profissional:</span>
              <span class="value">${data.staffName}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Data:</span>
              <span class="value">${data.date.toLocaleDateString('pt-PT', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏰ Hora:</span>
              <span class="value">${data.time}</span>
            </div>
            <div class="detail-row">
              <span class="label">⏱️ Duração:</span>
              <span class="value">${data.duration} minutos</span>
            </div>
            ${data.notes ? `
            <div class="detail-row">
              <span class="label">📝 Notas:</span>
              <span class="value">${data.notes}</span>
            </div>
            ` : ''}
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⚠️ Ação Necessária:</strong> Acesse o painel administrativo para confirmar ou rejeitar este agendamento.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="btn-primary">🎛️ Abrir Painel</a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>${data.businessName}</strong></p>
          <p>Sistema de Gestão de Agendamentos</p>
        </div>
      </div>
    `
  })
}; 