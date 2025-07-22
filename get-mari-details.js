const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getMariDetails() {
  try {
    console.log('🔍 [DETAILS] Obtendo detalhes do Mari Nails para criar agendamento...\n');

    const mariNailsId = 'e06c3e8b-c956-4610-acd0-edd451c3131e';

    // Get Mari Nails with services and staff
    const mariNails = await prisma.business.findUnique({
      where: { id: mariNailsId },
      include: {
        Service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            description: true
          }
        },
        Staff: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    if (!mariNails) {
      console.log('❌ Mari Nails não encontrado!');
      return;
    }

    console.log('🏢 NEGÓCIO: Mari Nails');
    console.log(`   ID: ${mariNails.id}`);
    console.log(`   Nome: ${mariNails.name}`);
    console.log(`   Email: ${mariNails.email}`);
    console.log();

    console.log('💅 SERVIÇOS DISPONÍVEIS:');
    if (mariNails.Service.length === 0) {
      console.log('   ❌ Nenhum serviço encontrado');
    } else {
      mariNails.Service.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name}`);
        console.log(`      ID: ${service.id}`);
        console.log(`      Preço: €${service.price}`);
        console.log(`      Duração: ${service.duration}min`);
        console.log(`      Descrição: ${service.description || 'N/A'}`);
        console.log();
      });
    }

    console.log('👥 STAFF DISPONÍVEL:');
    if (mariNails.Staff.length === 0) {
      console.log('   ❌ Nenhum staff encontrado');
    } else {
      mariNails.Staff.forEach((staff, index) => {
        console.log(`   ${index + 1}. ${staff.name}`);
        console.log(`      ID: ${staff.id}`);
        console.log(`      Email: ${staff.email}`);
        console.log(`      Role: ${staff.role}`);
        console.log();
      });
    }

    // Create a test appointment if we have services and staff
    if (mariNails.Service.length > 0 && mariNails.Staff.length > 0) {
      const testService = mariNails.Service[0];
      const testStaff = mariNails.Staff[0];

      console.log('🧪 CRIANDO AGENDAMENTO DE TESTE...');
      console.log(`   Serviço: ${testService.name} (${testService.id})`);
      console.log(`   Staff: ${testStaff.name} (${testStaff.id})`);
      console.log();

      const appointmentData = {
        clientName: "Filipe Teste Completo",
        clientEmail: "filipe@koobings.com",
        clientPhone: "+351 912 345 678",
        businessId: mariNailsId,
        serviceId: testService.id,
        staffId: testStaff.id,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        notes: "Agendamento de teste via script para verificar sistema de emails"
      };

      console.log('📋 DADOS DO AGENDAMENTO:');
      console.log(JSON.stringify(appointmentData, null, 2));
      console.log();

      try {
        const response = await fetch('https://koobings.com/api/client/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(appointmentData)
        });

        const result = await response.json();
        
        console.log('📡 RESPOSTA DA API:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${result.success}`);
        
        if (result.success) {
          console.log(`   ✅ Agendamento criado com ID: ${result.data?.id || 'N/A'}`);
          console.log('   📧 Email automático DEVE ter sido enviado para:');
          console.log(`      - Estabelecimento: ${mariNails.email}`);
          console.log(`      - Tipo: Nova marcação (PENDING)`);
          console.log();
          console.log('🔍 VERIFICAR CAIXAS DE ENTRADA:');
          console.log(`   1. ${mariNails.email} - Notificação de nova marcação`);
          console.log(`   2. admin@koobings.com - Cópia de diagnóstico`);
        } else {
          console.log(`   ❌ Erro: ${result.error?.message || 'Erro desconhecido'}`);
          console.log(`   🔧 Code: ${result.error?.code || 'N/A'}`);
          if (result.error?.details) {
            console.log(`   📋 Detalhes:`, result.error.details);
          }
        }
      } catch (error) {
        console.log('   ❌ Erro na requisição:', error.message);
      }
    } else {
      console.log('❌ Não é possível criar agendamento - faltam serviços ou staff');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getMariDetails(); 