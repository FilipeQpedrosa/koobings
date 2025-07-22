const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCountIssue() {
  try {
    console.log('🔍 [DEBUG] Testando problema de contagem de serviços...\n');

    const mariNailsId = 'e06c3e8b-c956-4610-acd0-edd451c3131e';

    // Test the exact query used by the visibility API
    console.log('1️⃣ Query exata da API de visibilidade:');
    const businessWithCount = await prisma.business.findUnique({
      where: { id: mariNailsId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            Service: true,
            Staff: true,
            appointments: true
          }
        }
      }
    });

    console.log('Resultado da query da API:');
    console.log('   Nome:', businessWithCount?.name);
    console.log('   _count.Service:', businessWithCount?._count.Service);
    console.log('   _count.Staff:', businessWithCount?._count.Staff);
    console.log('   _count.appointments:', businessWithCount?._count.appointments);

    // Test different variations of the service count
    console.log('\n2️⃣ Teste de variações do nome da relação:');
    
    try {
      const testLowercase = await prisma.business.findUnique({
        where: { id: mariNailsId },
        select: {
          _count: {
            select: {
              service: true  // lowercase
            }
          }
        }
      });
      console.log('   lowercase "service":', testLowercase?._count?.service);
    } catch (error) {
      console.log('   lowercase "service": ERRO -', error.message.split('\n')[0]);
    }

    try {
      const testServices = await prisma.business.findUnique({
        where: { id: mariNailsId },
        select: {
          _count: {
            select: {
              services: true  // plural lowercase
            }
          }
        }
      });
      console.log('   plural "services":', testServices?._count?.services);
    } catch (error) {
      console.log('   plural "services": ERRO -', error.message.split('\n')[0]);
    }

    // Test direct service count
    console.log('\n3️⃣ Contagem direta de serviços:');
    const directServiceCount = await prisma.service.count({
      where: { businessId: mariNailsId }
    });
    console.log('   Contagem direta:', directServiceCount);

    // Test with includes
    console.log('\n4️⃣ Teste com include:');
    const businessWithIncludes = await prisma.business.findUnique({
      where: { id: mariNailsId },
      include: {
        Service: true,
        Staff: true
      }
    });

    console.log('   Services (include):', businessWithIncludes?.Service?.length || 0);
    console.log('   Staff (include):', businessWithIncludes?.Staff?.length || 0);

    if (businessWithIncludes?.Service) {
      console.log('\n📋 Lista de serviços encontrados:');
      businessWithIncludes.Service.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.name} (ID: ${service.id})`);
      });
    }

    // Check schema for the exact relationship name
    console.log('\n5️⃣ Verificando esquema Prisma...');
    
    // Let's check what relations are actually available
    console.log('📚 Testando todas as relações possíveis:');
    
    const relationTests = [
      'Service', 'service', 'Services', 'services',
      'Staff', 'staff', 'Staffs', 'staffs',
      'appointments', 'Appointments', 'appointment', 'Appointment'
    ];

    for (const relation of relationTests) {
      try {
        const query = {
          where: { id: mariNailsId },
          select: {
            _count: {
              select: {
                [relation]: true
              }
            }
          }
        };
        
        const result = await prisma.business.findUnique(query);
        console.log(`   ✅ "${relation}":`, result?._count?.[relation]);
      } catch (error) {
        console.log(`   ❌ "${relation}": ERRO`);
      }
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCountIssue(); 