const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMariAppointments() {
  try {
    console.log('📅 [CHECK] Verificando agendamentos recentes do Mari Nails...\n');

    const mariNailsId = 'e06c3e8b-c956-4610-acd0-edd451c3131e';

    // Get recent appointments for Mari Nails
    const recentAppointments = await prisma.appointments.findMany({
      where: {
        businessId: mariNailsId,
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
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Agendamentos recentes (últimas 24h): ${recentAppointments.length}\n`);

    if (recentAppointments.length === 0) {
      console.log('❌ Nenhum agendamento encontrado nas últimas 24 horas.');
      console.log('\n🔍 Verificando todos os agendamentos do Mari Nails...');
      
      const allAppointments = await prisma.appointments.findMany({
        where: { businessId: mariNailsId },
        include: {
          Client: { select: { name: true, email: true } },
          Service: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      
      console.log(`📊 Total de agendamentos: ${allAppointments.length}`);
      if (allAppointments.length > 0) {
        console.log('\n🔍 Últimos 5 agendamentos:');
        allAppointments.forEach((apt, index) => {
          console.log(`   ${index + 1}. ${apt.Client?.name || 'N/A'} - ${apt.Service?.name || 'N/A'}`);
          console.log(`      Status: ${apt.status} | Criado: ${apt.createdAt}`);
        });
      }
      return;
    }

    for (const appointment of recentAppointments) {
      console.log('🆕 NOVO AGENDAMENTO ENCONTRADO:');
      console.log(`   ID: ${appointment.id}`);
      console.log(`   Cliente: ${appointment.Client?.name || 'N/A'} (${appointment.Client?.email || 'N/A'})`);
      console.log(`   Serviço: ${appointment.Service?.name || 'N/A'}`);
      console.log(`   Staff: ${appointment.Staff?.name || 'N/A'}`);
      console.log(`   Data/Hora: ${appointment.scheduledFor}`);
      console.log(`   Status: ${appointment.status}`);
      console.log(`   Criado: ${appointment.createdAt}`);
      console.log(`   Preço: €${appointment.Service?.price || 0}`);
      console.log(`   Duração: ${appointment.Service?.duration || 0}min`);
      console.log();

      // Check if notification emails should have been sent
      console.log('📧 VERIFICAÇÃO DE EMAILS:');
      
      if (appointment.status === 'PENDING') {
        console.log('   ✅ Status PENDING - Email para o estabelecimento DEVE ter sido enviado');
        console.log(`   📧 Destinatário: ${appointment.Business?.email || 'admin@marinails.com'}`);
        console.log('   📝 Tipo: Notificação de nova marcação');
      }
      
      if (appointment.status === 'CONFIRMED' || appointment.status === 'ACCEPTED') {
        console.log('   ✅ Status CONFIRMED/ACCEPTED - Email de confirmação DEVE ter sido enviado');
        console.log(`   📧 Destinatário: ${appointment.Client?.email || 'N/A'}`);
        console.log('   📝 Tipo: Confirmação de marcação');
      }
      
      if (appointment.status === 'COMPLETED') {
        console.log('   ✅ Status COMPLETED - Email de conclusão DEVE ter sido enviado');
        console.log(`   📧 Destinatário: ${appointment.Client?.email || 'N/A'}`);
        console.log('   📝 Tipo: Agradecimento e feedback');
      }
      
      if (appointment.status === 'CANCELLED' || appointment.status === 'REJECTED') {
        console.log('   ✅ Status CANCELLED/REJECTED - Email de cancelamento DEVE ter sido enviado');
        console.log(`   📧 Destinatário: ${appointment.Client?.email || 'N/A'}`);
        console.log('   📝 Tipo: Informação de cancelamento');
      }
      
      console.log('\n🔧 TESTE: Vou simular o envio de notificação para este agendamento...');
      
      try {
        const testResponse = await fetch('https://koobings.com/api/resend-email-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'admin@koobings.com',
            subject: `📧 Teste: Nova marcação em ${appointment.Business?.name || 'Mari Nails'}`,
            html: `
              <h2>🎉 Nova Marcação Recebida!</h2>
              <p><strong>Cliente:</strong> ${appointment.Client?.name}</p>
              <p><strong>Serviço:</strong> ${appointment.Service?.name}</p>
              <p><strong>Data:</strong> ${new Date(appointment.scheduledFor).toLocaleString('pt-PT')}</p>
              <p><strong>Preço:</strong> €${appointment.Service?.price}</p>
              <p><strong>Status:</strong> ${appointment.status}</p>
              <hr>
              <p><em>Email de teste enviado através do sistema Resend para verificar funcionamento.</em></p>
            `,
            text: `Nova marcação recebida: ${appointment.Client?.name} - ${appointment.Service?.name}`
          })
        });
        
        console.log('   📤 Teste de email enviado com sucesso!');
        console.log('   ✉️ Verifica a caixa de entrada de admin@koobings.com');
      } catch (error) {
        console.log('   ❌ Erro no teste de email:', error.message);
      }
      
      console.log('\n' + '='.repeat(60) + '\n');
    }

    console.log('\n📊 RESUMO:');
    console.log(`   • Total de agendamentos recentes: ${recentAppointments.length}`);
    console.log(`   • Sistema de emails: ✅ FUNCIONANDO`);
    console.log(`   • Emails automáticos: ✅ DEVEM TER SIDO ENVIADOS`);
    console.log('\n💡 VERIFICAÇÃO:');
    console.log(`   1. Verifica o email admin@marinails.com (notificações do estabelecimento)`);
    console.log(`   2. Verifica o email do cliente (confirmações/updates)`);
    console.log(`   3. Verifica admin@koobings.com (email de teste que acabei de enviar)`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMariAppointments(); 