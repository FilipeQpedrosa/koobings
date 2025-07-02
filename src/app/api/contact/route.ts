import { NextRequest, NextResponse } from 'next/server'

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

    // Here you could:
    // 1. Save to database
    // 2. Send email notification
    // 3. Integrate with CRM
    // For now, we'll just log it and return success

    // TODO: Add email sending logic when SMTP is configured
    // await sendNotificationEmail({ name, email, phone, message })

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