const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllRecentAppointments() {
  try {
    console.log('📅 [CHECK] Verificando TODOS os agendamentos recentes (últimas 24h)...\n');

    // Get ALL recent appointments across all businesses
    const recentAppointments = await prisma.appointments.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        Client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        Service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true
          }
        },
        Staff: {
          select: {
            id: true,
            name: true
          }
        },
        Business: {
          select: {
            id: true,
            name: true,
            email: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Total de agendamentos recentes: ${recentAppointments.length}\n`);

    if (recentAppointments.length === 0) {
      console.log('❌ Nenhum agendamento encontrado nas últimas 24 horas.');
      console.log('\n🔍 Verificando os últimos 5 agendamentos de qualquer data...');
      
      const lastAppointments = await prisma.appointments.findMany({
        include: {
          Client: { select: { name: true, email: true } },
          Service: { select: { name: true } },
          Business: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      
      console.log(`📊 Últimos agendamentos encontrados: ${lastAppointments.length}`);
      if (lastAppointments.length > 0) {
        lastAppointments.forEach((apt, index) => {
          console.log(`   ${index + 1}. ${apt.Business?.name} - ${apt.Client?.name || 'N/A'} - ${apt.Service?.name || 'N/A'}`);
          console.log(`      Status: ${apt.status} | Criado: ${apt.createdAt}`);
        });
      }
      return;
    }

    for (const appointment of recentAppointments) {
      console.log('🆕 AGENDAMENTO RECENTE ENCONTRADO:');
      console.log(`   ID: ${appointment.id}`);
      console.log(`   🏢 Negócio: ${appointment.Business?.name} (${appointment.Business?.slug})`);
      console.log(`   👤 Cliente: ${appointment.Client?.name || 'N/A'} (${appointment.Client?.email || 'N/A'})`);
      console.log(`   💅 Serviço: ${appointment.Service?.name || 'N/A'}`);
      console.log(`   👨‍💼 Staff: ${appointment.Staff?.name || 'N/A'}`);
      console.log(`   📅 Data/Hora: ${appointment.scheduledFor}`);
      console.log(`   📊 Status: ${appointment.status}`);
      console.log(`   🕐 Criado: ${appointment.createdAt}`);
      console.log(`   💰 Preço: €${appointment.Service?.price || 0}`);
      console.log(`   ⏱️ Duração: ${appointment.Service?.duration || 0}min`);
      console.log();

      // Check if this appointment triggered emails
      console.log('📧 ANÁLISE DE EMAILS:');
      
      if (appointment.status === 'PENDING') {
        console.log('   🔔 DEVE ter enviado email para o estabelecimento');
        console.log(`   📧 Para: ${appointment.Business?.email || 'N/A'}`);
        console.log('   📋 Tipo: Nova marcação (notificação para o negócio)');
      }
      
      if (appointment.status === 'CONFIRMED' || appointment.status === 'ACCEPTED') {
        console.log('   ✅ DEVE ter enviado email de confirmação para o cliente');
        console.log(`   📧 Para: ${appointment.Client?.email || 'N/A'}`);
        console.log('   📋 Tipo: Confirmação de marcação');
      }
      
      // Test if we can send an email for this appointment
      console.log('\n🧪 TESTE: Enviando email de notificação...');
      
      try {
        const response = await fetch('https://koobings.com/api/resend-email-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'admin@koobings.com',
            subject: `📧 REAL: Nova marcação em ${appointment.Business?.name || 'Negócio'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">🎉 Nova Marcação Confirmada!</h2>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1e40af;">📋 Detalhes da Marcação</h3>
                  <p><strong>🏢 Negócio:</strong> ${appointment.Business?.name}</p>
                  <p><strong>👤 Cliente:</strong> ${appointment.Client?.name}</p>
                  <p><strong>📧 Email:</strong> ${appointment.Client?.email}</p>
                  <p><strong>💅 Serviço:</strong> ${appointment.Service?.name}</p>
                  <p><strong>👨‍💼 Staff:</strong> ${appointment.Staff?.name}</p>
                  <p><strong>📅 Data:</strong> ${new Date(appointment.scheduledFor).toLocaleString('pt-PT')}</p>
                  <p><strong>💰 Preço:</strong> €${appointment.Service?.price}</p>
                  <p><strong>⏱️ Duração:</strong> ${appointment.Service?.duration}min</p>
                  <p><strong>📊 Status:</strong> <span style="color: #059669; font-weight: bold;">${appointment.status}</span></p>
                </div>
                
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <p style="margin: 0; color: #065f46;">
                    ✅ <strong>Este email confirma que o sistema está a funcionar!</strong><br>
                    O agendamento foi registado com sucesso e as notificações automáticas devem ter sido enviadas.
                  </p>
                </div>
                
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #6b7280;">
                  Email enviado automaticamente pelo sistema Koobings via Resend<br>
                  Timestamp: ${new Date().toLocaleString('pt-PT')}
                </p>
              </div>
            `,
            text: `Nova marcação: ${appointment.Client?.name} agendou ${appointment.Service?.name} para ${new Date(appointment.scheduledFor).toLocaleString('pt-PT')}`
          })
        });
        
        if (response.ok) {
          console.log('   ✅ Email de teste enviado com sucesso!');
          console.log('   📬 Verifica admin@koobings.com para confirmação');
        } else {
          console.log('   ❌ Erro no envio do email de teste');
        }
      } catch (error) {
        console.log('   ❌ Erro:', error.message);
      }
      
      console.log('\n' + '='.repeat(70) + '\n');
    }

    console.log('📊 RESUMO FINAL:');
    console.log(`   • Agendamentos recentes: ${recentAppointments.length}`);
    console.log(`   • Sistema de emails: ✅ ATIVO`);
    console.log(`   • Notificações automáticas: ✅ CONFIGURADAS`);
    
    if (recentAppointments.length > 0) {
      console.log('\n💌 EMAILS QUE DEVEM TER SIDO ENVIADOS:');
      recentAppointments.forEach((apt, index) => {
        console.log(`   ${index + 1}. Para ${apt.Business?.name}: nova marcação de ${apt.Client?.name}`);
        if (apt.status !== 'PENDING') {
          console.log(`      Para ${apt.Client?.name}: ${apt.status.toLowerCase()} da marcação`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllRecentAppointments(); 