import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/services/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Log the contact form submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      message,
      timestamp: new Date().toISOString()
    })

    // Send notification email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@koobings.com'
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nova Mensagem de Contacto - Koobings</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Detalhes do Contacto:</h3>
          
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
          
          <h4 style="color: #1e293b;">Mensagem:</h4>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #2563eb; margin: 10px 0;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <p style="color: #64748b; font-size: 14px;">
          Esta mensagem foi enviada através do formulário de contacto do site Koobings.
          <br>Data: ${new Date().toLocaleString('pt-PT')}
        </p>
      </div>
    `

    // Try to send email notification
    const emailResult = await sendEmail({
      to: adminEmail,
      subject: `Nova Mensagem de Contacto - ${name}`,
      html: emailHtml
    })

    if (!emailResult.success) {
      console.warn('Failed to send email notification:', emailResult.error)
      // Don't fail the request if email fails, just log it
    }

    // Send confirmation email to the user
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Obrigado pelo seu contacto!</h2>
        
        <p>Olá ${name},</p>
        
        <p>Recebemos a sua mensagem e agradecemos o seu interesse no Koobings.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
          <p><strong>A sua mensagem:</strong></p>
          <p style="font-style: italic;">"${message}"</p>
        </div>
        
        <p>A nossa equipa irá analisar a sua mensagem e entrar em contacto consigo o mais brevemente possível.</p>
        
        <p>Cumprimentos,<br>
        <strong>Equipa Koobings</strong><br>
        O seu parceiro digital de confiança</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="color: #64748b; font-size: 12px;">
          Este email foi enviado automaticamente. Por favor não responda a este email.
          <br>Para questões adicionais, contacte-nos através de admin@koobings.com
        </p>
      </div>
    `

    await sendEmail({
      to: email,
      subject: 'Koobings - Confirmação de Contacto Recebido',
      html: confirmationHtml
    })

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso! Entraremos em contacto consigo em breve.'
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 