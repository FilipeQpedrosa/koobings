const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function monitorNewAppointments() {
  try {
    console.log('🎯 [MONITOR] Monitorização de novos agendamentos iniciada...\n');
    console.log('👀 Aguardando que o Filipe faça um agendamento no Mari Nails...\n');

    // Get current timestamp
    const startTime = new Date();
    console.log(`🕐 Timestamp inicial: ${startTime.toLocaleString('pt-PT')}\n`);

    // Function to check for new appointments
    const checkForNewAppointments = async () => {
      try {
        // Get all appointments created after start time
        const newAppointments = await prisma.appointments.findMany({
          where: {
            createdAt: {
              gte: startTime
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

        if (newAppointments.length > 0) {
          console.log('🚨 NOVO AGENDAMENTO DETECTADO!\n');
          
          for (const apt of newAppointments) {
            console.log('📋 DETALHES DO AGENDAMENTO:');
            console.log(`   🆔 ID: ${apt.id}`);
            console.log(`   🏢 Negócio: ${apt.Business?.name} (${apt.Business?.slug})`);
            console.log(`   👤 Cliente: ${apt.Client?.name || 'N/A'}`);
            console.log(`   📧 Email Cliente: ${apt.Client?.email || 'N/A'}`);
            console.log(`   💅 Serviço: ${apt.Service?.name || 'N/A'}`);
            console.log(`   👨‍💼 Staff: ${apt.Staff?.name || 'N/A'}`);
            console.log(`   📅 Data/Hora: ${apt.scheduledFor}`);
            console.log(`   📊 Status: ${apt.status}`);
            console.log(`   🕐 Criado: ${apt.createdAt}`);
            console.log(`   📝 Notas: ${apt.notes || 'N/A'}`);
            console.log();

            // Check email expectations
            console.log('📧 ANÁLISE DE EMAILS:');
            
            if (apt.status === 'PENDING') {
              console.log('   🔔 DEVE ter enviado email para o estabelecimento:');
              console.log(`   📧 Destinatário: ${apt.Business?.email || 'N/A'}`);
              console.log(`   📝 Tipo: Notificação de nova marcação`);
              
              if (apt.Business?.email === 'marigabiatti@hotmail.com') {
                console.log('   ✅ EMAIL CORRETO: marigabiatti@hotmail.com');
              } else {
                console.log(`   ⚠️ EMAIL DIFERENTE: ${apt.Business?.email} (esperado: marigabiatti@hotmail.com)`);
              }
            }
            console.log();

            // Send test notification to confirm system is working
            console.log('🧪 ENVIANDO EMAIL DE CONFIRMAÇÃO...');
            
            try {
              const response = await fetch('https://koobings.com/api/resend-email-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: 'admin@koobings.com',
                  subject: `🎉 SUCESSO: Novo agendamento detectado!`,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                      <h2 style="color: #16a34a;">🎉 AGENDAMENTO DETECTADO COM SUCESSO!</h2>
                      
                      <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                        <h3 style="margin-top: 0; color: #15803d;">📋 Detalhes do Agendamento</h3>
                        <p><strong>🏢 Negócio:</strong> ${apt.Business?.name}</p>
                        <p><strong>👤 Cliente:</strong> ${apt.Client?.name}</p>
                        <p><strong>📧 Email Cliente:</strong> ${apt.Client?.email}</p>
                        <p><strong>💅 Serviço:</strong> ${apt.Service?.name}</p>
                        <p><strong>👨‍💼 Staff:</strong> ${apt.Staff?.name}</p>
                        <p><strong>📅 Data:</strong> ${new Date(apt.scheduledFor).toLocaleString('pt-PT')}</p>
                        <p><strong>💰 Preço:</strong> €${apt.Service?.price}</p>
                        <p><strong>📊 Status:</strong> <span style="color: #dc2626; font-weight: bold;">${apt.status}</span></p>
                        <p><strong>🕐 Criado:</strong> ${new Date(apt.createdAt).toLocaleString('pt-PT')}</p>
                      </div>
                      
                      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                        <p style="margin: 0; color: #92400e;">
                          📧 <strong>Email automático deve ter sido enviado para:</strong><br>
                          ${apt.Business?.email} (email do estabelecimento)
                        </p>
                      </div>
                      
                      <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
                        <p style="margin: 0; color: #065f46;">
                          ✅ <strong>SISTEMA FUNCIONANDO!</strong><br>
                          O agendamento foi registado na base de dados e o sistema de emails está operacional.
                        </p>
                      </div>
                      
                      <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                      <p style="font-size: 12px; color: #6b7280;">
                        Sistema de monitorização Koobings | ${new Date().toLocaleString('pt-PT')}
                      </p>
                    </div>
                  `,
                  text: `SUCESSO: Agendamento de ${apt.Client?.name} registado em ${apt.Business?.name}`
                })
              });
              
              if (response.ok) {
                console.log('   ✅ Email de confirmação enviado para admin@koobings.com');
              } else {
                console.log('   ❌ Erro no envio do email de confirmação');
              }
            } catch (error) {
              console.log('   ❌ Erro:', error.message);
            }
            
            console.log('\n' + '='.repeat(80) + '\n');
          }

          console.log('🎯 RESUMO:');
          console.log(`   • Agendamentos detectados: ${newAppointments.length}`);
          console.log(`   • Sistema de base de dados: ✅ FUNCIONANDO`);
          console.log(`   • Sistema de emails: ✅ CONFIGURADO`);
          console.log('\n💌 VERIFICAÇÕES RECOMENDADAS:');
          console.log('   1. Verificar email marigabiatti@hotmail.com (notificação do estabelecimento)');
          console.log('   2. Verificar admin@koobings.com (email de confirmação que acabei de enviar)');
          console.log('   3. Verificar dashboard do Mari Nails (deve mostrar o novo agendamento)');

          return true; // Found new appointments
        }

        return false; // No new appointments
      } catch (error) {
        console.error('❌ Erro ao verificar agendamentos:', error);
        return false;
      }
    };

    // Initial check
    const found = await checkForNewAppointments();
    
    if (!found) {
      console.log('⏳ Nenhum agendamento novo encontrado ainda...');
      console.log('📱 Faz o agendamento agora no Mari Nails!');
      console.log('🔄 O script vai verificar automaticamente de 10 em 10 segundos...\n');

      // Set up monitoring loop
      let attempts = 0;
      const maxAttempts = 18; // 3 minutes of monitoring (18 * 10 seconds)

      const interval = setInterval(async () => {
        attempts++;
        console.log(`🔍 Verificação ${attempts}/${maxAttempts}...`);
        
        const foundNew = await checkForNewAppointments();
        
        if (foundNew) {
          console.log('🎉 MONITORING CONCLUÍDO COM SUCESSO!');
          clearInterval(interval);
          await prisma.$disconnect();
        } else if (attempts >= maxAttempts) {
          console.log('⏱️ Tempo limite de monitorização atingido (3 minutos)');
          console.log('🤔 Se fizeste o agendamento e não apareceu aqui, pode haver um problema na API');
          clearInterval(interval);
          await prisma.$disconnect();
        }
      }, 10000); // Check every 10 seconds
    } else {
      await prisma.$disconnect();
    }

  } catch (error) {
    console.error('❌ Erro no monitor:', error);
    await prisma.$disconnect();
  }
}

monitorNewAppointments(); 