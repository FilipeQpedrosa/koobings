const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugMariNails() {
  try {
    console.log('🔍 [DEBUG] Listando todos os negócios...\n');

    // List all businesses first
    const allBusinesses = await prisma.business.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        _count: {
          select: {
            Service: true,
            Staff: true,
            appointments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📋 Total de negócios: ${allBusinesses.length}\n`);
    
    allBusinesses.forEach((business, index) => {
      console.log(`${index + 1}. ${business.name}`);
      console.log(`   ID: ${business.id}`);
      console.log(`   Email: ${business.email}`);
      console.log(`   Status: ${business.status}`);
      console.log(`   Serviços: ${business._count.Service} | Staff: ${business._count.Staff} | Agendamentos: ${business._count.appointments}`);
      console.log();
    });

    // Find businesses with "Mari" or similar
    console.log('🔍 Procurando negócios com "Mari" no nome...\n');
    
    const mariBusinesses = allBusinesses.filter(b => 
      b.name.toLowerCase().includes('mari') || 
      b.name.toLowerCase().includes('nail') ||
      b.name.toLowerCase().includes('unha')
    );

    if (mariBusinesses.length > 0) {
      console.log('🎯 Negócios relacionados encontrados:');
      mariBusinesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business.name} (${business._count.Service} serviços)`);
      });
      
      // Get detailed info for the first match
      const targetBusiness = mariBusinesses[0];
      console.log(`\n🔍 Detalhes de "${targetBusiness.name}":\n`);
      
      const detailedBusiness = await prisma.business.findUnique({
        where: { id: targetBusiness.id },
        include: {
          Service: true,
          Staff: true,
          _count: {
            select: {
              Service: true,
              Staff: true,
              appointments: true
            }
          }
        }
      });

      if (detailedBusiness) {
        console.log('📊 Contagens (_count):');
        console.log(`   Serviços: ${detailedBusiness._count.Service}`);
        console.log(`   Staff: ${detailedBusiness._count.Staff}`);
        console.log(`   Agendamentos: ${detailedBusiness._count.appointments}`);
        console.log();

        console.log('🔧 Serviços diretos (array):');
        console.log(`   Total: ${detailedBusiness.Service.length}`);
        if (detailedBusiness.Service.length > 0) {
          detailedBusiness.Service.forEach((service, index) => {
            console.log(`   ${index + 1}. ${service.name} (ID: ${service.id})`);
            console.log(`      Preço: €${service.price}`);
            console.log(`      Duração: ${service.duration}min`);
            console.log(`      BusinessID: ${service.businessId}`);
            console.log(`      Criado: ${service.createdAt}`);
            console.log();
          });
        } else {
          console.log('   ❌ Nenhum serviço encontrado!');
        }

        // Check visibility settings
        console.log('👁️ Configurações de visibilidade:');
        const settings = detailedBusiness.settings || {};
        const visibility = settings.visibility || {};
        console.log('   AdminApproved:', visibility.adminApproved);
        console.log('   ShowInMarketplace:', visibility.showInMarketplace);
        console.log('   Settings completas:', JSON.stringify(settings, null, 2));
      }
    } else {
      console.log('❌ Nenhum negócio relacionado encontrado!');
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function fixSamsungBusiness() {
  try {
    console.log('🔍 [DEBUG] Configurando Samsung para teste...\n');

    // Find Samsung business
    const samsung = await prisma.business.findFirst({
      where: { name: 'Samsung' },
      include: {
        Service: true,
        Staff: true,
        _count: {
          select: {
            Service: true,
            Staff: true,
            appointments: true
          }
        }
      }
    });

    if (!samsung) {
      console.log('❌ Samsung não encontrado!');
      return;
    }

    console.log('✅ Samsung encontrado:');
    console.log(`   ID: ${samsung.id}`);
    console.log(`   Nome: ${samsung.name}`);
    console.log(`   Email: ${samsung.email}`);
    console.log(`   Status: ${samsung.status}`);
    console.log(`   Serviços: ${samsung._count.Service}`);
    console.log(`   Staff: ${samsung._count.Staff}`);
    console.log();

    // Check current visibility settings
    const currentSettings = samsung.settings || {};
    const currentVisibility = currentSettings.visibility || {};
    
    console.log('🔧 Configurações atuais de visibilidade:');
    console.log('   AdminApproved:', currentVisibility.adminApproved);
    console.log('   ShowInMarketplace:', currentVisibility.showInMarketplace);
    console.log();

    // Update visibility settings to make it approvable
    const newSettings = {
      ...currentSettings,
      visibility: {
        ...currentVisibility,
        adminApproved: false, // Not approved yet so you can test approval
        showInMarketplace: true,
        showInSearch: true,
        allowOnlineBooking: true,
        isPublic: false, // Will be enabled when approved
        adminNotes: 'Business configured for testing approval workflow',
        lastUpdatedBy: 'system-auto',
        lastUpdatedAt: new Date().toISOString()
      }
    };

    // Update Samsung business
    const updatedSamsung = await prisma.business.update({
      where: { id: samsung.id },
      data: {
        settings: newSettings,
        updatedAt: new Date()
      }
    });

    console.log('✅ Samsung atualizado com configurações de visibilidade!');
    console.log('📊 Estatísticas para aprovação:');
    console.log(`   ✅ Serviços: ${samsung._count.Service} (tem serviços)`);
    console.log(`   ${samsung._count.Staff > 0 ? '✅' : '❌'} Staff: ${samsung._count.Staff}`);
    console.log(`   ${samsung._count.appointments > 0 ? '✅' : '⚪'} Agendamentos: ${samsung._count.appointments}`);
    console.log();
    
    // Add staff if missing
    if (samsung._count.Staff === 0) {
      console.log('➕ Adicionando staff ao Samsung...');
      const staffId = require('crypto').randomUUID();
      
      await prisma.staff.create({
        data: {
          id: staffId,
          name: 'Admin Samsung',
          email: 'admin@samsung.com',
          password: '$2b$10$dummy.password.hash.for.testing',
          role: 'ADMIN',
          businessId: samsung.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      console.log('✅ Staff adicionado ao Samsung!');
    }

    console.log('\n🎯 INSTRUÇÕES:');
    console.log('1. Vai ao admin portal: /admin/businesses');
    console.log('2. Clica em "Samsung"');
    console.log('3. Clica em "Visibilidade"');
    console.log('4. Agora deves ver:');
    console.log('   - Prontidão: 70% (serviços ✅ + staff ✅)');
    console.log('   - Controlo: "Não Aprovado" → podes aprovar');
    console.log('   - Guardar deve funcionar!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugMariNails();
fixSamsungBusiness(); 