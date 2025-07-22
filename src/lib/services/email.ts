import { sendBrevoEmail } from './brevo-email';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Main email sending function - using Brevo with verified sender
 * Automatically handles appointment-related notifications
 */
export async function sendEmail(options: EmailOptions) {
  try {
    console.log('📧 [EMAIL_SERVICE] Sending email via Brevo...');
    
    const result = await sendBrevoEmail({
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      from: 'noreply@koobings.com' // Use verified domain sender
    });

    if (result.success) {
      console.log('✅ [EMAIL_SERVICE] Email sent successfully via Brevo');
      return {
        success: true,
        messageId: result.messageId,
        service: 'Brevo'
      };
    } else {
      console.error('❌ [EMAIL_SERVICE] Brevo failed:', result.error);
      return {
        success: false,
        error: result.error,
        service: 'Brevo'
      };
    }
  } catch (error: any) {
    console.error('❌ [EMAIL_SERVICE] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error',
      service: 'Brevo'
    };
  }
}

// Compatibility function for appointment notifications
export async function sendAppointmentEmail(options: {
  to: string;
  subject: string;
  html: string;
  type?: 'confirmation' | 'reminder' | 'cancellation' | 'completion';
}) {
  console.log(`📧 [APPOINTMENT_EMAIL] Sending ${options.type || 'notification'} email to:`, options.to);
  
  return sendEmail({
    to: options.to,
    subject: options.subject,
    html: options.html,
    from: process.env.RESEND_FROM_EMAIL || 'admin@koobings.com'
  });
}

// Template email functions
export async function sendAppointmentConfirmation(email: string, appointmentDetails: any) {
  return sendAppointmentEmail({
    to: email,
    subject: '✅ Marcação Confirmada - Koobings',
    html: generateAppointmentConfirmationHTML(appointmentDetails),
    type: 'confirmation'
  });
}

export async function sendAppointmentReminder(email: string, appointmentDetails: any) {
  return sendAppointmentEmail({
    to: email,
    subject: '⏰ Lembrete da sua Marcação - Koobings',
    html: generateAppointmentReminderHTML(appointmentDetails),
    type: 'reminder'
  });
}

export async function sendAppointmentCancellation(email: string, appointmentDetails: any) {
  return sendAppointmentEmail({
    to: email,
    subject: '❌ Marcação Cancelada - Koobings',
    html: generateAppointmentCancellationHTML(appointmentDetails),
    type: 'cancellation'
  });
}

export async function sendAppointmentCompletion(email: string, appointmentDetails: any) {
  return sendAppointmentEmail({
    to: email,
    subject: '🎉 Consulta Concluída - Koobings',
    html: generateAppointmentCompletionHTML(appointmentDetails),
    type: 'completion'
  });
}

// HTML template generators
function generateAppointmentConfirmationHTML(details: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #059669;">✅ Marcação Confirmada</h1>
      <p>A sua marcação foi confirmada com sucesso!</p>
      <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📅 Detalhes da Marcação:</h3>
        <p><strong>Serviço:</strong> ${details.service || 'N/A'}</p>
        <p><strong>Data:</strong> ${details.date || 'N/A'}</p>
        <p><strong>Hora:</strong> ${details.time || 'N/A'}</p>
        <p><strong>Profissional:</strong> ${details.staff || 'N/A'}</p>
      </div>
      <p>Obrigado por escolher os nossos serviços!</p>
    </div>
  `;
}

function generateAppointmentReminderHTML(details: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #d97706;">⏰ Lembrete da sua Marcação</h1>
      <p>Não se esqueça da sua marcação!</p>
      <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📅 Detalhes da Marcação:</h3>
        <p><strong>Serviço:</strong> ${details.service || 'N/A'}</p>
        <p><strong>Data:</strong> ${details.date || 'N/A'}</p>
        <p><strong>Hora:</strong> ${details.time || 'N/A'}</p>
        <p><strong>Profissional:</strong> ${details.staff || 'N/A'}</p>
      </div>
      <p>Aguardamos por si!</p>
    </div>
  `;
}

function generateAppointmentCancellationHTML(details: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626;">❌ Marcação Cancelada</h1>
      <p>A sua marcação foi cancelada.</p>
      <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📅 Detalhes da Marcação Cancelada:</h3>
        <p><strong>Serviço:</strong> ${details.service || 'N/A'}</p>
        <p><strong>Data:</strong> ${details.date || 'N/A'}</p>
        <p><strong>Hora:</strong> ${details.time || 'N/A'}</p>
      </div>
      <p>Se desejar reagendar, entre em contacto connosco.</p>
    </div>
  `;
}

function generateAppointmentCompletionHTML(details: any) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #059669;">🎉 Consulta Concluída</h1>
      <p>A sua consulta foi concluída com sucesso!</p>
      <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📅 Detalhes da Consulta:</h3>
        <p><strong>Serviço:</strong> ${details.service || 'N/A'}</p>
        <p><strong>Data:</strong> ${details.date || 'N/A'}</p>
        <p><strong>Profissional:</strong> ${details.staff || 'N/A'}</p>
      </div>
      <p>Obrigado pela sua preferência! Esperamos vê-lo novamente em breve.</p>
    </div>
  `;
} 