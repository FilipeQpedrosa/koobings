const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findMariBusinesses() {
  try {
    console.log('🔍 [SEARCH] Procurando todos os negócios com "Mari" ou "Nails"...\n');

    // Find all businesses with Mari or Nails in name
    const businesses = await prisma.business.findMany({
      where: {
        OR: [
          { name: { contains: 'Mari', mode: 'insensitive' } },
          { name: { contains: 'Nails', mode: 'insensitive' } }
        ]
      },
      include: {
        _count: {
          select: {
            appointments: true,
            Service: true,
            Staff: true
          }
        }
      }
    });

    console.log(`📋 Negócios encontrados: ${businesses.length}\n`);

    if (businesses.length === 0) {
      console.log('❌ Nenhum negócio encontrado com "Mari" ou "Nails"');
      return;
    }

    for (const business of businesses) {
      console.log('🏢 NEGÓCIO ENCONTRADO:');
      console.log(`   ID: ${business.id}`);
      console.log(`   Nome: ${business.name}`);
      console.log(`   Slug: ${business.slug}`);
      console.log(`   Email: ${business.email}`);
      console.log(`   Status: ${business.status}`);
      console.log(`   Agendamentos: ${business._count.appointments}`);
      console.log(`   Serviços: ${business._count.Service}`);
      console.log(`   Staff: ${business._count.Staff}`);
      console.log();

      if (business._count.appointments > 0) {
        console.log('📅 VERIFICANDO AGENDAMENTOS DESTE NEGÓCIO:');
        
        // Get appointments for this business
        const appointments = await prisma.appointments.findMany({
          where: { businessId: business.id },
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
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        });

        console.log(`   📊 Total de agendamentos: ${appointments.length}`);

        appointments.forEach((apt, index) => {
          console.log(`   ${index + 1}. ${apt.Client?.name || 'N/A'} - ${apt.Service?.name || 'N/A'}`);
          console.log(`      📅 Data: ${apt.scheduledFor}`);
          console.log(`      📊 Status: ${apt.status}`);
          console.log(`      🕐 Criado: ${apt.createdAt}`);
          console.log(`      👤 Cliente Email: ${apt.Client?.email || 'N/A'}`);
          console.log(`      💰 Preço: €${apt.Service?.price || 0}`);
          console.log();

          // Check what emails should have been sent
          if (apt.status === 'PENDING') {
            console.log(`      📧 EMAIL PENDENTE: Notificação para ${business.email}`);
          }
          if (apt.status === 'ACCEPTED' || apt.status === 'CONFIRMED') {
            console.log(`      📧 EMAIL ACEITO: Confirmação para ${apt.Client?.email}`);
          }
          if (apt.status === 'REJECTED') {
            console.log(`      📧 EMAIL REJEITADO: Cancelamento para ${apt.Client?.email}`);
          }
          if (apt.status === 'COMPLETED') {
            console.log(`      📧 EMAIL COMPLETO: Agradecimento para ${apt.Client?.email}`);
          }
        });

        // Test sending email for most recent appointment
        if (appointments.length > 0) {
          const recentApt = appointments[0];
          console.log('\n🧪 TESTE: Enviando email de notificação do agendamento mais recente...');
          
          try {
            const response = await fetch('https://koobings.com/api/resend-email-test', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: 'admin@koobings.com',
                subject: `📧 FOUND: Agendamento de ${recentApt.Client?.name} em ${business.name}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2563eb;">🎯 Agendamento Encontrado!</h2>
                    
                    <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9;">
                      <h3 style="margin-top: 0; color: #0c4a6e;">📋 Detalhes Confirmados</h3>
                      <p><strong>🏢 Negócio:</strong> ${business.name}</p>
                      <p><strong>🆔 Business ID:</strong> ${business.id}</p>
                      <p><strong>👤 Cliente:</strong> ${recentApt.Client?.name}</p>
                      <p><strong>📧 Email Cliente:</strong> ${recentApt.Client?.email}</p>
                      <p><strong>💅 Serviço:</strong> ${recentApt.Service?.name}</p>
                      <p><strong>👨‍💼 Staff:</strong> ${recentApt.Staff?.name}</p>
                      <p><strong>📅 Data:</strong> ${new Date(recentApt.scheduledFor).toLocaleString('pt-PT')}</p>
                      <p><strong>💰 Preço:</strong> €${recentApt.Service?.price}</p>
                      <p><strong>📊 Status:</strong> <span style="color: #059669; font-weight: bold;">${recentApt.status}</span></p>
                      <p><strong>🕐 Criado:</strong> ${new Date(recentApt.createdAt).toLocaleString('pt-PT')}</p>
                    </div>
                    
                    <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                      <p style="margin: 0; color: #92400e;">
                        ⚠️ <strong>Este agendamento deveria ter disparado emails automáticos!</strong><br>
                        Verificar se o sistema de notificações está funcionando corretamente.
                      </p>
                    </div>
                    
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #6b7280;">
                      Sistema de diagnóstico Koobings | ${new Date().toLocaleString('pt-PT')}
                    </p>
                  </div>
                `,
                text: `Agendamento encontrado: ${recentApt.Client?.name} em ${business.name} - Status: ${recentApt.status}`
              })
            });
            
            if (response.ok) {
              console.log('   ✅ Email de diagnóstico enviado!');
              console.log('   📬 Verifica admin@koobings.com');
            } else {
              console.log('   ❌ Erro no envio do email');
            }
          } catch (error) {
            console.log('   ❌ Erro:', error.message);
          }
        }
      }
      
      console.log('\n' + '='.repeat(80) + '\n');
    }

    console.log('📊 RESUMO DA BUSCA:');
    console.log(`   • Negócios encontrados: ${businesses.length}`);
    const totalAppointments = businesses.reduce((sum, b) => sum + b._count.appointments, 0);
    console.log(`   • Total de agendamentos: ${totalAppointments}`);
    console.log(`   • Sistema de busca: ✅ FUNCIONANDO`);

    if (totalAppointments > 0) {
      console.log('\n🎯 CONCLUSÃO:');
      console.log('   • Agendamentos foram encontrados na base de dados');
      console.log('   • Os emails automáticos DEVEM ter sido enviados');
      console.log('   • Verificar caixas de entrada dos destinatários');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findMariBusinesses(); 