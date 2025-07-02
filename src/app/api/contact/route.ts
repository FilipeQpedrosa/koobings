import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, phone, message } = await request.json()

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Compose email
    const emailSubject = `Nova mensagem de contacto - ${name} ${company ? `(${company})` : ''}`
    const emailHtml = `
      <h2>Nova mensagem de contacto da Koobings</h2>
      
      <h3>Informações do contacto:</h3>
      <ul>
        <li><strong>Nome:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        ${company ? `<li><strong>Empresa/Negócio:</strong> ${company}</li>` : ''}
        ${phone ? `<li><strong>Telefone:</strong> ${phone}</li>` : ''}
      </ul>
      
      <h3>Mensagem:</h3>
      <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
      
      <hr>
      <p><small>Esta mensagem foi enviada através do formulário de contacto em koobings.com</small></p>
    `

    const emailText = `
Nova mensagem de contacto da Koobings

Informações do contacto:
- Nome: ${name}
- Email: ${email}
${company ? `- Empresa/Negócio: ${company}` : ''}
${phone ? `- Telefone: ${phone}` : ''}

Mensagem:
${message}

---
Esta mensagem foi enviada através do formulário de contacto em koobings.com
    `

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'Admin@koobings.com',
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    })

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Obrigado pelo seu contacto - Koobings',
      html: `
        <h2>Obrigado pelo seu contacto!</h2>
        
        <p>Olá ${name},</p>
        
        <p>Recebemos a sua mensagem e entraremos em contacto consigo em breve.</p>
        
        <p>A sua mensagem:</p>
        <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${message}</p>
        
        <p>Obrigado pelo interesse na Koobings!</p>
        
        <p>Com os melhores cumprimentos,<br>
        Equipa Koobings</p>
        
        <hr>
        <p><small>Admin@koobings.com | koobings.com</small></p>
      `,
      text: `
Obrigado pelo seu contacto!

Olá ${name},

Recebemos a sua mensagem e entraremos em contacto consigo em breve.

A sua mensagem:
${message}

Obrigado pelo interesse na Koobings!

Com os melhores cumprimentos,
Equipa Koobings

Admin@koobings.com | koobings.com
      `
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 