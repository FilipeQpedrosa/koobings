const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugServiceConnection() {
  try {
    console.log('🔍 [DEBUG] Verificando ligação entre Mari Nails e serviços...\n');

    // First, let's find Mari Nails by slug
    const businessBySlug = await prisma.business.findUnique({
      where: { slug: 'mari-nails' },
      select: { id: true, name: true, slug: true }
    });

    console.log('🏢 Negócio encontrado por slug:');
    console.log(businessBySlug);
    console.log();

    if (!businessBySlug) {
      console.log('❌ Nenhum negócio encontrado com slug "mari-nails"');
      return;
    }

    // Now let's check services for this business
    const services = await prisma.service.findMany({
      where: { businessId: businessBySlug.id }
    });

    console.log(`💅 Serviços encontrados para ${businessBySlug.name}: ${services.length}`);
    services.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.name} (${service.id})`);
      console.log(`      BusinessId: ${service.businessId}`);
      console.log(`      Preço: €${service.price}`);
      console.log(`      Duração: ${service.duration}min`);
      console.log();
    });

    // Check staff too
    const staff = await prisma.staff.findMany({
      where: { businessId: businessBySlug.id }
    });

    console.log(`👥 Staff encontrado para ${businessBySlug.name}: ${staff.length}`);
    staff.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.name} (${member.id})`);
      console.log(`      BusinessId: ${member.businessId}`);
      console.log(`      Email: ${member.email}`);
      console.log(`      Role: ${member.role}`);
      console.log();
    });

    // Try to find the specific service we tried to use
    const specificService = await prisma.service.findFirst({
      where: {
        id: '030cfd15-d96e-448b-b1cb-9a144180dc5e',
        businessId: businessBySlug.id
      }
    });

    console.log('🎯 Serviço específico que tentámos usar:');
    if (specificService) {
      console.log('   ✅ ENCONTRADO!');
      console.log(`   Nome: ${specificService.name}`);
      console.log(`   ID: ${specificService.id}`);
      console.log(`   BusinessId: ${specificService.businessId}`);
    } else {
      console.log('   ❌ NÃO ENCONTRADO!');
      console.log('   Isso explica porque a API retornou "Service not found"');
    }

    // Let's verify the business ID mismatch
    console.log('\n🔍 VERIFICAÇÃO DE IDs:');
    console.log(`   Business ID esperado: ${businessBySlug.id}`);
    
    const serviceCheck = await prisma.service.findUnique({
      where: { id: '030cfd15-d96e-448b-b1cb-9a144180dc5e' },
      include: { Business: { select: { name: true, slug: true } } }
    });

    if (serviceCheck) {
      console.log(`   Serviço pertence ao negócio: ${serviceCheck.Business?.name} (${serviceCheck.Business?.slug})`);
      console.log(`   BusinessId do serviço: ${serviceCheck.businessId}`);
      
      if (serviceCheck.businessId !== businessBySlug.id) {
        console.log('   ❌ PROBLEMA: BusinessId não coincide!');
      } else {
        console.log('   ✅ BusinessId coincide perfeitamente');
      }
    }

    // Let's create a proper appointment with correct IDs
    if (services.length > 0 && staff.length > 0) {
      console.log('\n🧪 TENTATIVA DE CRIAÇÃO COM IDs CORRETOS:');
      
      const testAppointmentData = {
        businessSlug: 'mari-nails',
        clientName: 'Filipe Teste Debug',
        clientEmail: 'filipe.debug@koobings.com',
        clientPhone: '+351 912 345 678',
        serviceId: services[0].id,
        staffId: staff[0].id,
        scheduledFor: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
        notes: 'Agendamento de debug para testar emails'
      };

      console.log('📋 Dados do agendamento:');
      console.log(JSON.stringify(testAppointmentData, null, 2));
      
      try {
        const response = await fetch('https://koobings.com/api/client/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testAppointmentData)
        });

        const result = await response.json();
        
        console.log('\n📡 RESULTADO:');
        console.log(`   Status: ${response.status}`);
        console.log(`   Success: ${result.success}`);
        
        if (result.success) {
          console.log(`   ✅ SUCESSO! Agendamento criado: ${result.data?.id}`);
          console.log('\n📧 EMAILS QUE DEVEM TER SIDO ENVIADOS:');
          console.log(`   1. Para o negócio (${businessBySlug.name}): Nova marcação`);
          console.log(`   2. Email: ${staff[0].email || 'N/A'}`);
          console.log('\n🔍 VERIFICAR AGORA:');
          console.log('   - Caixa de entrada do negócio');
          console.log('   - Dashboard do Mari Nails (deve mostrar o novo agendamento)');
          console.log('   - Base de dados (deve ter o registo)');
        } else {
          console.log(`   ❌ Erro: ${result.error?.message}`);
          console.log(`   Code: ${result.error?.code}`);
        }
      } catch (error) {
        console.log(`   ❌ Erro na requisição: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugServiceConnection(); 