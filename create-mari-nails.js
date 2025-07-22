const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createMariNails() {
  try {
    console.log('✨ [CREATE] Criando negócio "Mari Nails" para teste...\n');

    // Check if Mari Nails already exists
    const existing = await prisma.business.findFirst({
      where: { 
        OR: [
          { name: { contains: 'Mari', mode: 'insensitive' } },
          { name: { contains: 'Nails', mode: 'insensitive' } }
        ]
      }
    });

    if (existing) {
      console.log('⚠️ Negócio similar já existe:', existing.name);
      console.log('   Será usado para teste.');
      return;
    }

    const businessId = crypto.randomUUID();
    const staffId = crypto.randomUUID();
    const now = new Date();

    // Create Mari Nails business
    console.log('📝 Criando Mari Nails...');
    const mariNails = await prisma.business.create({
      data: {
        id: businessId,
        name: 'Mari Nails',
        slug: 'mari-nails',
        email: 'admin@marinails.com',
        ownerName: 'Maria Silva',
        phone: '+351 912 345 678',
        address: 'Rua das Unhas, 123, Lisboa',
        description: 'Salão de beleza especializado em nail art e manicures profissionais',
        status: 'ACTIVE',
        settings: {
          visibility: {
            adminApproved: false, // Not approved yet for testing
            showInMarketplace: true,
            showInSearch: true,
            allowOnlineBooking: true,
            isPublic: false,
            adminNotes: 'Negócio criado para teste de aprovação',
            lastUpdatedBy: 'system-create',
            lastUpdatedAt: now.toISOString()
          },
          features: {
            multipleStaff: true,
            advancedReports: true,
            smsNotifications: false,
            customBranding: false,
            apiAccess: false,
            calendarIntegration: true
          },
          plan: 'standard'
        },
        passwordHash: '$2b$10$dummy.password.hash.for.testing',
        createdAt: now,
        updatedAt: now
      }
    });

    console.log('✅ Mari Nails criado:', mariNails.id);

    // Create admin staff
    console.log('👤 Criando staff admin...');
    const adminStaff = await prisma.staff.create({
      data: {
        id: staffId,
        name: 'Maria Silva',
        email: 'admin@marinails.com',
        password: '$2b$10$dummy.password.hash.for.testing',
        role: 'ADMIN',
        businessId: businessId,
        createdAt: now,
        updatedAt: now
      }
    });

    console.log('✅ Staff admin criado:', adminStaff.id);

    // Create services
    console.log('💅 Criando serviços...');
    const services = [
      {
        id: crypto.randomUUID(),
        name: 'Manicure Clássica',
        description: 'Manicure tradicional com verniz normal',
        price: 15.00,
        duration: 45,
        businessId: businessId,
        createdAt: now,
        updatedAt: now
      },
      {
        id: crypto.randomUUID(),
        name: 'Nail Art',
        description: 'Decoração artística personalizada',
        price: 25.00,
        duration: 60,
        businessId: businessId,
        createdAt: now,
        updatedAt: now
      },
      {
        id: crypto.randomUUID(),
        name: 'Gel Polish',
        description: 'Verniz em gel de longa duração',
        price: 20.00,
        duration: 50,
        businessId: businessId,
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const service of services) {
      await prisma.service.create({ data: service });
    }

    console.log(`✅ ${services.length} serviços criados!`);

    // Verify creation
    const verification = await prisma.business.findUnique({
      where: { id: businessId },
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

    console.log('\n📊 VERIFICAÇÃO FINAL:');
    console.log(`   Nome: ${verification.name}`);
    console.log(`   ID: ${verification.id}`);
    console.log(`   Email: ${verification.email}`);
    console.log(`   Serviços: ${verification._count.Service}`);
    console.log(`   Staff: ${verification._count.Staff}`);
    console.log(`   Agendamentos: ${verification._count.appointments}`);

    const settings = verification.settings || {};
    const visibility = settings.visibility || {};
    console.log('\n👁️ Configurações de visibilidade:');
    console.log(`   AdminApproved: ${visibility.adminApproved}`);
    console.log(`   ShowInMarketplace: ${visibility.showInMarketplace}`);

    console.log('\n🎯 INSTRUÇÕES DE TESTE:');
    console.log('1. Vai a /admin/businesses');
    console.log('2. Procura "Mari Nails"');
    console.log('3. Clica em "Visibilidade"');
    console.log('4. Verás:');
    console.log('   - Prontidão: 90% (serviços ✅ + staff ✅ + descrição ✅ + endereço ✅ + telefone ✅)');
    console.log('   - Controlo: "Não Aprovado" (podes aprovar)');
    console.log('   - Agora podes testar o sistema de aprovação!');

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMariNails(); 